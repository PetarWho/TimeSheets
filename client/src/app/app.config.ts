import { ApplicationConfig } from "@angular/core";
import { provideRouter, withComponentInputBinding } from "@angular/router";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { importProvidersFrom } from "@angular/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { routes } from "./app.routes";
import { IgxCalendarModule, IgxSnackbarModule } from "igniteui-angular";
import { authInterceptor } from "./core/functions/jwt.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),
    provideRouter(routes, withComponentInputBinding()),
    importProvidersFrom(
      BrowserAnimationsModule,
      MatFormFieldModule,
      MatInputModule,
      ReactiveFormsModule,
      IgxCalendarModule,
      IgxSnackbarModule
    ),
  ],
};
