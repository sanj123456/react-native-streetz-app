/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import {FC, useCallback, useEffect, useRef, useState} from 'react';
import {CommonNavigationProps} from '../../types/navigationTypes';
import {
  Alert,
  Image,
  Keyboard,
  Platform,
  TouchableOpacity,
  View
} from 'react-native';
import {colors, commonStyles, loginStyles} from '../../styles';
import {FieldInput, PrimaryButton, PrimaryText} from '../../components';
import {strings} from '../../i18n';
import {consoleHere, constants, images, isSocialLoginForIOS} from '../../core';
import {Formik} from 'formik';
import {loginValidationSchema} from '../../core/formikValidationsSchema';
import {signUpAPI, socialLoginAPI} from '../../services/authServices';
import {useNavigation} from '@react-navigation/native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
// import InstagramWebAuth from '../../components/instaLogin';
import appleAuth from '@invertase/react-native-apple-authentication';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux';
import InstagramWebAuth from '../../components/instaLogin';
import {getAsyncData} from '../../services';
import {
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager
} from 'react-native-fbsdk-next';
import AuthBackground from './AuthBackground';
import DeviceInfo from 'react-native-device-info';

const initialValues = {
  number: '',
};

let systemVersion = parseFloat(DeviceInfo.getSystemVersion());

