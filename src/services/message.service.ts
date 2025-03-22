import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database.types';

export function useSendMessage() {
  return useMutation({
    mutationKey: ['send-message'],
    mutationFn: async (body: Database['public']['Tables']['messages']['Insert']) => {
      console.log('');
      return supabase
        .from('messages')
        .insert(body)
        .select('*')
        .single();
    },
  });
}