import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from "@angular/router";
import { Observable, of } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: "root",
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const expectedRoles = route.data["roles"] as Array<string>;

    return this.authService.getUserRole().pipe(
      map((role) => {
        if (!expectedRoles.includes(role.name)) {
          this.router.navigate(["/home"]);
          return false;
        }
        return true;
      }),
      catchError((error) => {
        this.router.navigate(["/login"]);
        return of(false);
      })
    );
  }
}
