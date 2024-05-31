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

export class UniqueValueValidator {
  static createValidator(appService: AppService): AsyncValidatorFn {
    return async (
      control: AbstractControl
    ): Promise<ValidationErrors | null> => {
      const value = control.value;

      if (!value) {
        return null;
      }

      const userQuery = query(
        collection(appService._appDB, Collection.REGISTERED_USERS),
        where(ENTITY.DISPLAY_NAME, '==', value)
      );

      const userSnap = await getDocs(userQuery);

      return userSnap.empty
        ? null
        : { uniqueUserName: Message.usernameTaken };
    };
  }
}
