import { Router } from "@angular/router";

export function getUrlBasedOnUserId(url: string, userId: number) {
  return url + userId;
}

export function redirectToPreviousPageAfterLogin(router: Router) {
  const redirectUrl = sessionStorage.getItem("redirectUrl") || "/home";
  sessionStorage.removeItem("redirectUrl");
  router.navigate([redirectUrl]);
}
