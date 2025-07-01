import { Injectable } from '@angular/core';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';


@Injectable({
  providedIn: 'root'
})
export class FirebaseInitService {
    private firebaseApp: FirebaseApp | null = null;


  constructor() { }

  initFirebase(firebaseConfig: any): FirebaseApp {
    if (!getApps().length) {
      this.firebaseApp = initializeApp(firebaseConfig);
    } else {
      this.firebaseApp = getApp();
    }
    return this.firebaseApp;
  }

  get app(): FirebaseApp {
    if (!this.firebaseApp) {
      throw new Error('Firebase не инициализирован');
    }
    return this.firebaseApp;
  }
}
