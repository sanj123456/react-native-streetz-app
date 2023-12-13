import Config from 'react-native-config';
import {
  consoleHere,
  constants,
  errorToast,
  resetDataForNewLogin,
  screenName,
  successToast,
  topicSubscription,
} from '../core';
import {navigate, resetNavigation} from '../navigation/RootNavigation';
import {dispatch, getStore} from '../redux';
import {
  setIsLoading,
  setLoginInitiatedFrom,
} from '../redux/modules/genericSlice';
import {setProfileData, setUserType} from '../redux/modules/profileSlice';
import {removeAsyncData, setAsyncData} from './asyncServices';
import {getGeoLocation} from './geolocationService';
import {get, post} from './request';
import {analyticsLogEvent} from './analyticsServices';

export const loginAPI = async (payload: any) => {
  dispatch(setIsLoading(true));
  post(constants.endPtLogin, payload)
    .then(async res => {
      if (res?.status === constants.apiSuccess) {
        setAsyncData(constants.asyncLoginData, payload);
        successToast(res?.message);
        navigate(screenName.verifyOtp, {
          flowType: 'login',
          ...res.data,
          email_mobile_no: payload.email_mobile_no,
        });
      } else {
        errorToast(res?.message);
      }
      dispatch(setIsLoading(false));
    })
    .catch(e => {
      consoleHere('API ERROR', e);
      dispatch(setIsLoading(false));
    });
};

export const otpVerifyAPI = (data: any, loginInitiatedFrom: string) => {
  const myDeviceUUID = getStore().generic.myDeviceUUID;
  const loginInitiatedParams = getStore().generic.loginInitiatedParams;
  dispatch(setIsLoading(true));
  post(constants.endPtLoginOtp, {
    ...data,
    uuid: myDeviceUUID,
  })
    .then(async res => {
      if (res?.status === constants.apiSuccess) {
        successToast(res.message);
        await removeAsyncData(constants.asyncLoginData);
        dispatch(setProfileData(res?.data));
        setAsyncData(constants.asyncUserToken, res?.data);
        dispatch(setUserType('registered'));
        if (loginInitiatedFrom) {
          navigate(loginInitiatedFrom, loginInitiatedParams);
          dispatch(setLoginInitiatedFrom(''));
        } else {
          resetNavigation(screenName.locationEntered);
        }
        topicSubscription(Config.TOPIC_ANNOUNCEMENT ?? '', 'subscribe');
      } else {
        errorToast(res?.message);
      }
      dispatch(setIsLoading(false));
    })
    .catch(e => {
      consoleHere({'API ERROR': e});
      dispatch(setIsLoading(false));
    });
};

export const resendAPI = (data: any) => {
  dispatch(setIsLoading(true));
  post(constants.endPtResendOtp, data)
    .then(async res => {
      if (res?.status === constants.apiSuccess) {
        successToast(res.message);
      } else {
        errorToast(res?.message);
      }
      dispatch(setIsLoading(false));
    })
    .catch(e => {
      consoleHere({'API ERROR': e});
      dispatch(setIsLoading(false));
    });
};

export const signUpAPI = async (payload: any) => {
  dispatch(setIsLoading(true));
  post(constants.endPtSignUp, payload)
    .then(async res => {
      if (res?.status === constants.apiSuccess) {
        if (res?.data?.user_id) {
          if (payload?.profile_pic?.uri) {
            profilePictureAPI({
              ...payload,
              user_id: res.data.user_id,
            });
          }
        }
        setAsyncData(constants.asyncSignupData, payload);
        successToast(res?.message, '', 'top');
        navigate(screenName.verifyOtp, {
          flowType: 'signUp',
          verify_key: res.data.verify_key,
          mobile: payload.mobile,
          email: payload.email,
        });
      } else {
        errorToast(res?.message);
      }
      dispatch(setIsLoading(false));
    })
    .catch(e => {
      consoleHere({'API ERROR': e});
      errorToast(e?.message);
      dispatch(setIsLoading(false));
    });
};

