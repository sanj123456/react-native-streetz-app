/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-cartStyles */
import {
  useFocusEffect,
  useRoute,
  useScrollToTop,
} from '@react-navigation/native';
import {FC, Fragment, useCallback, useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSelector} from 'react-redux';
import {
  AddAddress,
  AddressItem,
  Background,
  CartItem,
  InfoIcon,
  NoDataFound,
  PaymentItem,
  PrimaryButton,
  PrimaryHeader,
  PrimaryModal,
  PrimaryText,
} from '../../components';
import {
  checkProfileEmail,
  decryptData,
  errorToast,
  getTabSafeAreaHeight,
  images,
  loginAlert,
  screenName,
  toNumber,
} from '../../core';
import {strings} from '../../i18n';
import {RootState, dispatch} from '../../redux';
import {
  applyCouponCodeAPI,
  getAddressAPI,
  getCartAPI,
  getPayModesAPI,
  giftWrapAPI,
  makePaymentAPI,
  placeOrderAPI,
  removeCouponCodeAPI,
} from '../../services';
import {
  cartStyles,
  colors,
  commonStyles,
  deliverySlotStyles,
  fonts,
} from '../../styles';
import {CommonNavigationProps} from '../../types/navigationTypes';
import moment from 'moment';
import {setDeliveryTime, setPayMode} from '../../redux/modules/cartSlice';
import {primaryModalRef} from '../../components/PrimaryModal';

