import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'expo-router';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading) {
      if (user) {
        // User is authenticated, redirect to main app
        router.replace('/(tabs)');
      } else {
        // User is not authenticated, redirect to login
        router.replace('/login');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return null; // or a loading spinner
  }

  return children;
} 