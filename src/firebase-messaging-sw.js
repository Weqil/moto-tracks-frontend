importScripts(
  "https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js"
);

// Инициализация Firebase
firebase.initializeApp({
  apiKey: "AIzaSyAAxAFOnsm7B4juuOXYst-kVlkkoaJLDL4",
  authDomain: "mototrack-1d377.firebaseapp.com",
  projectId: "mototrack-1d377",
  storageBucket: "mototrack-1d377.firebasestorage.app",
  messagingSenderId: "18133043476",
  appId: "1:18133043476:web:a705df994ff255e3f71a01",
  measurementId: "G-KXCXBFTJVB",
  vapidKey:
    "BLSMF3ZU_rnEM0ngZ6LrbVHIRZ522yAeYUxVHPIi343Xku3bWNxxOfq4Kj2efzBIg6bJsGJGygQRJtK1cQdRo9I",
});
// Получаем экземпляр FCM
const messaging = firebase.messaging();

// Обработка фоновых уведомлений
messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Получено фоновое сообщение:",
    payload
  );

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/favicon.ico",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
