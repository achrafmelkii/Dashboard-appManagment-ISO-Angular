import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, BehaviorSubject, from,throwError  } from 'rxjs';
import { switchMap, catchError, tap,map  } from 'rxjs/operators';
import firebase from 'firebase/compat/app';
import { HttpClient ,HttpErrorResponse } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  private checkAuthPromise: Promise<void>;
  user : firebase.User | null = null;
  email: string =  "" ;
  //provider = new OAuthProvider('microsoft.com');
  provider = new firebase.auth.OAuthProvider('microsoft.com');
  constructor(private afAuth: AngularFireAuth,private http: HttpClient) {

    this.provider.setCustomParameters({
      tenant: "b7116ee0-fb91-4dba-a0bd-118dcaf8658f",
      prompt : "login",
      login_hint: "user@owniverse.onmicrosoft.com"
      
    })
    this.afAuth.onAuthStateChanged((user) => {
      this.user = user;
      this.isAuthenticatedSubject.next(user != null);
    })
    // this.afAuth.authState.pipe(
    //   tap(user => this.isAuthenticatedSubject.next(user != null))
    // ).subscribe();
    this.checkAuthPromise = this.checkAuth().catch(() => Promise.resolve());
  }
  async checkAuth(): Promise<void> {
    const token = localStorage.getItem('firebaseIdToken');

    if (!token) {
      this.isAuthenticatedSubject.next(false);
      return;
    }

    try {
      await this.http.post<void>(`${this.apiUrl}/check-auth`, { token }).toPromise();
      console.log("no login")
      this.isAuthenticatedSubject.next(true);
    } catch (error) {
      console.error('Token expired:', error);
      this.logout();
      //this.isAuthenticatedSubject.next(false);
    }
  }
  getCurrentUser(): Observable<firebase.User | null> {

    return this.afAuth.user.pipe(
      map(user => {
       // console.log('User:', user);
        return user;
      })
    );
  }


  async checkSuperAdmin(uid: string): Promise<boolean> {
    try {
      const response = await this.http.post<{ isSuperAdmin: boolean }>(`${this.apiUrl}/checkAdmin`, { uid }).toPromise();
      return response?.isSuperAdmin ?? false;
    } catch (error) {
      console.error('Error checking super admin:', error);
      return false;
    }
  }
  async waitUntilAuthCheck(): Promise<void> {
    
    return this.checkAuthPromise;
  }
  register(email: string, password: string): Observable<any> {
    return this.http.post<ServerResponse>(`${this.apiUrl}/register`, { email, password }).pipe(
      tap(response => {
        if (response && response.idToken) {
          this.handleAuthentication(response.idToken);
        }
      })
    );
  }
  private handleAuthentication(idToken: string,uid : string = ""): void {
    // Update the authentication state upon successful login
    this.isAuthenticatedSubject.next(true);
   // localStorage.setItem('isAuthenticated', 'true');

    // Save the Firebase ID token to local storage or other storage mechanisms
    localStorage.setItem('firebaseIdToken', idToken);
   // localStorage.setItem('uid', uid);
  }
  login(email: string, password: string): Observable<any> {
    
    return this.http.post<ServerResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      // Update the authentication state upon successful login
      tap(response => {
        if (response && response.idToken) {
        //this.login1(email,password);
        this.handleAuthentication(response.idToken, response.uid);
        }
        console.log(response);
      })
    );
  }
  loginMicro(): Observable<firebase.auth.UserCredential> {
    return from(this.afAuth.signInWithPopup(this.provider)).pipe(
      switchMap(async (userCredential): Promise<firebase.auth.UserCredential> => {
        const email = userCredential.user?.email || "";
        const displayName = userCredential.user?.displayName;
        const ps = "dfghjkl";
        this.user = userCredential.user;
        console.log(displayName);
  
        try {
          const response = await this.http.post<ServerResponse>(`${this.apiUrl}/login`, { email, password:ps, displayName }).toPromise();
        
          if (response && response.idToken) {
            this.handleAuthentication(response.idToken, response.uid);
          }
          
          console.log(response);
          
          return userCredential;
        } catch (error) {
          // Handle HTTP request error here
          console.error('HTTP request error:', error);


          return Promise.reject(error); // Forward the error
        }
      }),
      catchError((error: HttpErrorResponse) => {
        // Handle error from the Observable stream
        console.error('Observable error:', error);
        return this.logout().pipe(
          // Forward the error downstream
          switchMap(() => throwError(error))
        );
      })
    );
  }

  loginEmail(email: string, password: string): Observable<firebase.auth.UserCredential> {
    return from(this.afAuth.signInWithEmailAndPassword(email,password)).pipe(
      switchMap(async (userCredential): Promise<firebase.auth.UserCredential> => {
        const email = userCredential.user?.email || "";
        const displayName = userCredential.user?.displayName;
        const ps = "dfghjkl";
        this.user = userCredential.user;
        console.log(displayName);
  
        try {
          const response = await this.http.post<ServerResponse>(`${this.apiUrl}/login`, { email, ps, displayName }).toPromise();
        
          if (response && response.idToken) {
            this.handleAuthentication(response.idToken, response.uid);
          }
          
          console.log(response);
          
          return userCredential;
        } catch (error) {
          // Handle HTTP request error here
          console.error('HTTP request error:', error);


          return Promise.reject(error); // Forward the error
        }
      }),
      catchError((error: HttpErrorResponse) => {
        // Handle error from the Observable stream
        console.error('Observable error:', error);
        return this.logout().pipe(
          // Forward the error downstream
          switchMap(() => throwError(error))
        );
      })
    );
  }
  login1(email: string, password: string): Observable<firebase.auth.UserCredential> {
    return from(this.afAuth.signInWithEmailAndPassword(email, password));
  }

  logout(): Observable<void> {
    localStorage.removeItem('firebaseIdToken');
    return from(this.afAuth.signOut()).pipe(
      tap(() => this.isAuthenticatedSubject.next(false))
    );
  }
  

}
// Sample server response
interface ServerResponse {
  idToken?: string;
  uid?:string;
  isSuper?:string;
  error?:string;
  // Other properties you may have in the response
}