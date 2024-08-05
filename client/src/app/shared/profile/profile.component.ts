import { Component, NgZone, OnInit } from "@angular/core";
import { UserService } from "../../core/services/user.service";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { forkJoin } from "rxjs";
import User from "../../models/user";
import { NavbarComponent } from "../navbar/navbar.component";
import { convertUnixToDate } from "../../core/functions/dateFunctions";
import { CommonModule, DatePipe } from "@angular/common";
import { ButtonComponent } from "../buttons/buttons.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { GoogleAuthService } from "../../core/services/google-auth.service";
import { Router } from "@angular/router";
import { AuthService } from "../../core/services/auth.service";
import { redirectToPreviousPageAfterLogin } from "../../core/functions/urlUtils";
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from "@angular/animations";
import { RoleEnum } from "../../models/enums/roles.enum";

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NavbarComponent,
    DatePipe,
    ButtonComponent,
    CommonModule,
  ],
  templateUrl: "./profile.component.html",
  styleUrl: "./profile.component.css",
  animations: [
    trigger("slideInFromBottom", [
      state("void", style({ transform: "translateY(100%)", opacity: 0 })),
      state("*", style({ transform: "translateY(0)", opacity: 1 })),
      transition(":enter", [animate("0.7s ease-in")]),
    ]),
  ],
})
export class ProfileComponent implements OnInit {
  avatarSrc: string;
  user_id: number | null;
  profileForm: FormGroup;
  user: User | null = null;
  editMode: boolean = false;
  userIsAdmin: boolean = false;

  private readonly SNACKBAR_DURATION = 2000;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private googleService: GoogleAuthService,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.avatarSrc = "../assets/images/avatar.svg";
    this.user_id = this.userService.getUserIdFromToken();
    this.profileForm = this.fb.group({
      name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    this.checkRole();
    this.loadData();
  }

  loadData(): void {
    sessionStorage.setItem("redirectUrl", this.router.url);
    if (this.user_id) {
      forkJoin({
        user: this.userService.getUserById(BigInt(this.user_id)),
        roles: this.userService.getRoles(),
      }).subscribe(
        ({ user, roles }) => {
          this.user = user;
          const userRole = roles.find((role) => role.id === user.role_id);
          this.user.role = userRole ? userRole.name : "Unknown role";
          this.avatarSrc = user.avatar || this.avatarSrc;
          this.user.created_at = convertUnixToDate(user.created_at);
          this.user.updated_at = convertUnixToDate(user.updated_at);
          this.profileForm.patchValue({
            name: user.name,
            email: user.email,
          });
          this.loadGoogle();
        },
        (error) => {
          console.error("Error fetching data", error);
        }
      );
    }
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;

    if (this.editMode) {
      this.profileForm.enable();
    } else {
      this.profileForm.disable();
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid && this.user) {
      const updatedUser: User = {
        ...this.user,
        ...this.profileForm.value,
      };
      this.userService.updateUser(updatedUser).subscribe(
        (user) => {
          this.user = user;
          this.snackBar.open("Profile updated successfully", "Close", {
            duration: this.SNACKBAR_DURATION,
          });
          this.loadData();
        },
        (error) => {
          console.error("Error updating user", error);
          this.snackBar.open("Error updating Profile", "Close", {
            duration: this.SNACKBAR_DURATION,
          });
        }
      );
      this.toggleEditMode();
    }
  }

  loadGoogle() {
    if (!this.user?.google_id) {
      this.googleService.setupGoogleLogin((res: any) => {
        this.authService.googleLogin(res).subscribe(() => {
          this.ngZone.run(() => {
            redirectToPreviousPageAfterLogin(this.router);
          });
        });
      });
    }
  }

  checkRole(): void {
    this.authService.getUserRole().subscribe((role) => {
      this.userIsAdmin = role.name == RoleEnum.Admin;
    });
  }
}
