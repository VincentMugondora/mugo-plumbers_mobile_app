import React from 'react';
import SignupScreen from '../components/SignupScreen';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function SignupRoute() {
  const router = useRouter();
  const { role } = useLocalSearchParams();
  return (
    <SignupScreen
      role={role}
      onSignUp={() => router.replace('/login')}
      onGoogle={() => router.replace('/')}
      onFacebook={() => router.replace('/')}
      onLogin={() => router.replace('/login')}
    />
  );
}
