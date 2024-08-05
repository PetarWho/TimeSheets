import { Component, NgZone, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../core/services/auth.service";
import TokenResponse from "../../models/tokenResponse";
import { ButtonComponent } from "../../shared/buttons/buttons.component";
import { InputFieldComponent } from "../../shared/input-field/input-field.component";
import { GoogleAuthService } from "../../core/services/google-auth.service";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";

import {
  trigger,
  state,
  style,
  animate,
  transition,
} from "@angular/animations";
@Component({
  selector: "app-sign-up",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    ButtonComponent,
    InputFieldComponent,
  ],
  templateUrl: "./sign-up.component.html",
  styleUrls: ["./sign-up.component.css"],
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
export class SignUpComponent implements OnInit {
  avatarSrc: string;
  wave: string;
  signUpImg: string;
  email: string = "";
  text: string = "";
  name: string = "";
  password: string = "";
  errorMessage: string = "";

  constructor(
    private authService: AuthService,
    private googleService: GoogleAuthService,
    private ngZone: NgZone,
    private snackBar: MatSnackBar,
    private router: Router
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
          this.router.navigate(["/home"]);
        });
      });
    });
  }

  onSubmit(): void {
    this.authService.signUp(this.email, this.name, this.password).subscribe(
      (response: TokenResponse) => {
        this.router.navigate(["/home"]);
      },
      (error) => {
        this.showSnackBar("Error signing up!", "error");
      }
    );
  }
}
