import React from 'react';
import SignupScreen from '../components/SignupScreen';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

export default function SignupRoute() {
  const router = useRouter();
  const { user } = useAuth();
  const { role } = useLocalSearchParams();
  
  // If user is already logged in, redirect to main app
  React.useEffect(() => {
    if (user) {
      router.replace('/(tabs)');
    }
  }, [user, router]);
  
  const handleSuccessfulAuth = () => {
    router.replace('/(tabs)');
  };
  
  return (
    <SignupScreen
      role={role}
      onSignUp={() => router.replace('/login')}
      onGoogle={handleSuccessfulAuth}
      onFacebook={handleSuccessfulAuth}
      onLogin={() => router.replace('/login')}
    />
  );
}
