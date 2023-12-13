import {screenName} from './screenName';

export const constants = {
  apiSuccess: 'success',
  apiFailure: 'failure',

  endPtGetAddress: 'address-list',
  endPtStoreAddress: 'store-address',
  endPtRemoveAddress: 'remove-address',
  endPtUpdateDefaultAddress: 'update-default-address',
  endPtHome: 'home',
  endPtStore: 'store-list',
  endPtStoreDetail: 'store-details',
  endPtLogin: 'login-v1',
  endPtLoginOtp: 'check-login-otp',
  endPtResendOtp: 'resendotp',
  endPtSignUp: 'register-user-v1',
  endPtProfilePic: 'user-profile-picture',
  endPtVerifyUser: 'verify-front-user-v1',
  endPtRegResendOtp: 'register-resend-otp-v1',
  endPtSocialLogin: 'social-login-v1',
  endPtProductDetails: 'product-detail',
  endProductReviewList: 'product-review-list',
  endPtFilterVariation: 'filter-variation-list',
  endPtWishList: 'wish-list',
  endPtAddRemoveWishList: 'add-remove-wish-list',
  endPtLogout: 'logout',
  endPtBrandListForFilter: 'brand-list-by-category',
  endPtAddToCart: 'add-to-cart-v1',
  endPtGetCart: 'get-cart-items-v1',
  endPtUpdateCartItem: 'update-cart-item-v1',
  endPtDeleteCartItem: 'delete-cart-item-v1',
  endPtUpdateProfile: 'update-profile-v1',
  endPtVerifyUpdateProfile: 'verify-update-profile',
  endPtUpdateProfileResendOtp: 'resend-update-profile-otp',
  endPtCouponCodeList: 'get-available-coupon-codes-v1',
  endPtApplyCouponCode: 'apply-coupon-code-v1',
  endPtUniversalSearch: 'universal-search',
  endPtUniversalProductSearch: 'universal-product-search',
  endPtRemoveCouponCode: 'remove-coupon-code-v1',
  endPtDeliveryTimeSlot: 'delivery-time-slot-v1',
  endPtPlaceOrder: 'place-order-v2',
  endPtCheckPaymentStatus: 'check-order-payment-status-v2',
  endPtCheckDeliveryTime: 'check-delivery-time',
  endPtMakePayment: 'make-payment-v2',
  endPtContactSupport: 'store-contact-us',
  endPtFAQ: 'faq-list',
  endPtOrderReturnList: 'get-order-return-available',
  endPtOrderReturnRequest: 'order-return-request/',
  endPtOrderHistory: 'order-history',
  endPtOrderDetails: 'order-detail/',
  endPtRating: 'order/review-rating',
  endPtCancelOrder: 'cancel-order',
  endPtSettings: 'site-settings',
  endPtDeleteAccount: 'delete-account',
  endPtAddRemoveGift: 'add-or-remove-gift-packing-v1',
  endPtSubCategoryListByCategory: 'sub-category-list-by-category',
  endPtOrderInvoice: (id: any) => `order-invoice/${id}`,
  endPtNotificationList: 'notification-list',
  endPtClearCart: 'clear-cart',
  endPtOnboarding: 'partner-onboarding-form',
  endPtSubmitOnboardingForm: 'partner-onboarding-form-store',
  endPtPayModes: 'get-available-payment-modes',
  endPtNotificationCount: 'unread-notification-count',
  endPtReadNotification: 'read-notification',
  endPtReadSingleNotification: 'read-single-notification',
  endPtCategoryWithSubCategory: 'get-category-with-sub-category',
  endPtGetRandomData: 'get-random-data',
  endPtWhatsAppClickCount: 'whatsApp-click-count',

  asyncUserToken: 'user_token',
  asyncFcmToken: 'FCM_token',
  asyncIntroSkip: 'intro_skip',
  asyncLocationEnteredSkip: 'location_entered_skip',
  asyncMyDeviceUUID: 'my_device_uuid',
  asyncRecentlyViewed: 'recently_viewed_product_items',
  asyncLoginData: 'loginData',
  asyncSignupData: 'signupData',

  tabSafeAreaList: [
    screenName.tabHome,
    screenName.tabCart,
    screenName.tabCategory,
    screenName.tabStore,
  ],

  analyticsEvents: {
    appOpen: 'app_open',
    storeClicks: 'store_clicks',
    cartBuild: 'cart_build',
    orders: 'orders',
    timeFrameAndFunnel: 'time_frame_and_funnel',
    categorySelection: 'category_selection',
    registrationComplete: 'registration_complete',
    addToCart: 'add_to_cart',
    paymentComplete: 'payment_complete',
    conversionNumber: 'conversion_number',
    conversionValue: 'conversion_value',
  },

  onBoardingQuestionKeys: {
    radio: 'radio',
    checkbox: 'checkbox',
    text: 'text',
    dropdown: 'dropdown',
    email: 'email',
    mobile_number: 'mobile_number',
    gst_number: 'gst_number',
  },
  emailRegex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  numberRegex:
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
  gstRegex: /\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/,
};

export const initialList: any[] = [
  {
    name: 'Sort By',
    option_list: [
      {
        name: 'Rating',
        value: 'rating',
      },
      {
        name: 'Most Viewed',
        value: 'most_viewed',
      },
      {
        name: 'Biggest Saving',
        value: 'biggest_saving',
      },
      {
        name: 'Price Low to High',
        value: 'price_low_to_high',
      },
      {
        name: 'Price High to Low',
        value: 'price_high_to_low',
      },
      {
        name: 'Best Sell',
        value: 'best_sell',
      },
      {
        name: 'Newest First',
        value: 'newest_first',
      },
    ],
  },
];