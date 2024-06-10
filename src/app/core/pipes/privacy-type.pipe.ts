import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'privacyType',
  standalone: true,
})
export class PrivacyTypePipe implements PipeTransform {
  transform(privacyId: number): string {
    if (privacyId == 1) {
      return "Public";
    } else {
      return "Friends";
    }
  }
}