export const Cart: FC<CommonNavigationProps> = ({navigation}) => {
  /*************** Hooks Functions ***************/
  const [inputValue, setInputValue] = useState('');
  const [paddingBottom, setPaddingBottom] = useState(0);
  const [showTotalModal, setShowTotalModal] = useState(false);
  const route = useRoute();

  const myCart = useSelector((state: RootState) => state?.cart?.myCart);
  const deliveryTime = useSelector(
    (state: RootState) => state?.cart?.deliveryTime,
  );
  const {profileData} = useSelector((state: RootState) => ({
    profileData: state?.profile?.profileData,
  }));
  const randomData = useSelector(
    (state: RootState) => state?.generic?.randomData,
  );
  const payMode = useSelector((state: RootState) => state?.cart?.payMode);
  const userType = useSelector((state: RootState) => state?.profile?.userType);
  const isDisplayingKeyboard = useSelector(
    (state: RootState) => state?.generic?.isDisplayingKeyboard,
  );
  const selectedAddress = useSelector(
    (state: RootState) => state.address?.selectedAddress,
  );
  const isDeliveryAvailable = useSelector(
    (state: RootState) => state?.cart?.isDeliveryAvailable,
  );

  const paymentModes = useSelector(
    (state: RootState) => state?.order?.paymentModes,
  );

  useEffect(() => {
    getPayModesAPI();
  }, []);
  const scrollViewRef = useRef<any>();

  useScrollToTop(
    useRef({
      scrollToTop: () => scrollViewRef.current?.scrollTo({y: 0}),
    }),
  );
  useFocusEffect(
    useCallback(() => {
      setPaddingBottom(getTabSafeAreaHeight());
    }, [navigation]),
  );

  const getTotalPrice = () => {
    let total = myCart?.items.reduce(
      (totalSum, item) =>
        totalSum +
        toNumber(item?.discounted_price ?? item?.price) * item?.quantity,
      0,
    );
    return total;
  };

  const getFinalPrice = () => {
    const discount = toNumber(myCart?.totalPrice?.discounted_price ?? 0);
    const deliveryFee = toNumber(myCart?.totalPrice?.delivery_fee ?? 0);
    const connivanceFee = toNumber(myCart?.totalPrice?.connivance_fee ?? 0);
    const giftWrappingFee = toNumber(
      myCart?.totalPrice?.gift_wrapping_fee ?? 0,
    );
    const final =
      getTotalPrice() +
      deliveryFee +
      connivanceFee +
      giftWrappingFee -
      discount;
    return final;
  };

  useEffect(() => {
    userType === 'registered' && getUserAddress();
    return () => {};
  }, []);

  const getUserAddress = () => {
    getAddressAPI();
  };

  useEffect(() => {
    const listener = navigation.addListener('focus', () => {
      if (selectedAddress?.latitude && selectedAddress?.longitude && myCart) {
        getCartAPI();
      }
    });
    return listener;
  }, [selectedAddress?.latitude, navigation, selectedAddress?.longitude]);

  const handleInputChange = (text: string) => {
    setInputValue(text);
  };

  const handleApplyCoupon = () => {
    if (inputValue.trim().length === 0) {
      errorToast('Please enter valid coupon code');
      return;
    }
    const payload = {
      coupon_code: inputValue.trim(),
      is_manual: true,
    };
    if (userType === 'guest') {
      loginAlert(route.name);
    } else {
      applyCouponCodeAPI(payload);
    }
    Keyboard.dismiss();
  };

  const handlePlaceOrder = () => {
    if (
      checkProfileEmail(
        randomData?.gp
          ? decryptData(JSON?.parse(profileData?.email), randomData?.gp)
          : '',
      )
    ) {
      userType === 'guest'
        ? loginAlert(route.name)
        : !selectedAddress?.id
        ? totalModalToast(strings.msgPleaseSelectDeliveryAddress, 'danger')
        : !isDeliveryAvailable
        ? totalModalToast(strings.ctDeliveryNotPossible, 'danger')
        : placeOrder();
    } else {
      setShowTotalModal(false);
    }
  };

  const totalModalToast = (msg: any, type?: 'success' | 'danger') => {
    if (showTotalModal) {
      primaryModalRef?.current?.showMessage({
        message: strings.ctOops,
        description: msg,
        type: type,
        position: 'top',
        icon: 'auto',
      });
    } else {
      errorToast(msg);
    }
  };

  const placeOrder = async () => {
    setShowTotalModal(false);
    let payload: any = {
      user_address_id: selectedAddress?.id,
    };
    if (deliveryTime?.type === 1) {
      payload = {
        ...payload,
        date: deliveryTime?.date,
        delivery_time_slot_id: deliveryTime?.delivery_time_slot_id,
      };
    }
    const res = await placeOrderAPI(payload);
    if (res) {
      makePayment(res);
    }
  };

  const makePayment = (orderData: any) => {
    const payment_method = payMode?.enum ?? '';
    makePaymentAPI({
      payment_method,
      order_id: orderData?.id,
    });
  };

  const handleGiftWrap = () => {
    dispatch(setDeliveryTime({type: 0}));
    giftWrapAPI({
      is_gift: myCart?.totalPrice?.is_gift === 'yes' ? 'no' : 'yes',
    });
  };

  const redirectToStore = () => {
    navigation.navigate(screenName.storeDetails, {
      seller_store_id: myCart?.seller_store_address_id,
      category_id: myCart?.category_id,
    });
  };

  const checkProductUnavailable = () => {
    const newArray = myCart?.items?.filter(
      item =>
        item?.product?.status === 'InActive' ||
        item?.product_variation_combination?.status === 'InActive',
    );
    return newArray?.length > 0;
  };

  const deliveryOption = [
    {
      label: 'Real-time delivery within ',
    },
    {
      label: 'Schedule Delivery',
    },
  ];

  const makeDeliveryDate = deliveryTime?.dateObj
    ? moment(deliveryTime?.dateObj, 'MM-DD-YYYY')
    : null;

  const getMonthDate = () => {
    const date = deliveryTime?.dateObj
      ? moment(deliveryTime?.dateObj, 'MM-DD-YYYY')?.format('DD')
      : null;
    return toNumber(date);
  };

  const onPressDeliverySlot = (index: any) => {
    index === 0
      ? dispatch(setDeliveryTime({...deliveryTime, type: 0}))
      : deliveryTime?.delivery_time_slot_id
      ? dispatch(setDeliveryTime({...deliveryTime, type: 1}))
      : navigation.navigate(screenName.deliverySlot);
  };

  const renderItem = ({item, index}: any) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPressDeliverySlot.bind(null, index)}
        key={`${index}_delivery_option_keys`}
        testID={`${index}_delivery_option_keys`}
        style={[
          cartStyles.optionSlotItemWrapper,
          index === 0 ? cartStyles.slotItemSeparator : {},
        ]}>
        <View style={cartStyles.freeSlotWrapper}>
          <View style={cartStyles.optionSlotTopWrapper}>
            <Image
              style={commonStyles.icon21}
              source={
                deliveryTime?.type === index ? images.icTick : images.icUnTick
              }
            />
            {index === 0 ? (
              <View style={cartStyles.txtOptionLabelSlotView}>
                <PrimaryText style={cartStyles.txtOptionLabelSlot0}>
                  {item?.label}
                </PrimaryText>
                <PrimaryText style={cartStyles.txtOptionLabelSlotBold}>
                  2 hours
                </PrimaryText>
              </View>
            ) : (
              <PrimaryText style={cartStyles.txtOptionLabelSlot}>
                {item?.label}
              </PrimaryText>
            )}
          </View>
          {index === 1 && deliveryTime?.delivery_time_slot_id && (
            <PrimaryText style={cartStyles.slotDateAndTime}>
              {moment(makeDeliveryDate).format(
                getMonthDate() === 1
                  ? 'DD[st] MMMM YYYY'
                  : getMonthDate() === 2
                  ? 'DD[nd] MMMM YYYY'
                  : getMonthDate() === 3
                  ? 'DD[rd] MMMM YYYY'
                  : 'DD[th] MMMM YYYY',
              )}
              {deliveryTime?.time}
            </PrimaryText>
          )}
        </View>
        {index === 1 && (
          <TouchableOpacity
            onPress={() => navigation.navigate(screenName.deliverySlot)}
            activeOpacity={0.8}>
            <Image style={commonStyles.icon38} source={images.icCalendar} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  const onAddAddressHandler = () =>
    userType === 'registered'
      ? navigation.navigate(screenName.myAddresses)
      : loginAlert(route.name);

  return (
    <Background>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}
        testID={'cartScrollView'}>
        <View
          style={{
            ...commonStyles.flex1,
            paddingBottom: paddingBottom,
          }}>
          <PrimaryHeader
            title={strings.ctCart}
            left="back"
            right="home_plus_menu"
            screen_from="cart"
          />
          {myCart?.items?.length > 0 ? (
            <>
              <KeyboardAwareScrollView
                extraScrollHeight={-100}
                nestedScrollEnabled
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={cartStyles.contentContainerStyle}>
                <View
                  style={cartStyles.sidePadding}
                  testID={'cartDeliveryAvailable'}>
                  {!isDeliveryAvailable && selectedAddress?.id && (
                    <PrimaryText
                      style={cartStyles.txtDeliveryNotPossible}
                      testID={'cartDeliveryNotPossibleTxt'}>
                      {strings.ctDeliveryNotPossible}
                    </PrimaryText>
                  )}
                  {userType === 'registered' && selectedAddress?.id ? (
                    <AddressItem
                      type="cart"
                      data={selectedAddress}
                      navigation={navigation}
                    />
                  ) : (
                    <AddAddress onPress={onAddAddressHandler} />
                  )}
                  <View style={cartStyles.cartListWrapper}>
                    {myCart?.items?.length > 0 && (
                      <View
                        style={cartStyles.storeMainWrapper}
                        testID={'cartStoreMainText'}>
                        <PrimaryText
                          style={cartStyles.storeText}
                          testID={'cartItemFrom'}>
                          {strings.ctYourItemsFrom}
                        </PrimaryText>
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={redirectToStore}
                          testID={'cartStoreRedirect'}
                          style={{flexShrink: 1}}>
                          <PrimaryText
                            style={cartStyles.storeName}
                            numberOfLines={1}>
                            {myCart?.seller_store_name}
                          </PrimaryText>
                        </TouchableOpacity>
                      </View>
                    )}
                    {myCart?.items?.map((item, index) => (
                      <Fragment key={`${index}_cart_item`}>
                        <CartItem data={item} />
                        {index + 1 < myCart?.items?.length && (
                          <View style={cartStyles.cartItemSeparator} />
                        )}
                      </Fragment>
                    ))}
                  </View>
                </View>

                <View style={cartStyles.slotWrapper}>
                  <PrimaryText style={cartStyles.headingSlot}>
                    {strings.ctDeliveryTimeSlot}
                  </PrimaryText>
                  <View style={deliverySlotStyles.optionWrapper}>
                    <FlatList
                      scrollEnabled={false}
                      data={deliveryOption}
                      renderItem={renderItem}
                      keyExtractor={(item, index) => index.toString()}
                    />
                  </View>
                </View>
                <View style={commonStyles.payCartItemWrapper}>
                  <PrimaryText
                    style={[
                      commonStyles.payItemLabel,
                      {backgroundColor: colors.primary1},
                    ]}>
                    {strings.ctPaymentMode}
                  </PrimaryText>

                  {paymentModes?.length > 0 &&
                    paymentModes?.map((item: any, index: number) => (
                      <PaymentItem item={item} selectedItemMode={payMode} />
                    ))}
                </View>

                <View
                  style={cartStyles.couponOuterWrapper}
                  testID={'cartCouponOuter'}>
                  <TouchableOpacity
                    style={cartStyles.giftWrapper}
                    activeOpacity={0.8}
                    onPress={handleGiftWrap}
                    testID={'cartGiftWrap'}>
                    <Image
                      style={commonStyles.icon20}
                      source={
                        myCart?.totalPrice?.is_gift === 'yes'
                          ? images.icTick
                          : images.icUnTick
                      }
                    />
                    <PrimaryText style={cartStyles.txtGift}>
                      Would You Like To
                      <PrimaryText style={fonts.heading14}>
                        {` GIFT `}
                      </PrimaryText>
                      This Items
                    </PrimaryText>
                  </TouchableOpacity>

                  {myCart?.totalPrice?.coupon_code ||
                  myCart?.totalPrice?.referral_code ? (
                    <View style={cartStyles.couponWrapper} testID={'cartPrice'}>
                      <PrimaryText
                        style={cartStyles.appliedCouponText}
                        testID={'cartAppliedCouponText'}>
                        {strings.ctAppliedCoupon}:{' '}
                        {myCart?.totalPrice?.coupon_code ??
                          myCart?.totalPrice?.referral_code}
                      </PrimaryText>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                          setInputValue('');
                          removeCouponCodeAPI();
                        }}
                        testID={'cartRemoveCouponCode'}>
                        <Image
                          style={commonStyles.icon18}
                          source={images.icClose}
                        />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={cartStyles.couponWrapper}>
                      <TextInput
                        style={cartStyles.couponInput}
                        placeholder={strings.ctApplyCouponCode}
                        placeholderTextColor={colors.placeholder}
                        onChangeText={handleInputChange}
                        value={inputValue}
                      />
                      {inputValue.length > 0 ? (
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={handleApplyCoupon}
                          testID={'cartApplyCoupon'}>
                          <PrimaryText
                            style={cartStyles.txtAllCoupon}
                            testID={'cartBtnApply'}>
                            {strings.ctApply}
                          </PrimaryText>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() =>
                            navigation.navigate(screenName.coupons)
                          }
                          testID={'cartAllCoupon'}>
                          <PrimaryText
                            style={cartStyles.txtAllCoupon}
                            testID={'cartAllCouponText'}>
                            {strings.ctAllCoupons}
                          </PrimaryText>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                </View>
              </KeyboardAwareScrollView>

              {isDisplayingKeyboard && Platform.OS === 'ios' ? null : (
                <View
                  style={[
                    cartStyles.bottomWrapper,
                    {opacity: isDisplayingKeyboard ? 0 : 1},
                  ]}>
                  <View style={cartStyles.bottomLeft}>
                    <View style={[commonStyles.horizontalCenterStyles]}>
                      <PrimaryText style={cartStyles.txtTotalAmountCart}>
                        {strings.ctTotalAmount}
                      </PrimaryText>
                      <InfoIcon
                        type="on_press"
                        onPress={() => setShowTotalModal(true)}
                      />
                    </View>
                    <PrimaryText style={cartStyles.txtAmountCart}>
                      {strings.currency} {getFinalPrice()?.toFixed(2)}
                    </PrimaryText>
                  </View>
                  <PrimaryButton
                    disabled={
                      (!isDeliveryAvailable &&
                        selectedAddress?.id !== undefined) ||
                      checkProductUnavailable()
                    }
                    style={cartStyles.placeOrderBtnCart}
                    onPress={handlePlaceOrder}
                    title={strings.btPlaceOrder}
                  />
                </View>
              )}

              <SafeAreaView style={commonStyles.bgPrimary} />
            </>
          ) : (
            <NoDataFound label={strings.msgEmptyCart} />
          )}
          <PrimaryModal
            type="cart_total"
            isVisible={showTotalModal}
            onClose={() => setShowTotalModal(false)}
            onPlaceOrder={handlePlaceOrder}
          />
        </View>
      </KeyboardAvoidingView>
    </Background>
  );
};