export const Login: FC<CommonNavigationProps> = props => {
  const {navigation} = props;
  const [info, setInfo] = useState({});
  const insRef = useRef<any>();
  const [token, setToken] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [, updateState] = useState('');
  const handleForceUpdate = useCallback(() => updateState('Update'), []);
  const routeState: any = navigation?.getState();
  const instagramLoginRef = useRef(null);
  const formikRef = useRef<any>(null);
  const loginInitiatedFrom = useSelector(
    (state: RootState) => state?.generic?.loginInitiatedFrom,
  );
  const fcmToken = useSelector((state: RootState) => state?.generic?.fcmToken);

  const socialButtons = [
    {
      icon:
        Platform.OS === 'ios'
          ? systemVersion >= 13
            ? images.icApple
            : null
          : null,
      type:
        Platform.OS === 'ios' ? (systemVersion >= 13 ? 'apple' : null) : null,
      background:
        Platform.OS === 'ios'
          ? systemVersion >= 13
            ? colors.backgroundGoogle
            : null
          : null,
    },
    {
      icon: images.icGoogle,
      type: 'google',
      background: colors.white,
    },
    {
      icon: images.icFb,
      type: 'fb',
      background: colors.backgroundFb,
    },
  ];

  useEffect(() => {
    getAsyncData(constants.asyncLoginData).then((data: any) => {
      initialValues.number = data?.number || '';
      handleForceUpdate();
    });
  }, [routeState]);

  const loginHandler = (values: any) => {
    signUpAPI({
      mobile: values.number,
    });
    Keyboard.dismiss();
  };

  const nav = useNavigation();
  useEffect(() => {
    const unsubscribe = nav.addListener('focus', () => {
      if (formikRef?.current) {
        // formikRef.current.resetForm();
        // formikRef.current.setErrors({});
      }
    });
    return unsubscribe;
  }, [navigation, initialValues]);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '691461608329-59v0cv70g3jcnmo50qf7cbshe4ciar32.apps.googleusercontent.com',
    });
  }, []);

  const onGoogleButtonPress = useCallback(() => {
    (async () => {
      let currentUser = await GoogleSignin.getCurrentUser();
      try {
        if (!currentUser) {
          await GoogleSignin.hasPlayServices({
            showPlayServicesUpdateDialog: true,
          });

          currentUser = await GoogleSignin.signIn();
        }
        setInfo(currentUser.user.id);

        socialLoginAPI({
          provider_id: currentUser?.user.id,
          provider_name: 'google',
          device_type: Platform.OS,
          device_id: fcmToken ?? '1234',
          email: currentUser?.user.email,
          first_name: currentUser?.user.familyName,
          last_name: currentUser?.user.givenName,
        });
      } catch (error) {
        return Promise.reject(error);
      }
    })();
  }, [GoogleSignin, fcmToken]);

  useEffect(() => {
    if (systemVersion >= 13) {
      // iOS system version is greater than 13
      if (Platform.OS === 'ios') {
        return appleAuth.onCredentialRevoked(async () => {
          console.warn(
            'If this function executes, User Credentials have been Revoked',
          );
        });
      }
    } else {
      // iOS system version is 13 or lower
    }
  }, []);

  const onAppleButtonPress = async () => {
    try {
      const isSupported = await appleAuth.isSupported;
      if (!isSupported) {
        throw new Error('Sign In with Apple is not supported on this device.');
      }
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });

      socialLoginAPI({
        provider_id: appleAuthRequestResponse.user,
        provider_name: 'apple',
        device_type: Platform.OS,
        device_id: fcmToken ?? '1234',
        email: appleAuthRequestResponse.email,
        first_name: appleAuthRequestResponse.fullName?.givenName,
        last_name: appleAuthRequestResponse.fullName?.familyName,
      });
    } catch (error) {}
  };

  const onFacebookButtonPress = useCallback(() => {
    (async () => {
      try {
        LoginManager.logOut();
        LoginManager.setLoginBehavior('web_only');
        LoginManager.logInWithPermissions(['public_profile']).then(
          (login: any) => {
            if (login.isCancelled) {
            } else {
              AccessToken.getCurrentAccessToken().then((data: any) => {
                getUserInfo(data.accessToken);
              });
            }
          },
          (error: any) => {
            Alert.alert('Login fail with error:', error);
          },
        );
      } catch (error) {}
    })();
  }, []);

  const getUserInfo = (accessToken: any) => {
    const params = {
      fields: {
        string: 'id,name,first_name,last_name, email',
      },
    };
    const graphRequest = new GraphRequest(
      '/me',
      {accessToken, parameters: params},
      async (error: any, result: any) => {
        if (error) {
          Alert.alert('Error fetching user info:', error);
        } else {
          socialLoginAPI({
            provider_id: result.id,
            provider_name: 'facebook',
            device_type: Platform.OS,
            device_id: fcmToken ?? '1234',
            email: result.email,
            first_name: result.first_name,
            last_name: result.last_name,
          });
        }
      },
    );
    new GraphRequestManager().addRequest(graphRequest).start();
  };

  const handleLoginSuccess = (data: any) => {
    setIsVisible(false);
  };

  return (
    <AuthBackground
      title={strings.msgLoginTitle}
      smallTitle={strings.msgLoginSmallTitle}>
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={loginValidationSchema}
        onSubmit={values => {
          loginHandler(values);
        }}>
        {({values, errors, touched, handleChange, handleSubmit}) => (
          <View>
            <FieldInput
              testID="testInputPhone"
              onChangeText={handleChange('number')}
              value={values.number}
              placeholder={strings.ctMobileNumber}
              keyboardType="number-pad"
              maxLength={10}
            />
            {errors.number && touched.number && (
              <View style={loginStyles.errorView}>
                <PrimaryText testID={'errPhone'} style={commonStyles.errorText}>
                  {errors.number}
                </PrimaryText>
              </View>
            )}

            <PrimaryButton
              testID={'Login'}
              addMargin={'5%'}
              onPress={handleSubmit}
              title={strings.btLogin}
            />

            <View style={loginStyles.bottomWrapper}>
              {!isSocialLoginForIOS() ? null : (
                <>
                  <Image
                    testID="imgOr"
                    style={loginStyles.orImage}
                    source={images.dummyOR}
                  />
                  <PrimaryText
                    testID={'txtLoginWith'}
                    style={loginStyles.txtLoginWith}>
                    {strings.ctLoginWith}
                  </PrimaryText>

                  <View style={loginStyles.socialView}>
                    {socialButtons?.map((item, index) => {
                      return (
                        item.type !== null && (
                          <TouchableOpacity
                            activeOpacity={0.8}
                            testID={`btnSocial${index}`}
                            key={`${index}_social_login`}
                            style={{
                              ...loginStyles.socialItem,
                              backgroundColor:
                                item?.background ?? colors.transparent,
                              marginLeft:
                                index === 0 && Platform.OS === 'ios'
                                  ? 0
                                  : index === 1 && Platform.OS === 'android'
                                  ? 0
                                  : 12,
                            }}
                            onPress={() => {
                              if (item.type === 'insta') {
                                setIsVisible(true);
                              } else if (item.type === 'google') {
                                onGoogleButtonPress();
                              } else if (item.type === 'apple') {
                                onAppleButtonPress();
                              } else if (item.type === 'fb') {
                                onFacebookButtonPress();
                              }
                            }}>
                            <Image
                              testID={`imgSocial${index}`}
                              style={loginStyles.socialImage}
                              source={item?.icon}
                            />
                          </TouchableOpacity>
                        )
                      );
                    })}
                  </View>
                </>
              )}

              <InstagramWebAuth
                isVisible={isVisible}
                onLoginSuccess={handleLoginSuccess}
                onClose={() => setIsVisible(false)}
              />
            </View>
          </View>
        )}
      </Formik>
    </AuthBackground>
  );
};
