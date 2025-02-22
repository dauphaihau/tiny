import { useGetAuthSession } from '@/services/auth.service';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { Redirect } from 'expo-router';
import React from 'react';

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { data, isPending } = useGetAuthSession();
  if (isPending) {
    return <LoadingScreen/>;
  }
  if (data) {
    return <>{children}</>;
  }
  return <Redirect href="/(auth)/login"/>;
}