// tools/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";

// Вставьте сюда вашу конфигурацию из Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyACSODn29dTKFhZdPcS64ksSQ3splmuxCU",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "world-map-tracker",
  // ... остальные настройки
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Если пользователь еще не авторизован, выполняем анонимную авторизацию
// if (!auth.currentUser) {
//   signInAnonymously(auth).catch((error) => {
//     console.error("Ошибка анонимной авторизации:", error);
//   });
// }

export { db, auth };
