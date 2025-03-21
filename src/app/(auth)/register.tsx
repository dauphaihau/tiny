import {
  View
} from 'react-native';
import { AuthScreenWrapper } from '@/components/app/auth/AuthScreenWrapper';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { FormGroup } from '@/components/ui/FormGroup';
import { Controller, useForm } from 'react-hook-form';
import { useRegister } from '@/services/auth.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router } from 'expo-router';
import { registerSchema, RegisterDto } from '@/schemas/request/auth';
import { useState } from 'react';
import { ErrorCallout } from '@/components/app/auth/ErrorCallout';

export default function RegisterScreen() {
  const { mutateAsync: register, isPending } = useRegister();
  const [serverErrorMessage, setServerErrorMessage] = useState<string>();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterDto>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: RegisterDto) => {
    const authError = await register(data);
    if (!authError) {
      router.replace('/(app)/(tabs)/home');
    }
    else if (authError.code === 'user_already_exists') {
      setError('email', {
        message: 'Email exist!',
      });
    }
    else {
      setServerErrorMessage('Unknown error');
    }
  };

  return (
    <AuthScreenWrapper
      title="Register"
      onBack={() => router.dismissAll()}
    >
      <View className="flex-1">
        <ErrorCallout message={serverErrorMessage}/>
        <View className="gap-4">
          <Controller
            name="name"
            control={control}
            render={({ field: { onChange, value } }) => (
              <FormGroup label="Name" error={errors.name?.message}>
                <Input
                  autoFocus
                  returnKeyLabel='Submit'
                  editable={!isPending}
                  value={value}
                  onChangeText={onChange}
                  onSubmitEditing={handleSubmit(onSubmit)}
                />
              </FormGroup>
            )}
          />
          <Controller
            name="email"
            control={control}
            render={({ field: { onChange, value } }) => (
              <FormGroup label="Email" error={errors.email?.message}>
                <Input
                  returnKeyLabel='Submit'
                  editable={!isPending}
                  value={value}
                  onChangeText={onChange}
                  onSubmitEditing={handleSubmit(onSubmit)}
                />
              </FormGroup>
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field: { onChange, value } }) => (
              <FormGroup label="Password" error={errors.password?.message}>
                <Input
                  editable={!isPending}
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry
                  onSubmitEditing={handleSubmit(onSubmit)}
                  returnKeyLabel='Submit'
                />
              </FormGroup>
            )}
          />
          <Button
            disabled={isPending}
            onPress={handleSubmit(onSubmit)}
            className="mt-4"
          >
            <Text>Register</Text>
          </Button>
          <View className="flex-row items-center justify-center">
            <Text className="text-muted-foreground font-medium">Already have account?</Text>
            <Link href="/login" asChild>
              <Button variant="link" className="-ml-4">
                <Text>Login</Text>
              </Button>
            </Link>
          </View>
        </View>
      </View>
    </AuthScreenWrapper>
  );
};
