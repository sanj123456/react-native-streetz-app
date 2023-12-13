/* eslint-disable react-hooks/exhaustive-deps */
import {FC, useEffect, useRef} from 'react';
import {CommonNavigationProps} from '../../types/navigationTypes';
import {Keyboard, View} from 'react-native';
import {commonStyles, signupStyles} from '../../styles';
import {FieldInput, PrimaryButton, PrimaryText} from '../../components';
import {strings} from '../../i18n';
import {consoleHere, images} from '../../core';
import {Formik} from 'formik';
import {signUpValidationSchema} from '../../core/formikValidationsSchema';
import {signUpAPI} from '../../services/authServices';
import AuthBackground from './AuthBackground';

const initialValues = {
  first_name: '',
  last_name: '',
  email: '',
  mobile: '',
};
export const SignUp: FC<CommonNavigationProps> = ({navigation, route}) => {
  const socialData = route?.params?.data;

  const formikRef = useRef<any>(null);

  useEffect(() => {
    if (socialData?.first_name) {
      formikRef.current.setFieldValue(
        'first_name',
        socialData?.first_name,
        true,
      );
    }
    if (socialData?.last_name) {
      formikRef.current.setFieldValue('last_name', socialData?.last_name, true);
    }
    if (socialData?.email) {
      formikRef.current.setFieldValue('email', socialData?.email, true);
    }
  }, []);

  const signUpHandler = (values: any) => {
    signUpAPI({
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      mobile: values.mobile,
      provider_id: socialData.provider_id ?? '',
      provider_name: socialData?.provider_name ?? '',
    });
    Keyboard.dismiss();
  };

  return (
    <AuthBackground
      onBack={() => {
        navigation.goBack();
      }}
      title={strings.msgSocialLoginTitle}
      smallTitle={strings.msgLoginSmallTitle}>
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={signUpValidationSchema}
        onSubmit={values => {
          signUpHandler(values);
        }}>
        {({values, errors, touched, handleChange, handleSubmit}) => (
          <>
            <FieldInput
              testID={'firstName'}
              icon={images.icUser}
              value={values.first_name}
              onChangeText={handleChange('first_name')}
              placeholder={strings.ctFirstName}
              inputViewStyles={signupStyles.inputViewStyles}
              inputStyles={signupStyles.inputStyles}
              highlight
              keyboardType="email-address"
              maxLength={30}
            />

            {errors.first_name && touched.first_name && (
              <View style={signupStyles.errorView}>
                <PrimaryText
                  testID={'firstNameError'}
                  style={commonStyles.errorText}>
                  {errors.first_name}
                </PrimaryText>
              </View>
            )}

            <FieldInput
              testID={'lastName'}
              icon={images.icUser}
              value={values.last_name}
              onChangeText={handleChange('last_name')}
              placeholder={strings.ctLastName}
              inputViewStyles={signupStyles.inputViewStyles}
              inputStyles={signupStyles.inputStyles}
              highlight
              keyboardType="email-address"
              maxLength={30}
            />

            {errors.last_name && touched.last_name && (
              <View style={signupStyles.errorView}>
                <PrimaryText
                  testID={'lastNameError'}
                  style={commonStyles.errorText}>
                  {errors.last_name}
                </PrimaryText>
              </View>
            )}

            <FieldInput
              testID={'email'}
              icon={images.icMail}
              value={values.email}
              onChangeText={handleChange('email')}
              placeholder={strings.ctEmail}
              inputViewStyles={signupStyles.inputViewStyles}
              inputStyles={signupStyles.inputStyles}
              highlight
              maxLength={350}
            />
            {errors.email && touched.email && (
              <View style={signupStyles.errorView}>
                <PrimaryText
                  testID={'emailError'}
                  style={commonStyles.errorText}>
                  {errors.email}
                </PrimaryText>
              </View>
            )}
            <FieldInput
              testID={'mobile'}
              icon={images.icMobile}
              value={values.mobile}
              onChangeText={handleChange('mobile')}
              placeholder={strings.ctMobileNumber}
              inputViewStyles={signupStyles.inputViewStyles}
              inputStyles={signupStyles.inputStyles}
              highlight
              maxLength={10}
              keyboardType="number-pad"
            />
            {errors.mobile && touched.mobile && (
              <View style={signupStyles.errorView}>
                <PrimaryText
                  testID={'mobileError'}
                  style={commonStyles.errorText}>
                  {errors.mobile}
                </PrimaryText>
              </View>
            )}

            <PrimaryButton
              testID={'submit'}
              addMargin={'8%'}
              onPress={handleSubmit}
              title={strings.btSubmit}
            />
          </>
        )}
      </Formik>
    </AuthBackground>
  );
};


