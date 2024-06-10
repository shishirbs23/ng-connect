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
import { AuthFormField } from '../../models/formField.model';

// Enums & Constants
import { FieldType } from '../../utils/enums/field-type.enum';
import { AuthMode } from '../../utils/enums/auth-mode.enum';
import { FormId } from '../../utils/constants/form-id';
import { Collection } from '../../utils/enums/collection.enum';

// Validators
import { MinimumAgeValidator } from '../validators/minimum-age.validator';
import { LeadingAlphabeticValidator } from '../validators/leading-alphabetic.validator';
import { HasExtraSpaceValidator } from '../validators/has-extra-space.validator';
import { MaxLengthValidator } from '../validators/max-length.validator';
import { MinLengthValidator } from '../validators/min-length.validator';
import { PasswordStrengthValidator } from '../validators/password-strength.validator';
import { PasswordMatchValidator } from '../validators/password-match.validator';
import { UniqueEmailValidator } from '../validators/unique-email.validator';
import { UniqueUsernameValidator } from '../validators/unique-username.validator';

// Contants
import { ENTITY } from '../../utils/enums/entity.enum';
import { FormType } from '../../utils/enums/form-type.enum';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  public form: FormGroup = new FormGroup({});
  public formMessage: string = '';
  public formErrors: Record<string, string> = {};
  public isFormLoading!: boolean;
  public formFields: AuthFormField[] = [];

  authMode = AuthMode;

  appService = inject(AppService);

  formEventSub: Subscription = new Subscription();

  prepareAuthForm(formFields: any[], isSignUpForm: boolean) {
    formFields.map((field) => {
      let validators = [];
      let asyncValidators = [];

      if (field.isRequired) {
        validators.push(Validators.required);
      }

      if (field.type == FieldType.EMAIL) {
        validators.push(Validators.email);

        isSignUpForm &&
          asyncValidators.push(
            UniqueEmailValidator.createValidator(this.appService)
          );
      }

      if (
        (
          [FieldType.TEXT, FieldType.EMAIL, FieldType.PASSWORD] as string[]
        ).includes(field.type)
      ) {
        if (
          [ENTITY.FIRST_NAME, ENTITY.LAST_NAME, ENTITY.DISPLAY_NAME].includes(
            field.name
          )
        ) {
          validators.push(LeadingAlphabeticValidator);
          validators.push(HasExtraSpaceValidator);
        }

        if (field.name === ENTITY.DISPLAY_NAME) {
          validators.push(MaxLengthValidator);
          validators.push(MinLengthValidator);

          asyncValidators.push(
            UniqueUsernameValidator.createValidator(this.appService)
          );
        } else {
          validators.push(Validators.maxLength(field.maxLength));
          validators.push(Validators.minLength(field.minLength));

          if (field.name === ENTITY.PASSWORD) {
            validators.push(PasswordStrengthValidator);
          }
        }
      } else if (field.name == ENTITY.DATE_OF_BIRTH) {
        validators.push(MinimumAgeValidator);
      }

      const control = new FormControl('', validators, asyncValidators);
      this.form.addControl(field.name, control);
    });

    isSignUpForm && this.form.addValidators(PasswordMatchValidator);
  }

  prepareUsernameForm() {
    this.form = new FormGroup({});
    let validators = [
      Validators.required,
      LeadingAlphabeticValidator,
      HasExtraSpaceValidator,
      MaxLengthValidator,
      MinLengthValidator,
    ];
    let asyncValidators = [
      UniqueUsernameValidator.createValidator(this.appService),
    ];
    const control = new FormControl('', validators, asyncValidators);
    this.form.addControl('displayName', control);
    this.watchFormEvents();
  }

  prepareGenderForm() {
    this.form = new FormGroup({});
    let validators = [Validators.required];
    const control = new FormControl('', validators);
    this.form.addControl('genderId', control);
    this.watchFormEvents();
  }

  preparePhotoURLForm() {
    this.form = new FormGroup({});
    const control = new FormControl('');
    this.form.addControl('photoURL', control);
    this.watchFormEvents();
  }

  prepareBirthdayForm(value: string) {
    this.form = new FormGroup({});
    const control = new FormControl(value, [MinimumAgeValidator]);
    this.form.addControl('dob', control);
    this.watchFormEvents();
  }

  preparePrivacyForm(value: number) {
    this.form = new FormGroup({});
    const control = new FormControl(value);
    this.form.addControl('privacyId', control);
    this.watchFormEvents();
  }

  watchFormEvents() {
    this.formEventSub = this.form.events.subscribe((event) => {
      if (event instanceof StatusChangeEvent && event.status == 'INVALID') {
        const controls = [this.form.controls];
        const formErrors = this.form.errors;

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

              if (prop.errors['maxlength'] || prop.errors['invalidMaxLength']) {
                errors.push(
                  `<li>This field can have at most ${prop.errors['maxlength']['requiredLength']} characters</li>`
                );
              }

              if (prop.errors['minlength'] || prop.errors['invalidMinLength']) {
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

              if (prop.errors['noLeadingAlphabetic']) {
                errors.push(
                  `<li>Please enter a value that starts with a letter (A-Z or a-z)</li>`
                );
              }

              if (prop.errors['hasExtraSpace']) {
                errors.push(`<li>Contains extra spaces</li>`);
              }

              if (prop.errors['passwordStrength']) {
                for (const message of prop.errors['passwordStrength']) {
                  errors.push(message);
                }
              }

              if (prop.errors['misMatchPasswords']) {
                errors.push(prop.errors['misMatchPasswords']);
              }

              if (prop.errors['uniqueUserName']) {
                errors.push(prop.errors['uniqueUserName']);
              }

              if (prop.errors['uniqueEmail']) {
                errors.push(prop.errors['uniqueEmail']);
              }

              this.formErrors[name] = errors.join('');
            }
          }
        }

        if (formErrors) {
          if (formErrors['misMatchPasswords']) {
            if (!this.formErrors[ENTITY.CONFIRM_PASSWORD]) {
              this.formErrors[ENTITY.CONFIRM_PASSWORD] = '';
            }

            if (
              !this.formErrors[ENTITY.CONFIRM_PASSWORD].includes(
                formErrors['misMatchPasswords']
              )
            ) {
              this.formErrors[ENTITY.CONFIRM_PASSWORD] +=
                formErrors['misMatchPasswords'];
            }
          }
        }
      }
    });
  }

  async getAuthFormFields(data: { mode: string }) {
    this.isFormLoading = true;

    let formId!: string;

    if (data.mode == FormType.SIGNIN) {
      formId = FormId.SIGN_IN_FORM_ID;
    } else if (data.mode == FormType.SIGNUP) {
      formId = FormId.SIGN_UP_FORM_ID;
    } else if (data.mode == FormType.FORGOT_PASSWORD) {
      formId = FormId.FORGOT_PASSWORD_FORM_ID;
    }

    const docRef = doc(this.appService._appDB, Collection.FORMFIELDS, formId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const docSnapData = docSnap.data();

      if (docSnapData) {
        this.formFields = (docSnapData['fields'] ?? []) as AuthFormField[];

        this.formFields.sort(
          (firstField, secondField) => firstField.id - secondField.id
        );

        this.prepareAuthForm(this.formFields, data.mode == FormType.SIGNUP);

        this.isFormLoading = false;
      } else {
        this.isFormLoading = false;
      }
    } else {
      this.isFormLoading = false;
    }
  }

  reinitializeForm() {
    this.form = new FormGroup({});
    this.form.enable();
    this.form.reset();
    this.formEventSub?.unsubscribe();
  }
}
