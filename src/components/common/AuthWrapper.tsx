import { useGetCurrentUser } from '@/services/auth';
import { PageLoading } from '@/components/ui/PageLoading';
import { Redirect } from 'expo-router';
import React from 'react';

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { data, isPending } = useGetCurrentUser();
  if (isPending) {
    return <PageLoading/>;
  }
  if (data) {
    return <>{children}</>;
  }
  return <Redirect href="/(auth)/login"/>;
}