import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { AppService } from './core/services/app.service';
import { loggedInGuard } from './core/guards/loggedIn.guard';

export enum RouteNames {
  AUTH = 'auth',
  HOME = 'home',
  PROFILE = 'profile',
  USERS = 'users',
  CHATS = 'chats',
}

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: () => AppService.redirectToRoute(),
  },
  {
    path: RouteNames.AUTH,
    loadComponent: () =>
      import('./features/auth/auth.component').then((m) => m.AuthComponent),
    canActivate: [loggedInGuard],
  },
  {
    path: RouteNames.HOME,
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
    canActivate: [authGuard],
  },
  {
    path: RouteNames.PROFILE,
    loadComponent: () =>
      import('./features/profile/profile.component').then(
        (m) => m.ProfileComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: RouteNames.PROFILE,
    loadComponent: () =>
      import('./features/profile/profile.component').then(
        (m) => m.ProfileComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: RouteNames.USERS,
    loadComponent: () =>
      import('./features/users/users.component').then((m) => m.UsersComponent),
    canActivate: [authGuard],
  },
  {
    path: RouteNames.CHATS,
    loadComponent: () =>
      import('./features/chats/chats.component').then((m) => m.ChatsComponent),
    canActivate: [authGuard],
  },
  {
    path: RouteNames.CHATS,
    loadComponent: () =>
      import('./features/chat-details/chat-details.component').then(
        (m) => m.ChatDetailsComponent
      ),
    canActivate: [authGuard],
  },
];
