import { View } from 'react-native';
import { WrapperAuthScreen } from '@/components/app/auth/WrapperAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { FormGroup } from '@/components/ui/FormGroup';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ResetPasswordDto,
  resetPasswordSchema
} from '@/schemas/request/auth';
import React from 'react';
import { router } from 'expo-router';
import { useResetPassword } from '@/services/auth';

export default function ResetPasswordPage() {
  const [successView, setSuccessView] = React.useState(false);
  const { mutateAsync: resetPassword, isPending } = useResetPassword();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordDto>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
    },
  });

  const onSubmit = async (data: ResetPasswordDto) => {
    const authError = await resetPassword(data);
    if (!authError) {
      setSuccessView(true);
    }
  };

  return (
    <WrapperAuthScreen title="Set a new password">
      {
        successView ?
          <View className='gap-3'>
            <Text className='font-medium text-zinc-500 text-lg'>Your password has been reset successfully!</Text>
            <Button onPress={() => router.replace('/(app)/(tabs)/feed')}>
              <Text>Go to home</Text>
            </Button>
          </View> :
          <View className="gap-4">
            <Controller
              name="password"
              control={control}
              render={({ field: { onChange, value } }) => (
                <FormGroup label="Password" error={errors.password?.message}>
                  <Input
                    value={value}
                    onChangeText={onChange}
                    editable={!isPending}
                    secureTextEntry
                  />
                </FormGroup>
              )}
            />
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field: { onChange, value } }) => (
                <FormGroup label="Confirm Password" error={errors.confirmPassword?.message}>
                  <Input
                    value={value}
                    onChangeText={onChange}
                    editable={!isPending}
                    secureTextEntry
                  />
                </FormGroup>
              )}
            />
            <Button className='mt-4' disabled={isPending} onPress={handleSubmit(onSubmit)}>
              <Text>Submit</Text>
            </Button>
          </View>
      }
    </WrapperAuthScreen>
  );
};
