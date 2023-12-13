/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import React, {FC, useRef} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import FlashMessage from 'react-native-flash-message';
import Modal from 'react-native-modal';
import {useSelector} from 'react-redux';
import {
  getConvenienceFee,
  getDeliveryFee,
  getSupportMail,
  images,
  screenName,
  toNumber,
} from '../core';
import {strings} from '../i18n';
import {getCurrentRoute} from '../navigation/RootNavigation';
import {RootState} from '../redux';
import {cartStyles, colors, commonStyles, fonts} from '../styles';
import {PrimaryModalProps} from '../types/components';
import {InfoIcon} from './InfoIcon';
import {PrimaryButton} from './PrimaryButton';
import {PrimaryText} from './PrimaryText';

const itemAddedData = [
  {
    label: strings.ctGoToCart,
    icon: images.tabCart,
    screen: screenName.cart,
  },
  {
    label: strings.ctShopMore,
    icon: images.tabHome,
    screen: screenName.storeDetails,
  },
];
export let primaryModalRef: any;
export const PrimaryModal: FC<PrimaryModalProps> = ({
  isVisible,
  type,
  onClose,
  onChange,
  payload,
  onPlaceOrder,
}) => {
  const navigation: any = useNavigation();
  primaryModalRef = useRef(null);
  const category_list = useSelector(
    (state: RootState) => state.home?.homeData?.category_list,
  );
  const store_details = useSelector(
    (state: RootState) => state.home.storeDetailData?.store_details,
  );
  const product_detail = useSelector(
    (state: RootState) => state.home.productDetails?.product_detail,
  );
  const myCart = useSelector((state: RootState) => state?.cart?.myCart);
  const selectedAddress = useSelector(
    (state: RootState) => state.address?.selectedAddress,
  );
  const isDeliveryAvailable = useSelector(
    (state: RootState) => state?.cart?.isDeliveryAvailable,
  );

  const newCategoryList = () => {
    if (
      getCurrentRoute() === screenName.tabStore ||
      getCurrentRoute() === screenName.search
    ) {
      return [
        {id: null, category_name: strings.ctAllStore, image: null},
        ...category_list,
      ];
    } else if (getCurrentRoute() === screenName.storeDetails) {
      const newArray = store_details?.seller_store_categories?.map(
        (item: any) => ({
          ...item?.category,
        }),
      );
      return newArray;
    } else {
      return category_list;
    }
  };

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

  const totalDetails = [
    {
      label: strings.ctTotalMRP,
      value: getTotalPrice(),
      type: null,
    },
    {
      label: strings.ctConvenienceFees,
      value: toNumber(myCart?.totalPrice?.connivance_fee ?? 0),
      type: 'convenience',
    },
    {
      label: strings.ctGiftWrappingFees,
      value: toNumber(myCart?.totalPrice?.gift_wrapping_fee ?? 0),
      type: 'gift',
    },
    {
      label: strings.ctDeliveryFee,
      value:
        myCart?.totalPrice?.type === 'free-delivery'
          ? toNumber(myCart?.totalPrice?.calculate_delivery_fee ?? 0)
          : toNumber(myCart?.totalPrice?.delivery_fee ?? 0),
      type: 'delivery',
    },
    {
      label: strings.ctDiscount,
      value: toNumber(myCart?.totalPrice?.discounted_price ?? 0),
      type: 'discount',
    },
    {
      label: strings.ctTotalAmount,
      value: getFinalPrice(),
      type: 'total',
    },
  ];

  const checkProductUnavailable = () => {
    const newArray = myCart?.items?.filter(
      item =>
        item?.product?.status === 'InActive' ||
        item?.product_variation_combination?.status === 'InActive',
    );
    return newArray?.length > 0;
  };

  return (
    <Modal
      style={{
        ...styles.modalView,
        justifyContent: type === 'return_order' ? 'center' : 'flex-end',
      }}
      isVisible={isVisible}
      onBackButtonPress={onClose}
      onBackdropPress={onClose}>
      <FlashMessage ref={primaryModalRef} duration={4000} color={'#ffffff'} />
      {type === 'item_added' && (
        <View style={styles.mainView}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onClose}
            hitSlop={commonStyles.hitSlop}
            style={styles.dropdownWrapper}>
            <Image style={commonStyles.icon15} source={images.icDropDownBlur} />
          </TouchableOpacity>
          <View style={styles.afterAddWrapper}>
            {itemAddedData?.map((item, index) => (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  onClose();
                  index === 1
                    ? navigation.navigate(screenName.storeDetails, {
                        seller_store_id:
                          product_detail?.seller_store_address_id,
                        category_id: product_detail?.category_id,
                      })
                    : navigation.navigate(item?.screen);
                }}
                style={styles.afterAddIconItem}
                key={`${index}_item_added_data`}>
                <View style={styles.afterAddIconWrapper}>
                  <Image style={styles.afterAddIcon} source={item?.icon} />
                </View>
                <PrimaryText style={styles.afterAddText}>
                  {item?.label}
                </PrimaryText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {type === 'return_order' && (
        <View style={styles.returnView}>
          <Image style={commonStyles.icon38} source={images.icMail} />
          <PrimaryText style={styles.txtMail}>
            We are sorry for the Inconvenience. Can you please email us at
            <PrimaryText
              style={{
                ...styles.txtMail,
                color: colors.primary,
              }}>
              {' '}
              {getSupportMail()}{' '}
            </PrimaryText>
            regarding the same
          </PrimaryText>
          <PrimaryButton
            style={styles.btnSend}
            title={strings.btSend}
            onPress={onClose}
          />
        </View>
      )}

      {type === 'other_category' && (
        <View style={styles.mainView}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onClose}
            hitSlop={commonStyles.hitSlop}
            style={styles.dropdownWrapper}>
            <Image style={commonStyles.icon15} source={images.icDropDownBlur} />
          </TouchableOpacity>
          <PrimaryText style={styles.txtOtherCategories}>
            {getCurrentRoute() === screenName.search
              ? strings.ctCategories
              : strings.ctOtherCategories}
          </PrimaryText>
          {getCurrentRoute() === screenName.storeDetails && (
            <PrimaryText style={styles.txtFrom}>
              {strings.ctFrom} {store_details?.store_name}
            </PrimaryText>
          )}
          <ScrollView showsVerticalScrollIndicator={false}>
            {newCategoryList()?.map((item: any, index: number) => (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  onChange && onChange(item?.id);
                  onClose();
                }}
                style={{
                  ...styles.catItemWrapper,
                  borderTopWidth: index > 0 ? 1 : 0,
                }}
                key={`${index}_item_category_data`}>
                <PrimaryText>{item?.category_name}</PrimaryText>
                {payload === item?.id && (
                  <Image style={commonStyles.icon20} source={images.icTick} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {type === 'cart_total' && (
        <View style={cartStyles.totalWrapper}>
          <TouchableOpacity
            onPress={onClose}
            hitSlop={commonStyles.hitSlop}
            style={styles.dropdownWrapper}>
            <Image style={commonStyles.icon15} source={images.icDropDownBlur} />
          </TouchableOpacity>
          <PrimaryText style={cartStyles.txtPriceDetails}>
            {strings.ctPriceDetails}
          </PrimaryText>
          {totalDetails?.map((item, index) =>
            (item?.type === 'discount' && item?.value === 0) ||
            (item?.type === 'convenience' && item?.value === 0) ||
            (item?.type === 'gift' &&
              myCart?.totalPrice?.is_gift === 'no') ? null : (
              <View
                style={{
                  ...cartStyles.totalItem,
                  marginTop: item?.type === 'total' ? '4%' : '2%',
                }}
                key={`${index}_total_items`}>
                <View
                  style={cartStyles.leftTotalView}
                  testID={`${index}_total_items`}>
                  <PrimaryText
                    style={
                      item?.type === 'total'
                        ? {
                            ...fonts.medium16,
                            color: colors.primary,
                          }
                        : fonts.regular14
                    }>
                    {item?.label}
                  </PrimaryText>
                  {(item?.type === 'convenience' ||
                    item?.type === 'delivery') && (
                    <InfoIcon
                      msg={
                        item?.type === 'delivery'
                          ? strings.msgDeliveryInfo(getDeliveryFee())
                          : item?.type === 'convenience'
                          ? strings.msgConvenienceInfo(getConvenienceFee())
                          : ''
                      }
                    />
                  )}
                </View>
                <View
                  style={cartStyles.rightTotalView}
                  testID={'CartRightTotalView'}>
                  <PrimaryText
                    testID={'CartTotalPrice'}
                    style={
                      item?.type === 'total'
                        ? {
                            ...fonts.medium16,
                            color: colors.primary,
                          }
                        : {
                            ...fonts.regular14,
                            textDecorationLine:
                              myCart?.totalPrice?.type === 'free-delivery' &&
                              item?.type === 'delivery'
                                ? 'line-through'
                                : 'none',
                            color:
                              myCart?.totalPrice?.type === 'free-delivery' &&
                              item?.type === 'delivery'
                                ? colors.red
                                : colors.blackText,
                          }
                    }>
                    {item?.type === 'discount' && '-'} {strings.currency}{' '}
                    {item?.type === 'total' && item?.value < 0
                      ? '...'
                      : item?.value?.toFixed(2)}
                  </PrimaryText>
                  {myCart?.totalPrice?.type === 'free-delivery' &&
                    item?.type === 'delivery' && (
                      <PrimaryText
                        style={{
                          ...fonts.regular14,
                          textDecorationLine: 'none',
                        }}
                        testID={
                          'CartPriceCurrency'
                        }>{` ${strings.currency} 0.00`}</PrimaryText>
                    )}
                </View>
              </View>
            ),
          )}

          <PrimaryButton
            disabled={
              (!isDeliveryAvailable && selectedAddress?.id !== undefined) ||
              checkProductUnavailable()
            }
            style={cartStyles.btnPlaceOrder}
            title={strings.btPlaceOrder}
            onPress={() => onPlaceOrder && onPlaceOrder()}
            addMargin={'6%'}
          />
        </View>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalView: {
    margin: 0,
  },
  mainView: {
    width: '100%',
    height: '60%',
    paddingHorizontal: '4%',
    paddingVertical: '4%',
    borderRadius: 10,
    backgroundColor: colors.white,
  },
  dropdownWrapper: {
    alignSelf: 'center',
  },
  afterAddWrapper: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    width: '70%',
    justifyContent: 'space-between',
    paddingVertical: '7%',
  },
  afterAddIconItem: {
    alignItems: 'center',
    width: '48%',
  },
  afterAddIconWrapper: {
    height: 76,
    width: 76,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
  },
  afterAddIcon: {
    height: 38,
    width: 38,
    resizeMode: 'contain',
  },
  afterAddText: {
    ...fonts.regular18,
    color: colors.primary,
    marginTop: '7%',
  },
  returnView: {
    width: '90%',
    backgroundColor: colors.white,
    alignSelf: 'center',
    borderRadius: 18,
    alignItems: 'center',
    paddingVertical: '5%',
  },
  txtMail: {
    ...fonts.regular15,
    width: '70%',
    textAlign: 'center',
  },
  btnSend: {
    width: '40%',
    marginTop: '4%',
  },
  txtOtherCategories: {
    ...fonts.medium16,
    color: colors.primary,
  },
  txtFrom: {
    ...fonts.regular12,
    color: colors.fromText,
    marginTop: '.5%',
  },
  catItemWrapper: {
    ...commonStyles.horizontalBetweenStyles,
    paddingVertical: '5%',
    borderTopColor: colors.borderColor2,
    paddingHorizontal: '3%',
  },
});
