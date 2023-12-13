import {Alert, Linking, Platform} from 'react-native';
import {strings} from '../i18n';
import {dispatch, getStore} from '../redux';
import {setMyCart} from '../redux/modules/cartSlice';
import {
  addToCartAPI,
  clearCartItemAPI,
  logoutAPI,
  removeAsyncData,
} from '../services';
import {CartItemParams} from '../types/paramsTypes';
import {decryptData, errorToast, topicSubscription} from './genericUtils';
import {navigate, resetNavigation} from '../navigation/RootNavigation';
import {screenName} from './screenName';
import {setProfileData, setUserType} from '../redux/modules/profileSlice';
import {
  setAddressData,
  setSelectedAddress,
} from '../redux/modules/addressSlice';
import Config from 'react-native-config';
import {constants} from './constants';
import {setHomeData} from '../redux/modules/homeSlice';
import {setOrderHistory} from '../redux/modules/orderSlice';
import {setNotificationList} from '../redux/modules/notificationSlice';
import VersionCheck from 'react-native-version-check';

const packageName =
  Platform.OS === 'android' ? 'com.streetzapp' : 'org.StreetzApp';

export const toNumber = (value: any) => {
  if (!value) {
    return 0;
  }

  if (isNaN(Number(value))) {
    return 0;
  } else {
    return Number(value);
  }
};

export const clearCartAlert = (
  payload: CartItemParams,
  seller_store_address_id: any,
  product_name?: string,
) => {
  Alert.alert(strings.ctClearCart, strings.msgAlreadyItemInCart, [
    {
      text: strings.btClearAndProceed,
      onPress: () => {
        dispatch(
          setMyCart({
            items: [],
            totalPrice: {
              total: 0,
              discount_applicable_price: 0,
              discount: 0,
              discounted_price: 0,
              final_price: 0,
              discount_type: null,
              coupon_code_id: 0,
              coupon_code: 0,
              connivance_fee: 0,
            },
            seller_store_address_id: null,
          }),
        );
        setTimeout(
          () =>
            addToCartAPI(
              payload,
              seller_store_address_id,
              'show',
              product_name,
            ),
          800,
        );
      },
    },
    {text: strings.btCancel},
  ]);
};

export const calculateDistance = (
  coords1: {latitude: number; longitude: number},
  coords2: {latitude: number; longitude: number},
) => {
  const earthRadiusKm = 6371; // Earth's radius in kilometers

  // Convert latitude and longitude from degrees to radians
  const degToRad = (degree: any) => (degree * Math.PI) / 180;
  const radLat1 = degToRad(coords1?.latitude);
  const radLon1 = degToRad(coords1?.longitude);
  const radLat2 = degToRad(coords2?.latitude);
  const radLon2 = degToRad(coords2?.longitude);

  // Calculate differences between latitudes and longitudes
  const latDiff = radLat2 - radLat1;
  const lonDiff = radLon2 - radLon1;

  // Calculate the distance using Haversine formula
  const a =
    Math.sin(latDiff / 2) ** 2 +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(lonDiff / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadiusKm * c;
  return distance; // The distance between the two coordinates in kilometers
};

export const getNext7DaysDates = () => {
  const datesArray = [];
  const currentDate = new Date();
  for (let i = 0; i < 7; i++) {
    const nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + i);
    const isSelected = i === 0; // Mark the first date as selected
    datesArray.push({date: nextDate, isSelected});
  }
  return datesArray;
};

export const orderStatusData = [
  {
    id: 1,
    order_status: 'Order Placed',
    order_desc: 'Waiting To Accept',
  },
  {
    id: 2,
    order_status: 'Order Accepted',
    order_desc: 'Preparing Your Order',
  },
  {
    id: 3,
    order_status: 'Delivery Partner Assigned',
    order_desc: 'Your delivery partner is assigned',
  },
  {
    id: 4,
    order_status: 'Order Picked Up',
    order_desc: 'Order has been picked up',
  },
  {
    id: 5,
    order_status: 'Order Delivered',
    order_desc: 'Thank you!',
  },
  {
    id: 6,
    order_status: 'Order Cancelled',
    order_desc: '',
  },
  {
    id: 7,
    order_status: 'Refund Initiated',
    order_desc: '',
  },
  {
    id: 8,
    order_status: 'Refund Completed',
    order_desc: '',
  },
  {
    id: 9,
    order_status: 'Order Payment Failed',
    order_desc: '',
  },
  {
    id: 10,
    order_status: 'Return Requested',
    order_desc: "You'll be contacted by our team soon!",
  },
  {
    id: 11,
    order_status: 'Return Accepted',
    order_desc: 'Delivery partner will be assigned soon!',
  },
  {
    id: 12,
    order_status: 'Delivery Partner Assigned for Return',
    order_desc: 'Your delivery partner is assigned',
  },
  {
    id: 13,
    order_status: 'Return Picked Up',
    order_desc: "You'll be contacted by our team soon!",
  },
  {
    id: 14,
    order_status: 'Order Returned',
    order_desc: '',
  },
];

export const getOrderProgressBar = (status: string) => {
  const filteredArray = orderStatusData?.filter(item => item?.id <= 5);
  return filteredArray?.find(item => item?.order_status === status)?.id ?? 0;
};

export const getOrderStatus = (status: string) => {
  return orderStatusData?.find(item => item?.order_status === status);
};

