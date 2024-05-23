import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor() {}

  static redirectToRoute(): string {
    const token: String = localStorage.getItem('token') ?? '';
    return token ? '/profile' : '/auth';
  }
}
