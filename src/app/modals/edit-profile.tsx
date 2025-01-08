import {
  Image, ImageURISource, Pressable, View
} from 'react-native';
import { Link, router, Stack } from 'expo-router';
import React from 'react';
import { AuthWrapper } from '@/components/common/AuthWrapper';
import { Text } from '@/components/ui/Text';
import { Controller, useForm } from 'react-hook-form';
import { useGetCurrentUser, useUpdateUser } from '@/services/user.service';
import { FormGroup } from '@/components/ui/FormGroup';
import { Input } from '@/components/ui/Input';
import { UpdateUserDto, updateUserSchema } from '@/schemas/request/user';
import * as ImagePicker from 'expo-image-picker';
import { getAvatarImage, uploadImage } from '@/services/image.service';
import { Textarea } from '@/components/ui/Textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';

export default function EditProfileScreen() {
  const { data: dataUser } = useGetCurrentUser();
  const { mutateAsync: updateUser, isPending } = useUpdateUser();
  const currentSourceImage = getAvatarImage(dataUser?.avatar);
  const [sourceImage, setSourceImage] = React.useState<ImageURISource>(getAvatarImage(dataUser?.avatar));
  const [disabledSubmit, setDisabledSubmit] = React.useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<UpdateUserDto>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: dataUser?.first_name,
      bio: dataUser?.bio ?? '',
    },
  });

  React.useEffect(() => {
    const { unsubscribe } = watch((value) => {
      console.log('value', value);
      if (disabledSubmit) {
        setDisabledSubmit(false);
      }
    });
    return () => unsubscribe();
  }, [watch]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (disabledSubmit) {
      setDisabledSubmit(false);
    }
    if (!result.canceled) {
      setSourceImage({
        uri: result.assets[0].uri,
      });
    }
  };

  const onSubmit = async (data: UpdateUserDto) => {
    if (
      typeof sourceImage === 'object' &&
      JSON.stringify(sourceImage) !== JSON.stringify(currentSourceImage)
    ) {
      data.avatar = await uploadImage('profiles', sourceImage.uri);
    }
    const authError = await updateUser(data);
    if (!authError) {
      router.back();
    }
  };

  return (
    <AuthWrapper>
      <View>
        <Stack.Screen
          options={{
            headerLeft: () => <Link disabled={isPending} href="../">Cancel</Link>,
            headerRight: () => (
              <Button
                disabled={isPending || disabledSubmit}
                onPress={handleSubmit(onSubmit)}
                variant="ghost" className="native:px-0"
              >
                <Text>Save</Text>
              </Button>
            ),
          }}
        />
        <View className="p-4 gap-4">
          <Pressable onPress={pickImage}>
            <Image
              source={sourceImage}
              className="size-16 rounded-full"
            />
          </Pressable>
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
            name="bio"
            control={control}
            render={({ field: { onChange, value } }) => (
              <FormGroup label="Bio" error={errors.bio?.message}>
                <Textarea
                  editable={!isPending}
                  value={value}
                  onChangeText={onChange}
                />
              </FormGroup>
            )}
          />
        </View>
      </View>
    </AuthWrapper>
  );
}
