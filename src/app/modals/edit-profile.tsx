import {
  ImageURISource, TouchableOpacity, View
} from 'react-native';
import { router } from 'expo-router';
import React from 'react';
import { AuthWrapper } from '@/components/common/AuthWrapper';
import { Text } from '@/components/ui/Text';
import { Controller, useForm } from 'react-hook-form';
import { useGetCurrentProfile, useUpdateProfile } from '@/services/profile.service';
import { UpdateUserDto, updateProfileSchema } from '@/schemas/request/profile';
import { uploadImage } from '@/services/image.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { BackScreenButton } from '@/components/layout/header/BackScreenButton';
import { useNavigation } from '@react-navigation/native';
import { compressImage } from '@/utils/compress-image';
import { Input } from '@/components/ui/Input';
import { FormGroup } from '@/components/app/modals/edit-profile/FormGroup';
import { AvatarPicker } from '@/components/app/modals/edit-profile/AvatarPicker';
import Toast from 'react-native-toast-message';
import { Separator } from '@/components/common/Separator';

export default function EditProfileScreen() {
  const { data: currentProfile } = useGetCurrentProfile();
  const { mutateAsync: updateProfile } = useUpdateProfile();
  const [newSourceImage, setNewSourceImage] = React.useState<ImageURISource | null>(null);
  const [disabledSubmitBtn, setDisabledSubmitBtn] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const navigation = useNavigation();

  const {
    control,
    handleSubmit,
    watch,
  } = useForm<UpdateUserDto>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: currentProfile?.first_name,
      bio: currentProfile?.bio ?? '',
    },
  });

  React.useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <BackScreenButton disabled={isSubmitting} variant="text"/>
      ),
      headerRight: () => (
        <TouchableOpacity
          disabled={isSubmitting || disabledSubmitBtn}
          onPress={handleSubmit(onSubmit)}
          className="disabled:opacity-50"
        >
          <Text className="text-lg font-semibold">Save</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, newSourceImage, disabledSubmitBtn, isSubmitting]);

  React.useEffect(() => {
    if (newSourceImage) {
      setDisabledSubmitBtn(false);
    }

    const { unsubscribe } = watch((data) => {
      const hasEmptyFields = !data.name?.trim() || !data.bio?.trim();
      const isUnchanged =
        data.name === currentProfile?.first_name &&
        data.bio === (currentProfile?.bio ?? '')
      ;
      setDisabledSubmitBtn(hasEmptyFields || isUnchanged);
    });
    return () => unsubscribe();
  }, [watch, currentProfile, newSourceImage]);

  async function onSubmit(data: UpdateUserDto) {
    try {
      setIsSubmitting(true);
      if (newSourceImage && newSourceImage.uri) {
        const compressed = await compressImage(newSourceImage.uri);
        data.avatar = await uploadImage('profiles', compressed.uri);
      }
      await updateProfile(data);
      router.back();
    }
    catch (error) {
      console.error(error);
      setIsSubmitting(false);
      Toast.show({
        type: 'error',
        props: {
          message: 'Edit profile failed',
        },
      });
    }
  }

  return (
    <AuthWrapper>
      <View className="py-4 flex-1 mt-16">
        <AvatarPicker
          disabled={isSubmitting}
          onImagePicked={setNewSourceImage}
        />
        <Separator/>
        <Controller
          name="name"
          control={control}
          render={({ field: { onChange, value } }) => (
            <FormGroup label="Name" className="py-2">
              <Input
                variant="none"
                size="none"
                containerClassName='h-7'
                editable={!isSubmitting}
                value={value}
                onChangeText={onChange}
                placeholder="Add your name"
              />
            </FormGroup>
          )}
        />
        <Separator/>
        <Controller
          name="bio"
          control={control}
          render={({ field: { onChange, value } }) => (
            <FormGroup label="Bio" classNameLabel="py-2">
              <Input
                variant="none"
                size="none"
                editable={!isSubmitting}
                value={value}
                onChangeText={onChange}
                placeholder="Add a bio to your profile"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                className="min-h-[90px] max-h-[90px] py-2 items-start"
              />
            </FormGroup>
          )}
        />
        <Separator/>
      </View>
    </AuthWrapper>
  );
}