export const verifyFrontUserAPI = async (payload: any) => {
  const myDeviceUUID = getStore().generic.myDeviceUUID;
  const location_entered_skip = getStore().generic.location_entered_skip;
  dispatch(setIsLoading(true));
  post(constants.endPtVerifyUser, {
    ...payload,
    uuid: myDeviceUUID,
  })
    .then(async res => {
      if (res?.status === constants.apiSuccess) {
        successToast(res.message);
        await removeAsyncData(constants.asyncSignupData);
        dispatch(setProfileData(res?.data));
        setAsyncData(constants.asyncUserToken, res?.data);
        dispatch(setUserType('registered'));
        // if (loginInitiatedFrom) {
        //   navigate(loginInitiatedFrom, loginInitiatedParams);
        //   dispatch(setLoginInitiatedFrom(''));
        // } else {
        if (location_entered_skip) {
          resetNavigation(screenName.app);
        } else {
          resetNavigation(screenName.locationEntered);
        }

        // }
        topicSubscription(Config.TOPIC_ANNOUNCEMENT ?? '', 'subscribe');
        if (res?.data?.is_register === 1) {
          analyticsLogEvent(constants.analyticsEvents.registrationComplete);
        }
      } else {
        errorToast(res?.message);
      }
      dispatch(setIsLoading(false));
    })
    .catch(e => {
      consoleHere({'API ERROR': e});
      dispatch(setIsLoading(false));
    });
};

export const profilePictureAPI = async (payload: any) => {
  const formData = new FormData();
  formData.append('profile_picture', payload.profile_pic);
  formData.append('file_type', 'PROFILE_PIC');
  formData.append('user_id', payload.user_id);
  dispatch(setIsLoading(true));
  post(constants.endPtProfilePic, formData, 'formData')
    .then(async res => {
      if (res?.status === constants.apiSuccess) {
      } else {
        errorToast(res?.message);
      }
      dispatch(setIsLoading(false));
    })
    .catch(e => {
      consoleHere({'API ERROR': e});
      dispatch(setIsLoading(false));
    });
};

export const registerResendAPI = (data: any) => {
  dispatch(setIsLoading(true));
  post(constants.endPtRegResendOtp, data)
    .then(async res => {
      if (res?.status === constants.apiSuccess) {
        successToast(res.message);
      } else {
        errorToast(res?.message);
      }
      dispatch(setIsLoading(false));
    })
    .catch(e => {
      consoleHere({'API ERROR': e});
      dispatch(setIsLoading(false));
    });
};

export const socialLoginAPI = async (payload: any) => {
  try {
    const myDeviceUUID = getStore().generic.myDeviceUUID;
    const location_entered_skip = getStore().generic.location_entered_skip;
    dispatch(setIsLoading(true));
    const res = await post(constants.endPtSocialLogin, {
      ...payload,
      uuid: myDeviceUUID,
    });
    consoleHere({res});
    if (res?.status === constants.apiSuccess) {
      successToast(res.message);
      dispatch(setProfileData(res?.data));
      setAsyncData(constants.asyncUserToken, res?.data);
      dispatch(setUserType('registered'));
      topicSubscription(Config.TOPIC_ANNOUNCEMENT ?? '', 'subscribe');
      if (location_entered_skip) {
        resetNavigation(screenName.app);
      } else {
        resetNavigation(screenName.locationEntered);
      }
    } else {
      if (res?.status === 404) {
        if (res?.data?.is_mobile_exist === 0) {
          navigate(screenName.signUp, {
            data: payload,
          });
        }
        dispatch(setIsLoading(false));
        return payload;
      } else {
        errorToast(res?.message, '', 'top');
      }
    }
    dispatch(setIsLoading(false));
  } catch (e) {
    consoleHere({'API ERROR': e});
    dispatch(setIsLoading(false));
  }
};

export const logoutAPI = async () => {
  dispatch(setIsLoading(true));
  const coords = getStore().generic.myLocation?.coords;
  get(constants.endPtLogout)
    .then(async res => {
      if (res?.status === constants.apiSuccess) {
        successToast(res?.message);
        resetDataForNewLogin();
      } else {
        errorToast(res?.message);
      }
      dispatch(setIsLoading(false));
    })
    .catch(e => {
      consoleHere({'API ERROR': e});
      dispatch(setIsLoading(false));
    });
};

