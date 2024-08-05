import { Component, NgZone, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ButtonComponent } from "../../shared/buttons/buttons.component";
import { Router, RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../core/services/auth.service";
import TokenResponse from "../../models/tokenResponse";
import { GoogleAuthService } from "../../core/services/google-auth.service";
import { InputFieldComponent } from "../../shared/input-field/input-field.component";
import { redirectToPreviousPageAfterLogin } from "../../core/functions/urlUtils";
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from "@angular/animations";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    FormsModule,
    RouterModule,
    InputFieldComponent,
  ],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
  animations: [
    trigger("fadeInOut", [
      state("void", style({ opacity: 0 })),
      state("*", style({ opacity: 2 })),
      transition(":enter", [
        style({ opacity: 0 }),
        animate("1.2s ease-in", style({ opacity: 2 })),
      ]),
      transition(":leave", [animate("0.5s ease-out", style({ opacity: 0 }))]),
    ]),
  ],
})
export class LoginComponent implements OnInit {
  email: string = "";
  password: string = "";
  required: boolean = true;
  errorMessage: string = "";
  loggedIn: boolean | undefined;
  wave: string;
  signUpImg: string;
  avatarSrc: string;

  constructor(
    private authService: AuthService,
    private googleService: GoogleAuthService,
    private router: Router,
    private ngZone: NgZone,
    private snackBar: MatSnackBar
  ) {
    this.avatarSrc = "../assets/images/avatar1.png";
    this.signUpImg = "../assets/images/image.svg";
    this.wave = "../assets/images/wave.svg";
  }
  showSnackBar(message: string, type: "success" | "error"): void {
    const config: MatSnackBarConfig = {
      duration: this.SNACKBAR_DURATION,
      panelClass: `snackbar-${type}`,
    };
    this.snackBar.open(message, "Close", config);
  }
  private readonly SNACKBAR_DURATION = 2000;

  ngOnInit(): void {
    if (this.authService.getToken()) {
      this.router.navigate(["/home"]);
    }

    this.googleService.setupGoogleLogin((res: any) => {
      this.authService.googleLogin(res).subscribe(() => {
        this.ngZone.run(() => {
          redirectToPreviousPageAfterLogin(this.router);
        });
      });
    });
  }

  onSubmit(): void {
    this.authService.login(this.email, this.password).subscribe(
      (response: TokenResponse) => {
        redirectToPreviousPageAfterLogin(this.router);
      },
      (error: any) => {
        this.showSnackBar("Error login!", "error");
      }
    );
  }
}
