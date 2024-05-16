import { Routes } from '@angular/router';
import { AuthComponent } from './features/auth/auth.component';

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
    redirectTo: RouteNames.AUTH,
  },
  {
    path: RouteNames.AUTH,
    component: AuthComponent,
  },
  {
    path: RouteNames.AUTH,
    loadComponent: () =>
      import('./features/auth/auth.component').then((m) => m.AuthComponent),
  },
  {
    path: RouteNames.PROFILE,
    loadComponent: () =>
      import('./features/profile/profile.component').then(
        (m) => m.ProfileComponent
      ),
  },
  {
    path: RouteNames.USERS,
    loadComponent: () =>
      import('./features/users/users.component').then((m) => m.UsersComponent),
  },
  {
    path: RouteNames.CHAT_LIST,
    loadComponent: () =>
      import('./features/chat-list/chat-list.component').then(
        (m) => m.ChatListComponent
      ),
  },
  {
    path: RouteNames.CHAT_DETAILS,
    loadComponent: () =>
      import('./features/chat-details/chat-details.component').then(
        (m) => m.ChatDetailsComponent
      ),
  },
];
