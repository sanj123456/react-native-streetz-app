/* eslint-disable react-hooks/exhaustive-deps */
import {FC, useEffect, useRef, useState} from 'react';
import {Image, Keyboard, View} from 'react-native';
import {colors, commonStyles, editProfileStyles} from '../../styles';
import {
  Background,
  FieldInput,
  MyImage,
  PrimaryButton,
  PrimaryHeader,
  PrimaryText,
} from '../../components';
import {strings} from '../../i18n';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {decryptData, images} from '../../core';
import {MyImagePicker} from '../../components/MyImagePicker';
import {CommonNavigationProps} from '../../types/navigationTypes';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux';
import {updateProfileAPI} from '../../services';
import {Formik} from 'formik';
import {updateProfileValidationSchema} from '../../core/formikValidationsSchema';
import {useNavigation} from '@react-navigation/native';

export const EditProfile: FC<CommonNavigationProps> = ({navigation}) => {
  const {profileData} = useSelector((state: RootState) => ({
    profileData: state?.profile?.profileData,
  }));
  const randomData = useSelector(
    (state: RootState) => state?.generic?.randomData,
  );

  const nav = useNavigation();
  const formikRef = useRef<any>(null);
  const [userImg, setUserImg] = useState<any>('');

  const initialValues = {
    first_name: profileData?.first_name,
    last_name: profileData?.last_name,
    email: randomData?.gp
      ? decryptData(JSON?.parse(profileData?.email), randomData?.gp)
      : '',
    mobile: randomData?.gp
      ? decryptData(JSON?.parse(profileData?.mobile_no), randomData?.gp)
      : '',
    profile_pic: {
      uri: undefined,
      type: undefined,
      name: undefined,
    },
  };

  useEffect(() => {
    const unsubscribe = nav.addListener('focus', () => {
      if (formikRef?.current) {
        formikRef.current.resetForm();
        formikRef.current.setErrors({});
      }
    });
    return unsubscribe;
  }, [navigation, initialValues]);

  const updateProfileHandler = (values: any) => {
    updateProfileAPI(
      {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        mobile: values.mobile,
        profile_pic: userImg,
        isCredentialKey: 1,
      },
      navigation,
      randomData?.gp
        ? decryptData(JSON?.parse(profileData?.mobile_no), randomData?.gp)
        : '',
    );
    Keyboard.dismiss();
  };

  return (
    <Background>
      <PrimaryHeader left="back" title={strings.ctMyProfile} />

      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={updateProfileValidationSchema}
        onSubmit={values => {
          updateProfileHandler(values);
        }}>
        {({values, errors, touched, handleChange, handleSubmit}) => (
          <KeyboardAwareScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={editProfileStyles.contentContainerStyle}
            testID={'ScrollViewEditProfile'}>
            <View style={editProfileStyles.profileWrapper}>
              {userImg ? (
                <Image
                  testID="imgProfile"
                  style={editProfileStyles.profilePic}
                  source={{
                    uri: userImg?.uri
                      ? userImg?.uri
                      : Image.resolveAssetSource(images.dummyProfile).uri,
                  }}
                />
              ) : (
                <MyImage
                  sourceType={
                    profileData?.profile_image_url === null ? 'local' : 'url'
                  }
                  style={editProfileStyles.profilePic}
                  source={
                    profileData?.profile_image_url
                      ? profileData?.profile_image_url
                      : images.dummyProfile
                  }
                />
              )}
              <MyImagePicker
                testID="UpdateProfileImagePicker"
                onChange={source => {
                  setUserImg({
                    uri: source.uri,
                    name: source.name,
                    type: source.type,
                  });
                  // formikRef.current.setFieldValue('profile_pic', source);
                }}
                style={editProfileStyles.pickerWrapper}>
                <Image style={commonStyles.icon32} source={images.icCam} />
              </MyImagePicker>
            </View>
            <FieldInput
              testID={'firstName'}
              icon={images.icUser}
              value={values.first_name}
              onChangeText={handleChange('first_name')}
              placeholder={strings.ctFirstName}
              inputViewStyles={editProfileStyles.inputViewStyles}
              inputStyles={editProfileStyles.inputStyles}
              placeholderTextColor={colors.primary}
              highlight
              keyboardType="email-address"
              maxLength={30}
            />
            {errors.first_name && touched.first_name && (
              <View style={editProfileStyles.errorView}>
                <PrimaryText
                  testID={'firstNameError'}
                  style={commonStyles.errorText}>
                  {errors?.first_name}
                </PrimaryText>
              </View>
            )}

            <FieldInput
              testID={'lastName'}
              icon={images.icUser}
              value={values.last_name}
              onChangeText={handleChange('last_name')}
              placeholder={strings.ctLastName}
              inputViewStyles={editProfileStyles.inputViewStyles}
              inputStyles={editProfileStyles.inputStyles}
              placeholderTextColor={colors.primary}
              highlight
              maxLength={30}
            />

            {errors.last_name && touched.last_name && (
              <View style={editProfileStyles.errorView}>
                <PrimaryText
                  testID={'lastNameError'}
                  style={commonStyles.errorText}>
                  {errors?.last_name}
                </PrimaryText>
              </View>
            )}
            <FieldInput
              testID={'email'}
              icon={images.icMail}
              value={values.email}
              onChangeText={handleChange('email')}
              placeholder={strings.ctEmail}
              inputViewStyles={editProfileStyles.inputViewStyles}
              inputStyles={editProfileStyles.inputStyles}
              placeholderTextColor={colors.primary}
              highlight
              maxLength={350}
            />
            {errors.email && touched.email && (
              <View style={editProfileStyles.errorView}>
                <PrimaryText
                  testID={'emailError'}
                  style={commonStyles.errorText}>
                  {errors?.email}
                </PrimaryText>
              </View>
            )}
            <FieldInput
              testID={'mobile'}
              icon={images.icMobile}
              value={values.mobile}
              onChangeText={handleChange('mobile')}
              placeholder={strings.ctMobileNumber}
              inputViewStyles={editProfileStyles.inputViewStyles}
              inputStyles={editProfileStyles.inputStyles}
              placeholderTextColor={colors.primary}
              highlight
              maxLength={10}
              keyboardType="number-pad"
            />
            {errors.mobile && touched.mobile && (
              <View style={editProfileStyles.errorView}>
                <PrimaryText
                  testID={'mobileError'}
                  style={commonStyles.errorText}>
                  {errors?.mobile}
                </PrimaryText>
              </View>
            )}

            <PrimaryButton
              testID={'submit'}
              addMargin={20}
              onPress={handleSubmit}
              title={strings.btUpdate}
            />
          </KeyboardAwareScrollView>
        )}
      </Formik>
    </Background>
  );
};
