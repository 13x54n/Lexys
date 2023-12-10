import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAb2rr3s_lZJE7mOijl2Z_Ouvv-C2FfhZ0",
  authDomain: "lexys-73ad1.firebaseapp.com",
  projectId: "lexys-73ad1",
  storageBucket: "lexys-73ad1.appspot.com",
  messagingSenderId: "942164954324",
  appId: "1:942164954324:web:12b19f55a25d6dfdf1bf41",
  measurementId: "G-LK2DCHWRLQ",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
