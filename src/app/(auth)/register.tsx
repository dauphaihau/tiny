import { View } from 'react-native';
import { WrapperAuthScreen } from '@/components/app/auth/WrapperAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { FormGroup } from '@/components/ui/FormGroup';
import { Controller, useForm } from 'react-hook-form';
import { useRegister } from '@/services/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router } from 'expo-router';
import { registerSchema, RegisterDto } from '@/schemas/request/auth';

export default function RegisterPage() {
  const { mutateAsync: register, isPending } = useRegister();

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
    if (authError && authError.code === 'user_already_exists') {
      setError('email', {
        message: 'Email exist!',
      });
    }
  };

  return (
    <WrapperAuthScreen
      title="Register"
      onBack={() => router.dismissAll()}
    >
      <View className="gap-4">
        <Controller
          name="name"
          control={control}
          render={({ field: { onChange, value } }) => (
            <FormGroup label="Name" error={errors.name?.message}>
              <Input
                editable={!isPending}
                value={value}
                onChangeText={onChange}
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
                editable={!isPending}
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
        <Button
          disabled={isPending}
          onPress={handleSubmit(onSubmit)}
          className="mt-4"
        >
          <Text>Register</Text>
        </Button>
        <View className="flex-row items-center justify-center">
          <Text className="text-zinc-500 font-medium">Already have account?</Text>
          <Link href="/login" asChild>
            <Button variant="link" className="-ml-4">
              <Text>Login</Text>
            </Button>
          </Link>
        </View>
      </View>
    </WrapperAuthScreen>
  );
};
