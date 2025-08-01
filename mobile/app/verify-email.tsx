import React from 'react';
import VerifyEmailScreen from '../components/VerifyEmailScreen';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function VerifyEmailRoute() {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  return (
    <VerifyEmailScreen
      email={email || 'example@mugo.com'}
      onVerify={() => router.replace('/login')}
      onResend={() => {}}
    />
  );
}
