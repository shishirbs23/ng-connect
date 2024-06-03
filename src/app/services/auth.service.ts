import { Injectable, inject } from '@angular/core';

// Firebase
import { collection, getDocs, query, where } from 'firebase/firestore';

// Router
import { Router } from '@angular/router';
import { RouteNames } from '../app.routes';

// Auth
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  AuthProvider,
  GithubAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { AuthProvider as AProvider } from '../utils/enums/auth-provider.enum';

// Services
import { AppService } from '../core/services/app.service';
import { FormService } from '../core/services/form.service';
import { UiService } from '../core/services/ui.service';
import { UserService } from './user.service';

// Models
import { AuthUser } from '../models/auth-user.model';

// Enums
import { Collection } from '../utils/enums/collection.enum';

// Components
import { EmailVerificationComponent } from '../features/auth/email-verification/email-verification.component';

// Moment
import moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  auth = getAuth();
  router = inject(Router);

  appService = inject(AppService);
  uiService = inject(UiService);
  formService = inject(FormService);
  userService = inject(UserService);

  isAuthLoading: boolean = false;
  settingUserData: boolean = false;

  handleAuthErrors(error: any) {
    let errorMessage: string;

    switch (error.code) {
      case 'auth/email-already-in-use': {
        errorMessage = 'Email already in use';
        break;
      }
      case 'auth/invalid-credential': {
        errorMessage = 'Incorrect email or password';
        break;
      }
      default: {
        errorMessage = 'Errors occur during sign in. Try after sometimes';
      }
    }

    this.uiService.openSnackbar(errorMessage, true);
    this.formService.form.enable();
  }

  signIn(signInFormValue: Partial<AuthUser>) {
    this.isAuthLoading = true;

    signInWithEmailAndPassword(
      this.auth,
      signInFormValue.email!,
      signInFormValue.password!
    )
      .then((result: any) => {
        this.formService.reinitializeForm();
        this.uiService.closeDialog(null);
        this.uiService.openSnackbar('Signed in successfully');
        localStorage.setItem('token', result.user['accessToken']);
        this.router.navigateByUrl(RouteNames.PROFILE);
      })
      .catch((error) => {
        this.handleAuthErrors(error);
      })
      .finally(() => {
        this.isAuthLoading = false;
      });
  }

  signUp(signUpFormValue: AuthUser) {
    signUpFormValue.dob = moment(signUpFormValue.dob).toISOString();

    this.isAuthLoading = true;

    return createUserWithEmailAndPassword(
      this.auth,
      signUpFormValue.email,
      signUpFormValue.password
    )
      .then((result: any) => {
        this.formService.reinitializeForm();
        this.userService.setUserData(
          {
            uid: result.user.uid,
            email: signUpFormValue.email,
            displayName: signUpFormValue.displayName,
            photoURL: null,
            isEmailVerified: result.user.emailVerified,
            genderId: signUpFormValue.genderId,
            dob: signUpFormValue.dob,
            address: null,
            phoneNumber: null,
          },
          true
        );
        this.sendEmailVerification();
      })
      .catch((error) => {
        this.handleAuthErrors(error);
      })
      .finally(() => {
        this.isAuthLoading = false;
      });
  }

  async sendEmailVerification() {
    sendEmailVerification(this.auth.currentUser!).then((_) => {
      this.uiService.openSnackbarFromComponent(EmailVerificationComponent);
    });
  }

  async forgotPassword(passwordResetEmail: string) {
    this.isAuthLoading = true;

    const userQuery = query(
      collection(this.appService._appDB, Collection.REGISTERED_USERS),
      where('email', '==', passwordResetEmail)
    );
    const userSnap = await getDocs(userQuery);

    if (userSnap.empty) {
      this.uiService.openSnackbar(
        'No user found with this email address. Please provide a correct email',
        true,
        2000
      );
      this.isAuthLoading = false;
      this.formService.form.enable();
    } else {
      sendPasswordResetEmail(this.auth, passwordResetEmail)
        .then((_) => {
          this.formService.reinitializeForm();
          this.uiService.closeDialog(null);
          this.uiService.openSnackbar(
            'Password reset email sent to your email, kindly check your inbox',
            false,
            3000
          );
        })
        .catch((_) => {
          this.formService.form.enable();
          this.uiService.openSnackbar(
            'Error during resetting password. Please try after sometimes',
            true
          );
        })
        .finally(() => {
          this.isAuthLoading = false;
        });
    }
  }

  signInWithProvider(authProvider: String) {
    let provider: AuthProvider = new GoogleAuthProvider();

    if (authProvider == AProvider.GOOGLE) {
      provider = new GoogleAuthProvider();
    } else if (authProvider == AProvider.FACEBOOK) {
      provider = new FacebookAuthProvider();
    } else if (authProvider == AProvider.GITHUB) {
      provider = new GithubAuthProvider();
    }

    signInWithPopup(this.auth, provider).then(
      (res: any) => {
        localStorage.setItem('token', res.user['accessToken']);
        this.router.navigateByUrl(RouteNames.PROFILE);
      },
      (err) => {
        this.uiService.openSnackbar(err.message, true);
      }
    );
  }

  signOut() {
    this.auth.signOut().then(
      (_) => {
        localStorage.clear();
        this.router.navigateByUrl(RouteNames.AUTH);
        this.uiService.openSnackbar('Signed out successfully');
      },
      (_) => {
        this.uiService.openSnackbar('Error occurred during signout', true);
      }
    );
  }
}
