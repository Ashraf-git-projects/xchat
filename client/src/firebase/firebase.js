// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyABef7CzjXCAPR2PFfUUlj33X6ldxRfBdI",
  authDomain: "xchat-9721c.firebaseapp.com",
  databaseURL: "https://xchat-9721c-default-rtdb.firebaseio.com",
  projectId: "xchat-9721c",
  storageBucket: "xchat-9721c.firebasestorage.app",
  messagingSenderId: "710220516874",
  appId: "1:710220516874:web:0fe951e5aa9d675c5059f3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);