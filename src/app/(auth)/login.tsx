import { View } from 'react-native';
import { AuthScreenWrapper } from '@/components/app/auth/AuthScreenWrapper';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { FormGroup } from '@/components/ui/FormGroup';
import { Link, router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { useLogin } from '@/services/auth.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginDto, loginSchema } from '@/schemas/request/auth';
import { useState } from 'react';
import { ErrorCallout } from '@/components/app/auth/ErrorCallout';

export default function LoginPage() {
  const { mutateAsync: login, isPending } = useLogin();
  const [serverErrorServerMessage, setServerErrorMessage] = useState<string>();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDto>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginDto) => {
    const authError = await login(data);
    if (!authError) {
      router.replace('/(app)/(tabs)/feeds');
    }
    else if (authError.code === 'invalid_credentials') {
      setServerErrorMessage('Incorrect email or password');
    }
    else {
      setServerErrorMessage('Unknown error');
    }
  };

  return (
    <AuthScreenWrapper
      title="Login"
      onBack={() => router.dismissAll()}
    >
      <ErrorCallout message={serverErrorServerMessage}/>
      <View className="gap-4">
        <Controller
          name="email"
          control={control}
          render={({ field: { onChange, value } }) => (
            <FormGroup label="Email" error={errors.email?.message}>
              <Input
                value={value}
                onChangeText={onChange}
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
              />
            </FormGroup>
          )}
        />
        <Link href="/forgot-password" asChild>
          <Button size="sm" variant="link" className="w-1/2 -ml-7">
            <Text>Forgot password?</Text>
          </Button>
        </Link>
        <Button onPress={handleSubmit(onSubmit)}>
          <Text>Login</Text>
        </Button>
        <View className="flex-row items-center justify-center">
          <Text className="text-zinc-500 font-medium">Don&#39;t have account?</Text>
          <Link href="/register" asChild>
            <Button variant="link" className="-ml-4">
              <Text>Register</Text>
            </Button>
          </Link>
        </View>
      </View>
    </AuthScreenWrapper>
  );
};
