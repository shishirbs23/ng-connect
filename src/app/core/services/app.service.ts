import { Injectable, inject } from '@angular/core';

// Routing
import { ActivatedRoute } from '@angular/router';

// Moment
import moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  _appDB: any;

  get userId(): string {
    return localStorage.getItem('userId') ?? '';
  }

  getRouteParamData(route: ActivatedRoute, paramName: string) {
    return route.snapshot.paramMap.get(paramName) ?? this.userId;
  }

  static redirectToRoute(): string {
    const token: String = localStorage.getItem('token') ?? '';
    return token ? '/profile' : '/auth';
  }

  formatMomentDate(dateValue: string) {
    return moment(dateValue).format('YYYY-MM-DDTHH:mm:ss.SSSZ');
  }
}
