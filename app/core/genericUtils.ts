import {Alert, Dimensions, Platform} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import Config from 'react-native-config';
import {constants} from './constants';
import {getCurrentRoute, navigate} from '../navigation/RootNavigation';
import {strings} from '../i18n';
import {screenName} from './screenName';
import {dispatch, getStore} from '../redux';
import {
  setLoginInitiatedFrom,
  setLoginInitiatedParams,
} from '../redux/modules/genericSlice';
import messaging from '@react-native-firebase/messaging';
import base64 from 'react-native-base64';
import CryptoJS from 'react-native-crypto-js';

const {width, height} = Dimensions.get('screen');

// These toast are used to show the message to replace alert message and for in app notification tray

export const errorToast = (
  description?: string,
  msg?: string,
  position?:
    | 'top'
    | 'bottom'
    | 'center'
    | {top?: number; left?: number; bottom?: number; right?: number},
) => {
  showMessage({
    message: msg ? msg : 'Oops!',
    description: description ? description : 'Oops! something went wrong',
    type: 'danger',
    position: position ?? 'bottom',
    icon: 'auto',
  });
};

export const successToast = (
  description: string,
  msg?: string,
  position?:
    | 'top'
    | 'bottom'
    | 'center'
    | {top?: number; left?: number; bottom?: number; right?: number},
) => {
  showMessage({
    message: msg ? msg : 'Success',
    description: description ? description : '',
    type: 'success',
    position: position ?? 'bottom',
    icon: 'auto',
  });
};

export const infoToast = (
  description: string,
  msg?: string,
  position?:
    | 'top'
    | 'bottom'
    | 'center'
    | {top?: number; left?: number; bottom?: number; right?: number},
) => {
  showMessage({
    message: msg ? msg : 'Info',
    description: description,
    type: 'info',
    position: position ?? 'top',
    icon: 'auto',
  });
};

const CURRENT_RESOLUTION = Math.sqrt(height * height + width * width);
const create = (designSize = {width: 414, height: 736}) => {
  if (
    !designSize ||
    !designSize.width ||
    !designSize.height ||
    typeof designSize.width !== 'number' ||
    typeof designSize.height !== 'number'
  ) {
    throw new Error(
      'create function | Invalid design size object! must have width and height fields of type Number.',
    );
  }
  const DESIGN_RESOLUTION = Math.sqrt(
    designSize.height * designSize.height + designSize.width * designSize.width,
  );
  const RESOLUTIONS_PROPORTION = CURRENT_RESOLUTION / DESIGN_RESOLUTION;
  return (size: number) => RESOLUTIONS_PROPORTION * size;
};

const designResolution = {
  width: 375,
  height: 812,
}; //this size is the size that your design is made for (screen size)
export const perfectSize = create(designResolution);

export const consoleHere = (
  data: any,
  type?: 'stringify' | 'normal' | undefined,
) => {
  if (Config.TYPE === 'dev') {
    console.log(type === 'stringify' ? JSON.stringify(data) : data);
  }
};

export const getTabSafeAreaHeight = () => {
  if (constants.tabSafeAreaList.includes(getCurrentRoute())) {
    return Platform.OS === 'ios' ? 88 : 70;
  } else {
    return 0;
  }
};

// Converting object data into form data

export const convertToFormData = (payload: any) => {
  let formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    formData.append(key, value);
  });
  consoleHere({converted_formData: formData});
  return formData;
};

export const loginAlert = (fromRoute: any, fromParams?: any) => {
  Alert.alert(strings.btLogin, strings.msgLoginAlert, [
    {
      text: strings.btLogin,
      onPress: () => {
        dispatch(setLoginInitiatedFrom(fromRoute));
        dispatch(setLoginInitiatedParams(fromParams ?? undefined));
        navigate(screenName.auth);
      },
    },
    {
      text: strings.btCancel,
    },
  ]);
};

export const isRefreshing = () => {
  const {isLoading, loadingType} = getStore()?.generic?.loader;
  return isLoading && loadingType === 'refreshing';
};

export const topicSubscription = (
  topic: 'general_announcement' | 'general_announcement_dev' | string,
  type: 'subscribe' | 'unsubscribe',
) => {
  if (type === 'subscribe') {
    messaging()
      .subscribeToTopic(topic)
      .then(() => consoleHere({subscribed_to_topic: topic}));
  }

  if (type === 'unsubscribe') {
    messaging()
      .unsubscribeFromTopic(topic)
      .then(() => consoleHere({unsubscribed_from_the_topic: topic}));
  }
};

var CryptoJSAesJson = {
  stringify: function (cipherParams: any) {
    var j: any = {ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64)};
    if (cipherParams.iv) {
      j.iv = cipherParams.iv.toString();
    }
    if (cipherParams.salt) {
      j.s = cipherParams.salt.toString();
    }
    return JSON.stringify(j);
  },
  parse: function (jsonStr: any) {
    var j = JSON.parse(jsonStr);
    var cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Base64.parse(j.ct),
    });
    if (j.iv) {
      cipherParams.iv = CryptoJS.enc.Hex.parse(j.iv);
    }
    if (j.s) {
      cipherParams.salt = CryptoJS.enc.Hex.parse(j.s);
    }
    return cipherParams;
  },
};

export const encryptData = (data: any, password: string) => {
  try {
    const key = base64.decode(password);
    let encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
      format: CryptoJSAesJson,
    }).toString();
    encrypted = JSON.parse(encrypted);
    return encrypted;
  } catch (error) {
    consoleHere({encryptDataError: error});
  }
};

export const decryptData = (encryptedObj: any, password: string) => {
  try {
    const encrypted = JSON?.stringify(encryptedObj);
    const key = base64?.decode(password);
    // Decrypt
    let bytes = CryptoJS?.AES?.decrypt(encrypted, key, {
      format: CryptoJSAesJson,
    });
    let originalText = bytes?.toString(CryptoJS.enc.Utf8);
    const result = isJson(originalText)
      ? JSON?.parse(originalText)
      : originalText;
    return result;
  } catch (error) {
    consoleHere({decryptDataError: error});
  }
};

const isJson = (str: string) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};