export const updateProfileAPI = async (
  payload: any,
  navigation: any,
  mobile_no: any,
) => {
  const profileData = getStore().profile.profileData;
  dispatch(setIsLoading(true));
  post(constants.endPtUpdateProfile, payload)
    .then(async res => {
      dispatch(setIsLoading(false));
      if (res?.status === constants.apiSuccess) {
        successToast(res?.message, '', 'top');

        if (payload.mobile !== mobile_no) {
          navigate(screenName.verifyOtp, {
            flowType: 'update',
            verify_key: res.data.verify_key,
            mobile: payload.mobile,
            email: payload.email,
          });
        } else {
          dispatch(
            setProfileData({
              ...profileData,
              ...res?.data,
            }),
          );
          setAsyncData(constants.asyncUserToken, {
            ...profileData,
            ...res?.data,
          });

          navigation?.goBack();
        }
        if (res?.data?.id) {
          if (payload?.profile_pic) {
            updateProfilePictureAPI({
              ...payload,
              user_id: res.data.id,
            });
          }
        }
      } else {
        errorToast(res?.message);
      }
    })
    .catch(e => {
      consoleHere({'API ERROR': e});
      dispatch(setIsLoading(false));
    });
};

export const verifyUpdateProfileAPI = (data: any, navigation: any) => {
  dispatch(setIsLoading(true));
  const profileData = getStore().profile.profileData;
  post(constants.endPtVerifyUpdateProfile, data)
    .then(async res => {
      if (res?.status === constants.apiSuccess) {
        successToast(res.message);
        dispatch(
          setProfileData({
            ...profileData,
            ...res?.data,
          }),
        );
        setAsyncData(constants.asyncUserToken, {
          ...profileData,
          ...res?.data,
        });
        navigation?.goBack();
        navigation?.goBack();
      } else {
        errorToast(res?.message);
      }
      dispatch(setIsLoading(false));
    })
    .catch(e => {
      consoleHere({'API ERROR': e});
      dispatch(setIsLoading(false));
    });
};

export const updateProfileResendAPI = (data: any) => {
  dispatch(setIsLoading(true));
  post(constants.endPtUpdateProfileResendOtp, data)
    .then(async res => {
      if (res?.status === constants.apiSuccess) {
        successToast(res.message);
      } else {
        errorToast(res?.message);
      }
      dispatch(setIsLoading(false));
    })
    .catch(e => {
      consoleHere({'API ERROR': e});
      dispatch(setIsLoading(false));
    });
};

export const updateProfilePictureAPI = async (payload: any) => {
  const profileData = getStore().profile.profileData;
  const formData = new FormData();
  formData.append('profile_picture', payload.profile_pic);
  formData.append('file_type', 'PROFILE_PIC');
  formData.append('user_id', payload.user_id);
  dispatch(setIsLoading(true));
  post(constants.endPtProfilePic, formData, 'formData')
    .then(async res => {
      if (res?.status === constants.apiSuccess) {
        dispatch(
          setProfileData({
            ...profileData,
            profile_image: res.data.profile_image,
            profile_image_url: res.data.profile_image_url,
          }),
        );
        setAsyncData(constants.asyncUserToken, {
          ...profileData,
          profile_image: res.data.profile_image,
          profile_image_url: res.data.profile_image_url,
        });
      } else {
        errorToast(res?.message);
      }
      dispatch(setIsLoading(false));
    })
    .catch(e => {
      consoleHere({'API ERROR': e});
      dispatch(setIsLoading(false));
    });
};

export const deleteAccountAPI = async () => {
  dispatch(setIsLoading(true));
  const coords = getStore().generic.myLocation?.coords;
  get(constants.endPtDeleteAccount)
    .then(async res => {
      if (res?.status === constants.apiSuccess) {
        successToast(res?.message);
        getGeoLocation();
        resetDataForNewLogin();
      } else {
        errorToast(res?.message);
      }
      dispatch(setIsLoading(false));
    })
    .catch(e => {
      consoleHere({'API ERROR': e});
      dispatch(setIsLoading(false));
    });
};
