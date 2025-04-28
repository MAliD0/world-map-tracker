// tools/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";

//пожалуйста не используйте его(я забыл убрать вовремя)...
const firebaseConfig = {
  apiKey: "AIzaSyACSODn29dTKFhZdPcS64ksSQ3splmuxCU",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "world-map-tracker",
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
