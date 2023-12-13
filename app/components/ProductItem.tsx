/* eslint-disable react-native/no-inline-styles */
import {FC} from 'react';
import {View, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {colors, commonStyles, fonts} from '../styles';
import {errorToast, images, screenName, successToast, toNumber} from '../core';
import {PrimaryText} from './PrimaryText';
import {strings} from '../i18n';
import {useNavigation, useRoute} from '@react-navigation/native';
import {ProductItemProps} from '../types/components';
import {MyImage} from './MyImage';
import {addRemoveAPI, addToCartAPI} from '../services';
import {useSelector} from 'react-redux';
import {RootState} from '../redux';
import {getCurrentRoute} from '../navigation/RootNavigation';
import {CartItemParams} from '../types/paramsTypes';

export const ProductItem: FC<ProductItemProps> = ({
  item,
  style,
  type,
  handleItemPressInProductScreen,
  testID,
}) => {
  const navigation: any = useNavigation();

  const route = useRoute();
  let thisProduct = item?.product ?? item;

  const userType = useSelector((state: RootState) => state.profile.userType);
  const myCart = useSelector((state: RootState) => state.cart.myCart);
  const isLoading = useSelector(
    (state: RootState) => state.generic.loader?.isLoading,
  );

  const handleItemPress = (itm: any) => {
    if (isLoading === true) {
      return;
    }
    addRemoveAPI({
      product_id: itm?.product?.id ?? itm?.id,
      action: itm?.is_favourite || type === 'wishlist' ? 'remove' : 'add',
    });
  };
  const getPrice = () => {
    let price = null;
    let realPrice = null;
    price =
      thisProduct?.product_variation_combinations?.length > 0
        ? thisProduct?.discount > 0
          ? thisProduct?.product_variation_combinations?.[0]?.discounted_price
          : toNumber(
              thisProduct?.product_variation_combinations?.[0]?.price,
            )?.toFixed(2)
        : thisProduct?.discount > 0
        ? thisProduct?.discounted_price
        : toNumber(thisProduct?.price)?.toFixed(2);

    realPrice =
      thisProduct?.product_variation_combinations?.length > 0
        ? toNumber(
            thisProduct?.product_variation_combinations?.[0]?.price,
          )?.toFixed(2)
        : toNumber(thisProduct?.price)?.toFixed(2);
    return thisProduct?.discount > 0 ? {price, realPrice} : {price};
  };

  const handleAddToCart = async () => {
    if (isItemNotAdded()) {
      let payload: CartItemParams = {
        product_id: item?.id,
        quantity: 1,
      };
      const seller_store_address_id = item?.seller_store_address_id;
      const res = await addToCartAPI(
        payload,
        seller_store_address_id,
        'hide',
        thisProduct?.product_name,
      );
      if (res) {
        successToast(strings.msgAddedToCart);
      }
    } else {
      errorToast(strings.msgAlreadyAddedToCart, strings.msgSorry);
    }
  };

  const isItemNotAdded = () => {
    const result = myCart?.items?.find(
      cartItem => cartItem?.product_id === item?.id,
    );
    if (result) {
      return false;
    } else {
      return true;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      testID={`${testID}ProductItemBtn`}
      onPress={() =>
        getCurrentRoute() === screenName?.productDetails
          ? handleItemPressInProductScreen
            ? handleItemPressInProductScreen(thisProduct?.id)
            : null
          : navigation.navigate(screenName.productDetails, {
              product_id: thisProduct?.id,
              screen_from: getCurrentRoute(),
            })
      }
      style={{
        ...styles.itemGridWrapper,
        ...style,
      }}>
      <View style={styles.buttonWrapper}>
        {type === 'storelist' &&
          thisProduct?.product_variation_combinations?.length === 0 && (
            <TouchableOpacity
              activeOpacity={0.8}
              testID={`${testID}ProductItemCartBtn`}
              style={{
                ...styles.floatingButton,
                marginRight: 5,
              }}
              onPress={handleAddToCart}>
              <Image style={styles.buttonIcon1} source={images.icCartPrimary} />
            </TouchableOpacity>
          )}

        {type === 'wishlist' || type === 'storelist' ? (
          <TouchableOpacity
            activeOpacity={0.8}
            testID={`${testID}ProductItemWishListBtn`}
            style={{
              ...commonStyles.shadowTwoStyles,
              ...styles.floatingButton,
              backgroundColor: colors.white,
            }}
            onPress={() => handleItemPress(item)}>
            <Image
              style={styles.heartButton}
              source={
                thisProduct?.is_favourite === 1 || type === 'wishlist'
                  ? images.icHeart
                  : images.icHeartLine
              }
            />
          </TouchableOpacity>
        ) : undefined}
      </View>
      <MyImage
        testID={`${testID}ProductItemImage`}
        style={styles.productImage}
        source={thisProduct?.thumbnail_url}
      />
      <View style={styles.productBottomView}>
        <PrimaryText
          testID={`${testID}ProductItemName`}
          props={{numberOfLines: 3}}
          style={styles.productName}>
          {thisProduct?.product_name}
        </PrimaryText>
        {type === 'wishlist' && (
          <PrimaryText
            testID={`${testID}ProductItemBrandName`}
            style={styles.storeName}>
            {thisProduct?.seller_store?.brand_name}
          </PrimaryText>
        )}
        {thisProduct?.discount > 0 ? (
          <View style={{flexDirection: 'row'}}>
            <PrimaryText
              testID={`${testID}ProductItemPrice`}
              style={styles.productPrice}>
              {`${strings.currency}${getPrice()?.price.replace(
                /\B(?=(\d{3})+(?!\d))/g,
                ',',
              )} `}
            </PrimaryText>
            <PrimaryText
              testID={`${testID}ProductItemPrice`}
              style={styles.productRealPrice}>
              {`${strings.currency}${getPrice()?.realPrice?.replace(
                /\B(?=(\d{3})+(?!\d))/g,
                ',',
              )}`}
            </PrimaryText>
          </View>
        ) : (
          <PrimaryText
            testID={`${testID}ProductItemPrice`}
            style={styles.productPrice}>
            {`${strings.currency}${getPrice().price.replace(
              /\B(?=(\d{3})+(?!\d))/g,
              ',',
            )}`}
          </PrimaryText>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  productName: {
    ...fonts.medium16,
  },
  storeName: {
    ...fonts.medium14,
  },
  productPrice: {
    ...fonts.regular12,
    marginTop: '2%',
  },
  productRealPrice: {
    ...fonts.regular12,
    marginTop: '2%',
    textDecorationLine: 'line-through',
    color: colors.lightGreyText,
  },
  itemGridWrapper: {
    marginTop: '3%',
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    width: '48%',
  },
  productImage: {
    height: 150,
    width: '100%',
    resizeMode: 'contain',
  },
  productBottomView: {
    borderTopWidth: 1,
    borderColor: colors.background,
    paddingVertical: '5%',
    paddingHorizontal: '5%',
  },
  buttonWrapper: {
    position: 'absolute',
    right: '4%',
    top: '3%',
    zIndex: 5,
    flexDirection: 'row',
  },
  floatingButton: {
    height: 28,
    width: 28,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonIcon: {
    ...commonStyles.icon18,
    tintColor: colors.white,
  },
  buttonIcon1: {
    ...commonStyles.icon28,
  },
  heartButton: {
    height: 15,
    width: 18,
    resizeMode: 'contain',
  },
});
