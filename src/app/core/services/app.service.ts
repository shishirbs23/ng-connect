import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  _appDB: any;

  constructor() {}

  static redirectToRoute(): string {
    const token: String = localStorage.getItem('token') ?? '';
    return token ? '/profile' : '/auth';
  }
}
