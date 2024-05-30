import { Injectable, inject } from '@angular/core';

// Firebase
import { doc, setDoc } from 'firebase/firestore';

// Router
import { Router } from '@angular/router';
import { RouteNames } from '../app.routes';

// Auth
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
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

// Models
import { SignUp } from '../models/sign-up.model';

// Enums
import { Collection } from '../utils/enums/collection.enum';
import { User } from '../models/user.model';

// Components
import { EmailVerificationComponent } from '../features/auth/email-verification/email-verification.component';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  auth = getAuth();
  router = inject(Router);

  appService = inject(AppService);
  uiService = inject(UiService);
  formService = inject(FormService);

  isAuthLoading: boolean = false;
  settingUserData: boolean = false;

  signUp(signUpFormValue: SignUp) {
    this.isAuthLoading = true;

    return createUserWithEmailAndPassword(
      this.auth,
      signUpFormValue.email,
      signUpFormValue.password
    )
      .then((result: any) => {
        console.log(result.user);

        this.setUserData(
          {
            uid: result.user.uid,
            email: signUpFormValue.email,
            displayName: signUpFormValue.displayName,
            photoURL: null,
            isEmailVerified: result.user.emailVerified,
            genderId: signUpFormValue.genderId,
            dob: signUpFormValue.dob,
            address: null,
          },
          true
        );

        this.sendEmailVerification();
        /* this.uiService.openSnackbar('Signed up successfully'); */
        /* localStorage.setItem('token', result.user['accessToken']);
        this.router.navigateByUrl(RouteNames.PROFILE); */
        this.formService.finishWatching();
      })
      .catch((error) => {
        console.log(error.code);

        let errorMessage: string;

        switch (error.code) {
          case 'auth/email-already-in-use': {
            errorMessage = 'Email already in use';
            break;
          }
          default: {
            errorMessage = 'Errors occur during sign up. Try after sometimes';
          }
        }

        this.uiService.openSnackbar(errorMessage, true);
      })
      .finally(() => {
        this.isAuthLoading = false;
      });
  }

  async setUserData(userData: User, fromSignUp: boolean = false) {
    const userRef = doc(
      this.appService._appDB,
      Collection.REGISTERED_USERS,
      userData.uid
    );

    this.settingUserData = true;
    await setDoc(userRef, userData, { merge: true });
    this.settingUserData = false;

    if (fromSignUp) {
      this.uiService.closeDialog(null);
    }
  }

  async sendEmailVerification() {
    sendEmailVerification(this.auth.currentUser!).then((_) => {
      this.uiService.openSnackbarFromComponent(EmailVerificationComponent);
    });
  }

  signInWithEmailPassword(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }

  listenToAuthStateChange() {
    return onAuthStateChanged(this.auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        // ...
      } else {
        // User is signed out
        // ...
      }
    });
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
      () => {
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
