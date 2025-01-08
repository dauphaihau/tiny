import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/superbase';
import { UpdateUserDto } from '@/schemas/request/user';
import { User } from '@/schemas/models/user';

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { data: dataUser } = useGetCurrentUser();

  return useMutation({
    mutationKey: ['update-user'],
    mutationFn: async (body: UpdateUserDto) => {
      const { name, ...resBody } = body;

      const updateBody = {
        ...resBody,
        first_name: name,
      };

      const { error } = await supabase
        .from('profiles')
        .update(updateBody)
        .eq('id', dataUser?.id);

      if (error) {
        return error;
      }
      queryClient.setQueryData(['current-user'], { ...dataUser, ...updateBody });
      return undefined;
    },
  });
}

export function useGetCurrentUser() {
  return useQuery({
    queryKey: ['current-user'],
    queryFn: async (): Promise<User | null> => {
      const response = await supabase.auth.getSession();
      const userId = response?.data?.session?.user?.user_metadata?.sub;

      const responseProfile = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .limit(1)
        .single();
      return responseProfile.data ?? null;
    },
  });
}
