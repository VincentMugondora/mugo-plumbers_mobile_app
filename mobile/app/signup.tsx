import React from 'react';
import SignupScreen from '../components/SignupScreen';
import { useRouter } from 'expo-router';

export default function SignupRoute() {
  const router = useRouter();
  return (
    <SignupScreen
      onSignUp={({ email }) => router.replace({ pathname: '/verify-email', params: { email } })}
      onGoogle={() => router.replace('/')}
      onFacebook={() => router.replace('/')}
      onLogin={() => router.replace('/login')}
    />
  );
}
