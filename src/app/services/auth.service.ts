import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
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
} from 'firebase/auth';
import { RouteNames } from '../app.routes';
import { AuthProvider as AProvider } from '../enums/auth-provider.enum';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  auth = getAuth();
  router = inject(Router);

  createNewUser(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password)
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
        console.log(err);
      }
    );
  }

  signOutUser() {
    this.auth.signOut().then(
      () => {
        localStorage.clear();
        this.router.navigateByUrl(RouteNames.AUTH);
      },
      (err) => {
        console.log('Error occurred during signout');
      }
    );
  }
}
