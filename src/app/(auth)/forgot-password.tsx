import { View } from 'react-native';
import { WrapperAuthScreen } from '@/components/app/auth/WrapperAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { FormGroup } from '@/components/ui/FormGroup';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ForgotPasswordDto, forgotPasswordSchema } from '@/schemas/request/auth';
import { router } from 'expo-router';
import { useForgotPassword } from '@/services/auth';
import React from 'react';

export default function ForgotPasswordPage() {
  const [successView, setSuccessView] = React.useState(false);
  const { mutateAsync: forgotPassword, isPending } = useForgotPassword();

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordDto>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordDto) => {
    const authError = await forgotPassword(data);
    if (!authError) {
      setSuccessView(true);
    }
  };

  return (
    <WrapperAuthScreen
      title="Forgot Password"
      onBack={() => router.back()}
    >
      {
        successView ?
          <View>
            <Text className='font-medium text-zinc-500 text-lg'>
              We sent a password reset link to {getValues('email')}, please check your email
            </Text>
          </View> :
          <View className="gap-4">
            <Controller
              name="email"
              control={control}
              render={({ field: { onChange, value } }) => (
                <FormGroup label="Email" error={errors.email?.message}>
                  <Input
                    value={value}
                    onChangeText={onChange}
                    editable={!isPending}
                  />
                </FormGroup>
              )}
            />
            <Button disabled={isPending} onPress={handleSubmit(onSubmit)}>
              <Text>Submit</Text>
            </Button>
          </View>
      }
    </WrapperAuthScreen>
  );
};
