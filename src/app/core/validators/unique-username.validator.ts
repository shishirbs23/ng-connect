// Forms
import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';

// Firestore
import { collection, where, query, getDocs } from 'firebase/firestore';

// Services
import { AppService } from '../services/app.service';

// Enums
import { ENTITY } from '../../utils/enums/entity.enum';
import { Collection } from '../../utils/enums/collection.enum';
import { Message } from '../../utils/constants/message';

export class UniqueUsernameValidator {
  static createValidator(appService: AppService): AsyncValidatorFn {
    return async (
      control: AbstractControl
    ): Promise<ValidationErrors | null> => {
      const value = control.value;

      if (!value) {
        return null;
      }

      const profileQuery = query(
        collection(appService._appDB, Collection.PROFILES),
        where(ENTITY.DISPLAY_NAME, '==', value),
        where(ENTITY.IS_DELETED, '==', false)
      );

      const profileSnap = await getDocs(profileQuery);

      return profileSnap.empty
        ? null
        : { uniqueUserName: Message.usernameTaken };
    };
  }
}