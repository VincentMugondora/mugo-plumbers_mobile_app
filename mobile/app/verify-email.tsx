import React from 'react';
import VerifyEmailScreen from '../components/VerifyEmailScreen';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function VerifyEmailRoute() {
  const router = useRouter();
  const params = useLocalSearchParams();
  let email: string | undefined = undefined;
  if (typeof params.email === 'string') email = params.email;
  else if (Array.isArray(params.email)) email = params.email[0];

  return (
    <VerifyEmailScreen
      email={email || 'example@mugo.com'}
      onVerify={() => router.replace('/login')}
      onResend={() => {}}
    />
  );
}
