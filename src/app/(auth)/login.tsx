import { View } from 'react-native';
import { WrapperAuthScreen } from '@/components/app/auth/WrapperAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { FormGroup } from '@/components/ui/FormGroup';
import { Link, router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { useLogin } from '@/services/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginDto, loginSchema } from '@/schemas/request/auth';

export default function LoginPage() {
  const { mutateAsync: login, isPending, isError } = useLogin();

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
      router.replace('/(app)/home');
    }
  };

  return (
    <WrapperAuthScreen
      title="Login"
      onBack={() => router.dismissAll()}
    >
      {
        isError &&
        <View className="bg-[#F8DDE0] justify-center py-4 px-4 rounded-md">
          <Text className="text-[#823030] font-medium">Incorrect email or password</Text>
        </View>
      }
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
    </WrapperAuthScreen>
  );
};
