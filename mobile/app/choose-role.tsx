import React from 'react';
import { useRouter } from 'expo-router';
import ChooseRoleScreen from '../components/ChooseRoleScreen';

export default function ChooseRoleRoute() {
  const router = useRouter();
  return (
    <ChooseRoleScreen onProceed={role => router.replace({ pathname: '/signup', params: { role } })} />
  );
}