export const color: any = [
  '#FFDED3',
  '#C8E7FF',
  '#FFF3CD',
  '#CEFAD0',
  '#FFC7DA',
  '#FFEAAC',
  '#ECCAFE',
];

export const isSocialLoginForIOS = () => {
  const appSettings = getStore()?.generic?.appSettings;
  const isEnabled = appSettings?.storeTiming?.find(
    item => item?.key === 'is_social_enable',
  )?.value;
  return isEnabled === '1' ? true : false;
};

export const getSupportMail = () => {
  const appSettings = getStore()?.generic?.appSettings;
  const mail = appSettings?.storeTiming?.find(
    item => item?.key === 'return_email',
  )?.value;

  return mail;
};

export const getDeliveryFee = () => {
  const appSettings = getStore()?.generic?.appSettings;
  const deliveryFee = appSettings?.storeTiming?.find(
    item => item?.key === 'delivery_fee',
  )?.value;
  return deliveryFee;
};

export const getConvenienceFee = () => {
  const appSettings = getStore()?.generic?.appSettings;
  const convenienceFee = appSettings?.storeTiming?.find(
    item => item?.key === 'connivance_fee',
  )?.value;
  return convenienceFee;
};

export const checkProfileEmail = (email: any) => {
  if (email !== null) {
    return true;
  } else {
    errorToast('Please update your profile first!');
    navigate(screenName.editProfile);
    return false;
  }
};

export const getNewUserReferAmount = () => {
  const appSettings = getStore()?.generic?.appSettings;
  const newUserReferAmount = appSettings?.storeTiming?.find(
    item => item?.key === 'new_user_refer_amount',
  )?.value;
  return newUserReferAmount;
};

export const getReferredUserReferAmount = () => {
  const appSettings = getStore()?.generic?.appSettings;
  const newUserReferAmount = appSettings?.storeTiming?.find(
    item => item?.key === 'referred_user_refer_amount',
  )?.value;
  return newUserReferAmount;
};

export const resetDataForNewLogin = () => {
  const coords = getStore().generic.myLocation?.coords;
  //keep this function on top as reset navigation can cause random crash
  resetNavigation(screenName.auth);
  dispatch(setProfileData(null));
  dispatch(
    setOrderHistory({
      total: 0,
      data: [],
    }),
  );
  removeAsyncData(constants.asyncUserToken);
  dispatch(setUserType('guest'));
  dispatch(
    setMyCart({
      items: [],
      totalPrice: {
        total: 0,
        discount_applicable_price: 0,
        discount: 0,
        discounted_price: 0,
        final_price: 0,
        discount_type: null,
        coupon_code_id: 0,
        coupon_code: 0,
        delivery_fee: 0,
        connivance_fee: 0,
      },
      seller_store_address_id: null,
      seller_store_name: '',
    }),
  );
  dispatch(setAddressData([]));
  dispatch(setSelectedAddress(coords));
  topicSubscription(Config.TOPIC_ANNOUNCEMENT ?? '', 'unsubscribe');
  dispatch(
    setHomeData({
      category_list: [],
      recently_viewed_product_list: [],
      trending_store_list: [],
    }),
  );
  dispatch(setNotificationList([]));
};

export const forcedlyClearCartAlert = () => {
  Alert.alert(strings.ctClearCart, strings.msgStoreNotAvailableClearCart, [
    {
      text: strings.btOkay,
      onPress: () => {
        clearCartItemAPI();
      },
    },
  ]);
};

export const appUpdateAlert = () => {
  const profileData = getStore().profile.profileData;

  const onPressUpdate = () => {
    if (
      profileData &&
      profileData?.api_token &&
      profileData.mobile_no.match(constants.numberRegex)
    ) {
      logoutAPI();
    }
    Platform.OS === 'ios'
      ? VersionCheck.getAppStoreUrl({appID: '6451184276'}).then(appStoreUrl => {
          Linking.openURL(appStoreUrl);
        })
      : VersionCheck.getPlayStoreUrl({packageName}).then(playStoreUrl => {
          Linking.openURL(playStoreUrl);
        });
  };

  VersionCheck.needUpdate({
    packageName,
  }).then(res => {
    const {currentVersion, latestVersion, isNeeded} = res;
    if (isNeeded) {
      Alert.alert(
        'Update Available',
        'A new version of the app is available. Please update to the latest version for best experience.',
        [
          {
            text: 'Update Now',
            onPress: onPressUpdate,
          },
        ],
      );
    } else {
    }
  });
};

export const getGMP = () => {
  const randomData = getStore().generic.randomData;
  if (randomData) {
    const {gmp, gp} = randomData;
    return decryptData(gmp, gp);
  }
};
export const contactWithWhatsApp = (phoneWithCountryCode: string) => {
  let mobile =
    Platform.OS == 'ios' ? phoneWithCountryCode : '+' + phoneWithCountryCode;
  if (mobile) {
    let url = 'whatsapp://send?text=&phone=' + mobile;
    Linking.openURL(url)
      .then(data => {})
      .catch(() => {
        errorToast('Make sure WhatsApp installed on your device');
      });
  } else {
    errorToast('Please insert mobile number');
  }
};

export const extractSubstring = (str: string, char1: string, char2: string) => {
  const index1 = str.indexOf(char1);
  const index2 = str.indexOf(char2);

  if (index1 !== -1 && index2 !== -1) {
    // Make sure char1 appears before char2
    if (index1 < index2) {
      return str.substring(index1 + 1, index2);
    }
  }
  return null; // Return null if the characters are not found in the correct order.
};
