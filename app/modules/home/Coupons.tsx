/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {FC, useEffect, useState} from 'react';
import {TouchableOpacity, View, TextInput, Keyboard} from 'react-native';
import {CommonNavigationProps} from '../../types/navigationTypes';
import {colors, couponsStyles, fonts} from '../../styles';
import {Background, PrimaryHeader, PrimaryText} from '../../components';
import {strings} from '../../i18n';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {FlatList} from 'react-native-gesture-handler';
import {couponCodeListAPI} from '../../services';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux';
import {applyCouponCodeAPI} from '../../services';
import ShowMoreText from '../../components/ShowMoreText';
import {errorToast, loginAlert} from '../../core';
import {useRoute} from '@react-navigation/native';

export const Coupons: FC<CommonNavigationProps> = ({navigation}) => {
  const couponList = useSelector(
    (state: RootState) => state.home.couponCodeList,
  );
  const userType = useSelector((state: RootState) => state?.profile?.userType);
  const myCart = useSelector((state: RootState) => state.cart.myCart);
  const selectedAddress = useSelector(
    (state: RootState) => state.address.selectedAddress,
  );
  const route = useRoute();
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    getCouponList();
  }, []);

  const getCouponList = async () => {
    const newArray = myCart?.items?.map(item => `${item?.product_id}`);
    const payload = {
      productIds: newArray,
      latitude: selectedAddress?.latitude,
      longitude: selectedAddress?.longitude,
    };
    couponCodeListAPI(payload);
  };

  const renderItem = ({item, index}: any) => (
    <View style={couponsStyles.itemWrapper} key={`${index}_coupon_item`}>
      <View style={couponsStyles.leftView}>
        <PrimaryText style={couponsStyles.txtLabel}>{item.title}</PrimaryText>
        <ShowMoreText text={item?.description ?? ''} />
      </View>
      <View style={[couponsStyles.rightView, {flex: 1}]}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleCouponSelect(item.coupon_code)}>
          <PrimaryText style={couponsStyles.txtApply}>
            {strings.ctApply}
          </PrimaryText>
        </TouchableOpacity>
        <View>
          <PrimaryText style={couponsStyles.txtCode}>
            {strings.ctCode}
          </PrimaryText>
          <PrimaryText numberOfLines={1} style={couponsStyles.Code}>
            {' '}
            {item.coupon_code}
          </PrimaryText>
        </View>
      </View>
    </View>
  );

  const handleCouponSelect = (selectedCouponCode: any) => () => {
    if (selectedCouponCode.trim().length === 0) {
      errorToast('please enter valid coupon code');
      return;
    }
    const payload = {
      coupon_code: selectedCouponCode.trim(),
    };
    if (userType === 'guest') {
      loginAlert(route.name);
    } else {
      applyCouponCodeAPI(payload, navigation);
    }
  };

  const handleInputChange = (text: any) => {
    setInputValue(text);
  };

  const handleApplyCoupon = async () => {
    if (inputValue.trim().length === 0) {
      errorToast('please enter valid coupon code');
      return;
    }
    if (userType === 'guest') {
      loginAlert(route.name);
    } else {
      const payload = {
        coupon_code: inputValue.trim(),
      };
      applyCouponCodeAPI(payload, navigation);
    }
    Keyboard.dismiss();
  };

  return (
    <Background>
      <PrimaryHeader title={strings.ctDiscountsCoupons} left="back" />
      <KeyboardAwareScrollView
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={couponsStyles.contentContainerStyle}>
        <PrimaryText style={fonts.medium16}>
          {strings.ctEnterCouponCode}
        </PrimaryText>
        <View style={couponsStyles.couponWrapper}>
          <TextInput
            style={couponsStyles.couponInput}
            placeholder={strings.ctApplyCouponCode}
            placeholderTextColor={colors.placeholder}
            onChangeText={handleInputChange}
          />
          <TouchableOpacity onPress={handleApplyCoupon}>
            <PrimaryText style={couponsStyles.txtAllCoupon}>
              {strings.ctApply}
            </PrimaryText>
          </TouchableOpacity>
        </View>

        <PrimaryText style={fonts.medium16}>{strings.ctMoreOffers}</PrimaryText>
        <FlatList
          scrollEnabled={false}
          contentContainerStyle={couponsStyles.contentContainerFlatListStyle}
          data={couponList?.coupon_codes}
          keyExtractor={(item, index) => `${index}_coupon_keys`}
          renderItem={renderItem}
        />
      </KeyboardAwareScrollView>
    </Background>
  );
};
