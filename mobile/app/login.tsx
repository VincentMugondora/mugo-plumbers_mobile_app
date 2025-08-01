import React from 'react';
import LoginScreen from '../components/LoginScreen';
import { useRouter } from 'expo-router';

export default function LoginRoute() {
  const router = useRouter();
  return (
    <LoginScreen
      onLogin={() => router.replace('/')}
      onSignUp={() => router.replace('/signup')}
      onGoogle={() => router.replace('/')}
      onFacebook={() => router.replace('/')}
      onResetPassword={() => {}}
    />
  );
}
