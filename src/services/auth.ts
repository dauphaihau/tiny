import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/superbase';
import { LoginDto, RegisterDto } from '@/schemas/request/auth';

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
        throw error;
      }
      queryClient.setQueryData(['current-user'], data?.user?.user_metadata);
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
