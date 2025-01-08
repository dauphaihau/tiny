import { useGetAuthSession } from '@/services/auth.service';
import { PageLoading } from '@/components/ui/PageLoading';
import { Redirect } from 'expo-router';
import React from 'react';

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { data, isPending } = useGetAuthSession();
  if (isPending) {
    return <PageLoading/>;
  }
  if (data) {
    return <>{children}</>;
  }
  return <Redirect href="/(auth)/login"/>;
}