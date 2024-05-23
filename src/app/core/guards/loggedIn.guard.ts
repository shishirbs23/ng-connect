import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RouteNames } from '../../app.routes';

export const loggedInGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem("token");

  if (token) {
    router.navigateByUrl(RouteNames.PROFILE);
  }

  return !token;
};
