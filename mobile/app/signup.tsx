import React from 'react';
import SignupScreen from '../components/SignupScreen';
import { useRouter } from 'expo-router';

export default function SignupRoute() {
  const router = useRouter();
  return (
    <SignupScreen
      onSignUp={() => router.replace('/')}
      onGoogle={() => router.replace('/')}
      onFacebook={() => router.replace('/')}
      onLogin={() => router.replace('/login')}
    />
  );
}
