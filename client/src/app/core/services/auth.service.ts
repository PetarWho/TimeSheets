import { Inject, Injectable, InjectionToken, PLATFORM_ID } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { from, Observable, of, throwError } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { jwtDecode } from "jwt-decode";
import TokenResponse from "../../models/tokenResponse";
import User from "../../models/user";
import { environment } from "../environments/environment";
import { isPlatformBrowser } from "@angular/common";
import { Role } from "../../models/role";
import { getUrlBasedOnUserId } from "../functions/urlUtils";
import { Router } from "@angular/router";
import { JwtToken } from "../../models/jwtToken";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private userRole: Role | undefined = undefined;
  private readonly SNACKBAR_DURATION = 2000;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: InjectionToken<Object>,
    @Inject(Router) private router: Router,
    private snackBar: MatSnackBar
  ) {}

  googleLogin(googleResponse: {
    clientId: string;
    client_id: string;
    credential: string;
    select_by: string;
  }): Observable<boolean> {
    const url = `${this.apiUrl}/users/auth/google`;
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
    });

    const body = { token: googleResponse.credential };
    return this.http.post<TokenResponse>(url, body, { headers }).pipe(
      switchMap((response: TokenResponse) => {
        if (response && response.token) {
          this.setToken(response.token);
          return from(this.router.navigate(["/home"]).then(() => true));
        } else {
          throw new Error("Token not received");
        }
      }),
      catchError((error) => {
        this.snackBar.open(
          "This Google account is linked to another account",
          "Close",
          {
            duration: this.SNACKBAR_DURATION,
          }
        );
        return throwError(error);
      })
    );
  }

  login(email: string, password: string): Observable<TokenResponse> {
    const url = `${this.apiUrl}/users/login`;
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
    });
    const body = { email, password };
    return this.http.post<TokenResponse>(url, body, { headers }).pipe(
      map((response: TokenResponse) => {
        if (response && response.token) {
          this.setToken(response.token);
        }
        return response;
      })
    );
  }

  signUp(
    email: string,
    name: string,
    password: string
  ): Observable<TokenResponse> {
    const url = `${this.apiUrl}/users/register`;
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
    });
    const body = { email, name, password };
    return this.http.post<TokenResponse>(url, body, { headers }).pipe(
      map((response: TokenResponse) => {
        if (response && response.token) {
          this.setToken(response.token);
        }
        return response;
      })
    );
  }

  logout(): Observable<{ message: string }> {
    const url = `${this.apiUrl}/users/logout`;

    return this.http.post<{ message: string }>(url, {}).pipe(
      map((response: { message: string }) => {
        this.removeToken();
        this.userRole = undefined;
        return response;
      })
    );
  }

  getUserRole(): Observable<Role> {
    if (this.userRole) {
      return of(this.userRole);
    }

    const userId = this.decodeToken().id;

    return this.http
      .get<User>(getUrlBasedOnUserId(`${this.apiUrl}/users/`, userId))
      .pipe(
        switchMap((user: User) => {
          return this.http
            .get<Role>(`${this.apiUrl}/roles/${user.role_id}`)
            .pipe(
              map((role: Role) => {
                this.userRole = role;
                return role;
              })
            );
        })
      );
  }

  decodeToken(): JwtToken {
    const token = this.getToken();
    if (!token) {
      sessionStorage.setItem("redirectUrl", this.router.url);
      this.router.navigate(["/login"]);
      throw new Error("Invalid token");
    }

    return jwtDecode(token);
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return sessionStorage.getItem("jwtToken");
    }
    return null;
  }

  setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem("jwtToken", token);
    }
  }

  removeToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem("jwtToken");
    }
  }
}
