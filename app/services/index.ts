import {getAsyncData, removeAsyncData, setAsyncData} from './asyncServices';
import {
  checkImageExists,
  getSettingsAPI,
  makeMediaUrl,
} from './genericServices';
import {
  brandListForFilterAPI,
  filterVariationAPI,
  homeAPI,
  productDetailsAPI,
  productRatingReviewAPI,
  storeAPI,
  storeDetailsAPI,
  universalSearchAPI,
  OnBoardingAPI,
} from './homeServices';
import {getGeoLocation} from './geolocationService';
import {
  getAddressAPI,
  addAddressAPI,
  updateAddressAPI,
  removeAddressAPI,
  updateDefaultAddressAPI,
} from './addressServices';
import {
  updateProfileAPI,
  loginAPI,
  logoutAPI,
  otpVerifyAPI,
  profilePictureAPI,
  registerResendAPI,
  resendAPI,
  signUpAPI,
  socialLoginAPI,
  verifyFrontUserAPI,
  deleteAccountAPI,
} from './authServices';
import {addRemoveAPI, getWishListAPI} from './wishlistServices';
import {
  addToCartAPI,
  deleteCartItemAPI,
  getCartAPI,
  updateCartItemAPI,
  couponCodeListAPI,
  applyCouponCodeAPI,
  removeCouponCodeAPI,
  giftWrapAPI,
  clearCartItemAPI,
  deliveryTimeSlotAPI,
} from './cartServices';
import {
  placeOrderAPI,
  checkPaymentStatusAPI,
  checkDeliveryAvailAPI,
  makePaymentAPI,
  orderHistoryAPI,
  orderDetailsAPI,
  reviewRatingAPI,
  cancelOrderAPI,
  orderInvoiceAPI,
  getPayModesAPI,
} from './orderServices';
import {
  getNotificationCountAPI,
  getNotificationsAPI,
  notificationService,
  readNotificationAPI,
} from './notificationService';
import {contactSupportAPI, faqAPI} from './helpServices';
import {analyticsLogEvent} from './analyticsServices';

export {
  // Async functions
  setAsyncData,
  getAsyncData,
  removeAsyncData,

  //Generic APIs & services
  makeMediaUrl,
  checkImageExists,

  //Geolocation services
  getGeoLocation,

  //Address services
  getAddressAPI,
  addAddressAPI,
  updateAddressAPI,
  removeAddressAPI,
  updateDefaultAddressAPI,

  // Auth APIs
  loginAPI,
  otpVerifyAPI,
  resendAPI,
  signUpAPI,
  verifyFrontUserAPI,
  profilePictureAPI,
  registerResendAPI,
  socialLoginAPI,
  logoutAPI,
  updateProfileAPI,
  deleteAccountAPI,

  // Home Module APIs
  homeAPI,
  productDetailsAPI,
  storeAPI,
  storeDetailsAPI,
  filterVariationAPI,
  productRatingReviewAPI,
  universalSearchAPI,

  //WishList APIs
  getWishListAPI,
  addRemoveAPI,
  brandListForFilterAPI,

  // Cart APIs
  addToCartAPI,
  getCartAPI,
  updateCartItemAPI,
  deleteCartItemAPI,
  couponCodeListAPI,
  applyCouponCodeAPI,
  removeCouponCodeAPI,
  giftWrapAPI,
  clearCartItemAPI,
  deliveryTimeSlotAPI,

  // Notification APIs and services
  notificationService,
  getNotificationsAPI,
  getNotificationCountAPI,
  readNotificationAPI,

  // Help APIs
  contactSupportAPI,
  faqAPI,

  // Order APIs
  placeOrderAPI,
  checkPaymentStatusAPI,
  checkDeliveryAvailAPI,
  makePaymentAPI,
  orderHistoryAPI,
  orderDetailsAPI,
  reviewRatingAPI,
  cancelOrderAPI,
  orderInvoiceAPI,
  getPayModesAPI,

  // Settings APIs
  getSettingsAPI,

  // analytics services,
  analyticsLogEvent,
  OnBoardingAPI,
};
