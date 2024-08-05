import {
  HttpEvent,
  HttpRequest,
  HttpErrorResponse,
  HttpHandlerFn,
} from "@angular/common/http";
import { inject } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";

export const authInterceptor = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  } else {
    router.navigate(["/login"]);
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || !token) {
        authService.removeToken();
        router.navigate(["/login"]);
      }
      return throwError(error);
    })
  );
};
