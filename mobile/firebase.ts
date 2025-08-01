import { initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDeA_cXiZ3Y8-ri9rHyrVzCHpootkKz2_0",
  authDomain: "mugo-plumbing-solutions.firebaseapp.com",
  projectId: "mugo-plumbing-solutions",
  storageBucket: "mugo-plumbing-solutions.firebasestorage.app",
  messagingSenderId: "842643966506",
  appId: "1:842643966506:web:1a2c0432eceb9d20355153"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export { auth };
