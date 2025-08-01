import React from 'react';
import LoginScreen from '../components/LoginScreen';
import { useRouter } from 'expo-router';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

export default function LoginRoute() {
  const router = useRouter();
  
  const handleResetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert('Password reset email sent! Check your inbox.');
    } catch (error) {
      alert('Failed to send reset email. Please check your email address.');
    }
  };
  
  return (
    <LoginScreen
      onLogin={() => router.replace('/')}
      onSignUp={() => router.replace('/signup')}
      onGoogle={() => router.replace('/')}
      onFacebook={() => router.replace('/')}
      onResetPassword={handleResetPassword}
    />
  );
}
