import { Injectable } from '@angular/core';
import moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  _appDB: any;

  get userId(): string {
    return localStorage.getItem('userId') ?? '';
  }

  static redirectToRoute(): string {
    const token: String = localStorage.getItem('token') ?? '';
    return token ? '/profile' : '/auth';
  }

  formatMomentDate(dateValue: string) {
    return moment(dateValue).format('YYYY-MM-DDTHH:mm:ss.SSSZ');
  }
}
