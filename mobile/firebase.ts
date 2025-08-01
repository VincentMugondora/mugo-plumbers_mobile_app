import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDeA_cXiZ3Y8-ri9rHyrVzCHpootkKz2_0",
  authDomain: "mugo-plumbing-solutions.firebaseapp.com",
  projectId: "mugo-plumbing-solutions",
  storageBucket: "mugo-plumbing-solutions.firebasestorage.app",
  messagingSenderId: "842643966506",
  appId: "1:842643966506:web:1a2c0432eceb9d20355153"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
