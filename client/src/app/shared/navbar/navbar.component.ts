import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../core/services/auth.service";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { GoogleAuthService } from "../../core/services/google-auth.service";
import { UserService } from "../../core/services/user.service";
import User from "../../models/user";
import { forkJoin } from "rxjs";
import { RoleEnum } from "../../models/enums/roles.enum";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: "./navbar.component.html",
  styleUrl: "./navbar.component.css",
})
export class NavbarComponent implements OnInit {
  user_id: number | null;
  user: User | null = null;
  avatarSrc: string;
  isAdmin!: boolean;

  private readonly SNACKBAR_DURATION = 2000;
  constructor(
    private router: Router,
    public authService: AuthService,
    private googleService: GoogleAuthService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {
    this.avatarSrc = "../../../assets/images/avatar.svg";
    this.user_id = this.userService.getUserIdFromToken();
  }

  isDropdownOpen: boolean = false;

  ngOnInit(): void {
    sessionStorage.setItem("redirectUrl", this.router.url);
    this.checkRole();
    this.loadData();
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  loadData(): void {
    if (this.user_id) {
      forkJoin({
        user: this.userService.getUserById(BigInt(this.user_id)),
      }).subscribe(
        ({ user }) => {
          this.user = user;
          this.avatarSrc = user.avatar || this.avatarSrc;
        },
        (error) => {
          console.error("Error fetching data", error);
          this.snackBar.open("Error fetching data", "Close", {
            duration: this.SNACKBAR_DURATION,
          });
        }
      );
    }
  }

  async onLogout(): Promise<void> {
    try {
      await this.googleService.googleSignOut(
        await this.userService.getUserEmail()
      );
    } catch (error) {
    } finally {
      await this.authService.logout().toPromise();
      this.router.navigate(["/login"]);
    }
  }

  checkRole() {
    this.authService.getUserRole().subscribe((role) => {
      if (role.name == RoleEnum.Admin) {
        this.isAdmin = true;
      }
    });
  }
}
