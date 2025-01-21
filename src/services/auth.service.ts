import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import {
  ForgotPasswordDto, LoginDto, RegisterDto, ResetPasswordDto
} from '@/schemas/request/auth';
import * as Linking from 'expo-linking';
import { getUsernameFromEmail } from '@/lib/utils';

export function useRegister() {
  return useMutation({
    mutationKey: ['register'],
    mutationFn: async (body: RegisterDto) => {
      const response = await supabase.auth.signUp({
        email: body.email,
        password: body.password,
        options: {
          data: {
            first_name: body.name,
            username: getUsernameFromEmail(body.email),
          },
        },
      });
      return response.error;
    },
  });
}

export function useLogin() {
  return useMutation({
    mutationKey: ['login'],
    mutationFn: async (body: LoginDto) => {
      const response = await supabase.auth.signInWithPassword(body);
      return response.error;
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

export function useGetAuthSession() {
  return useQuery({
    queryKey: ['auth-session'],
    queryFn: async () => {
      const response = await supabase.auth.getSession();
      return response?.data?.session ?? null;
    },
  });
}
