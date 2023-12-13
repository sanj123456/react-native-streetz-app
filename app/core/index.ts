import {
  perfectSize,
  errorToast,
  successToast,
  consoleHere,
  getTabSafeAreaHeight,
  loginAlert,
  isRefreshing,
  infoToast,
  topicSubscription,
  encryptData,
  decryptData,
} from './genericUtils';
import {constants, initialList} from './constants';
import {screenName} from './screenName';
import {images} from './images';
import {
  calculateDistance,
  checkProfileEmail,
  clearCartAlert,
  forcedlyClearCartAlert,
  appUpdateAlert,
  getConvenienceFee,
  getDeliveryFee,
  getNext7DaysDates,
  getOrderProgressBar,
  getOrderStatus,
  getSupportMail,
  isSocialLoginForIOS,
  orderStatusData,
  resetDataForNewLogin,
  toNumber,
  getGMP,
  contactWithWhatsApp,
  extractSubstring,
} from './helpers';

export {
  screenName,

  // Constants
  images,
  constants,
  initialList,

  // Generic Functions
  perfectSize,
  errorToast,
  successToast,
  consoleHere,
  getTabSafeAreaHeight,
  loginAlert,
  isRefreshing,
  infoToast,
  topicSubscription,
  decryptData,
  encryptData,

  // Helpers Functions
  toNumber,
  clearCartAlert,
  calculateDistance,
  getNext7DaysDates,
  orderStatusData,
  getOrderProgressBar,
  getOrderStatus,
  isSocialLoginForIOS,
  getSupportMail,
  checkProfileEmail,
  getDeliveryFee,
  getConvenienceFee,
  resetDataForNewLogin,
  forcedlyClearCartAlert,
  appUpdateAlert,
  getGMP,
  contactWithWhatsApp,
  extractSubstring,
};
