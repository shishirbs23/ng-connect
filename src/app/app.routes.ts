import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { CommonService } from './core/services/common.service';
import { loggedInGuard } from './core/guards/loggedIn.guard';

export enum RouteNames {
  AUTH = 'auth',
  PROFILE = 'profile',
  USERS = 'users',
  CHAT_LIST = 'chat-list',
  CHAT_DETAILS = 'chat-details',
}

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: () => CommonService.redirectToRoute(),
  },
  {
    path: RouteNames.AUTH,
    loadComponent: () =>
      import('./features/auth/auth.component').then((m) => m.AuthComponent),
    canActivate: [loggedInGuard]
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
    path: RouteNames.CHAT_LIST,
    loadComponent: () =>
      import('./features/chat-list/chat-list.component').then(
        (m) => m.ChatListComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: RouteNames.CHAT_DETAILS,
    loadComponent: () =>
      import('./features/chat-details/chat-details.component').then(
        (m) => m.ChatDetailsComponent
      ),
    canActivate: [authGuard],
  },
];
