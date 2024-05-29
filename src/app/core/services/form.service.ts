import { Injectable, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  StatusChangeEvent,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';

// Firebase
import { doc, getDoc } from 'firebase/firestore';

// Services
import { AppService } from './app.service';

// Models
import { FormField } from '../../models/formField.model';

// Enums & Constants
import { FieldType } from '../../utils/enums/field-type.enum';
import { AuthMode } from '../../utils/enums/auth-mode.enum';
import { FormId } from '../../utils/constants/formId';
import { Collection } from '../../utils/enums/collection.enum';

// Validators
import { MinimumAgeValidator } from '../validators/minimum-age.validator';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  public form: FormGroup = new FormGroup({});
  public formErrors: Record<string, string> = {};
  public isFormLoading!: boolean;
  public formFields: FormField[] = [];

  authMode = AuthMode;

  appService = inject(AppService);

  formEventSubscription: Subscription = new Subscription();

  prepareForm(formFields: any[]) {
    formFields.map((field) => {
      let validators = [];

      if (field.isRequired) {
        validators.push(Validators.required);
      }

      if (field.type == FieldType.EMAIL) {
        validators.push(Validators.email);
      }

      if (
        (
          [FieldType.TEXT, FieldType.EMAIL, FieldType.PASSWORD] as string[]
        ).includes(field.type)
      ) {
        validators.push(Validators.maxLength(field.maxLength));
        validators.push(Validators.minLength(field.minLength));
      } else if (FieldType.DATE === field.type) {
        validators.push(MinimumAgeValidator);
      }

      const control = new FormControl('', validators);
      this.form.addControl(field.name, control);
    });
  }

  watchFormEvents() {
    this.formEventSubscription = this.form.events.subscribe((event) => {
      if (event instanceof StatusChangeEvent && event.status == 'INVALID') {
        const controls = [this.form.controls];

        for (const control of controls) {
          for (const [name, prop] of Object.entries(control)) {
            if (prop.errors) {
              let errors: string[] = [];

              if (prop.errors['required']) {
                errors.push('<li>This field is required</li>');
              }

              if (prop.errors['email']) {
                errors.push('<li>Invalid email</li>');
              }

              if (prop.errors['maxlength']) {
                errors.push(
                  `<li>This field can have at most ${prop.errors['maxlength']['requiredLength']} characters</li>`
                );
              }

              if (prop.errors['minlength']) {
                errors.push(
                  `<li>This field must have at least ${prop.errors['minlength']['requiredLength']} characters</li>`
                );
              }

              if (prop.errors['matDatepickerParse']) {
                errors.push(`<li>Invalid date format</li>`);
              }

              if (prop.errors['matDatepickerMax']) {
                errors.push(`<li>Date exceeds the maximum allowed date</li>`);
              }

              if (prop.errors['matDatepickerMin']) {
                errors.push(`<li>Date is too early</li>`);
              }

              if (prop.errors['invalidAge']) {
                errors.push(`<li>You must be at least 18 years old</li>`);
              }

              this.formErrors[name] = errors.join('');
            }
          }
        }
      }
    });
  }

  async getAuthFormFields(data: { mode: string }) {
    this.isFormLoading = true;

    const formId: string =
      data.mode == this.authMode.SIGNIN
        ? FormId.SIGN_IN_FORM_ID
        : FormId.SIGN_UP_FORM_ID;
    const docRef = doc(this.appService._appDB, Collection.FORMFIELDS, formId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const docSnapData = docSnap.data();

      if (docSnapData) {
        this.formFields = (docSnapData['fields'] ?? []) as FormField[];
        this.prepareForm(this.formFields);
        this.isFormLoading = false;
      } else {
        this.isFormLoading = false;
      }
    } else {
      this.isFormLoading = false;
    }
  }

  finishWatching() {
    this.form.reset();
    this.formEventSubscription?.unsubscribe();
  }
}
