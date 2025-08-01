import React from 'react';
import LoginScreen from '../components/LoginScreen';
import { useRouter } from 'expo-router';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

export default function LoginRoute() {
  const router = useRouter();
  const { user } = useAuth();
  
  // If user is already logged in, redirect to main app
  React.useEffect(() => {
    if (user) {
      router.replace('/(tabs)');
    }
  }, [user, router]);
  
  const handleResetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert('Password reset email sent! Check your inbox.');
    } catch (error) {
      alert('Failed to send reset email. Please check your email address.');
    }
  };
  
  const handleSuccessfulLogin = () => {
    router.replace('/(tabs)');
  };
  
  return (
    <LoginScreen
      onLogin={handleSuccessfulLogin}
      onSignUp={() => router.replace('/signup')}
      onGoogle={handleSuccessfulLogin}
      onFacebook={handleSuccessfulLogin}
      onResetPassword={handleResetPassword}
    />
  );
}
