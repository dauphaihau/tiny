import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/superbase';
import {
  ForgotPasswordDto, LoginDto, RegisterDto, ResetPasswordDto 
} from '@/schemas/request/auth';
import * as Linking from 'expo-linking';

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['register'],
    mutationFn: async (body: RegisterDto) => {
      const { data, error } = await supabase.auth.signUp({
        email: body.email,
        password: body.password,
        options: {
          data: {
            first_name: body.name,
          },
        },
      });
      if (error) {
        return error;
      }
      queryClient.setQueryData(['current-user'], data?.user?.user_metadata);
      return undefined;
    },
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['login'],
    mutationFn: async (body: LoginDto) => {
      const { data, error } = await supabase.auth.signInWithPassword(body);
      if (error) {
        return error;
      }
      queryClient.setQueryData(['current-user'], data?.user?.user_metadata);
      return undefined;
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationKey: ['forgot-password'],
    mutationFn: async (body: ForgotPasswordDto) => {
      const currentURL = Linking.createURL('/forgot-password');
      const { error } = await supabase.auth.resetPasswordForEmail(body.email, {
        redirectTo: currentURL,
      });
      if (error) {
        return error;
      }
      return undefined;
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationKey: ['reset-password'],
    mutationFn: async (body: ResetPasswordDto) => {
      const { error } = await supabase.auth.updateUser({
        password: body.password,
      });
      if (error) {
        return error;
      }
      return undefined;
    },
  });
}

export function useGetCurrentUser() {
  return useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const response = await supabase.auth.getSession();
      return response?.data?.session?.user?.user_metadata;
    },
  });
}
