declare var google: any;

import { Inject, Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { AuthService } from "./auth.service";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class GoogleAuthService {
  constructor(
    @Inject(AuthService) private authService: AuthService,
    @Inject(Router) private router: Router
  ) {}

  async googleSignOut(email: string): Promise<void> {
    return new Promise((resolve, reject) => {
      google.accounts.id.disableAutoSelect();
      google.accounts.id.revoke(email, (done: any) => {
        if (done.error) {
          reject(done.error);
        } else {
          resolve();
        }
      });
    });
  }

  setupGoogleLogin(callback: (res: any) => void) {
    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: callback,
    });

    google.accounts.id.renderButton(document.getElementById("googleBtn"), {
      theme: "filled_blue",
      size: "large",
      shape: "square",
      width: 350,
    });
    google.accounts.id.prompt();
  }
}
