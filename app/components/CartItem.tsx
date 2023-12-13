/* eslint-disable react-native/no-inline-styles */
import {FC, useState} from 'react';
import {StyleSheet, TouchableOpacity, View, Image} from 'react-native';
import {MyImage} from './MyImage';
import {PrimaryText} from './PrimaryText';
import {colors, commonStyles, fonts} from '../styles';
import {images, loginAlert, screenName, toNumber} from '../core';
import {strings} from '../i18n';
import {CartItemProps} from '../types/components';
import {addRemoveAPI, deleteCartItemAPI, updateCartItemAPI} from '../services';
import {useNavigation, useRoute} from '@react-navigation/native';
import {getCurrentRoute} from '../navigation/RootNavigation';
import {RootState, dispatch} from '../redux';
import {useSelector} from 'react-redux';
import {useDebouncedCallback} from 'use-debounce';
import {setMyCart} from '../redux/modules/cartSlice';

export const CartItem: FC<CartItemProps> = ({data}) => {
  const navigation: any = useNavigation();
  const route = useRoute();
  const price = toNumber(data?.discounted_price ?? data?.price);
  const [IsDelete, setIsDelete] = useState(false);
  const isActive =
    data?.product?.status === 'InActive'
      ? false
      : data?.product_variation_combination?.status === 'InActive'
      ? false
      : true;

  const userType = useSelector((state: RootState) => state.profile.userType);
  const myCart = useSelector((state: RootState) => state.cart.myCart);

  const debounced = useDebouncedCallback(
    // function
    (
      payload: {
        cart_item_id: number;
        quantity: number;
      },
      type: 'increase' | 'decrease',
      preQuantity?: any,
    ) => {
      const quantity = myCart?.items?.find(
        item => item?.id === payload?.cart_item_id,
      )?.quantity;
      updateCartItemAPI(
        {
          cart_item_id: payload?.cart_item_id,
          quantity,
        },
        type,
        preQuantity,
      );
    },
    // delay in ms
    500,
  );

  const updateCart = (
    payload: {
      cart_item_id: number;
      quantity: number;
    },
    type: 'increase' | 'decrease',
  ) => {
    const newSetArray = myCart?.items?.map(item => ({
      ...item,
      quantity:
        item?.id === payload?.cart_item_id ? payload?.quantity : item?.quantity,
    }));
    const preQuantity = myCart?.items?.find(
      item => item?.id === payload?.cart_item_id,
    )?.quantity;
    dispatch(
      setMyCart({
        ...myCart,
        items: newSetArray,
      }),
    );
    debounced(payload, type, preQuantity);
  };

  const handleIncreaseQty = () => {
    const payload = {
      cart_item_id: data?.id,
      quantity: data?.quantity + 1,
    };
    updateCart(payload, 'increase');
  };

  const handleDecreaseQty = async () => {
    if (data?.quantity === 1 || !isActive) {
      if (IsDelete === false) {
        setIsDelete(true);
        const payload = {
          cart_item_id: data?.id,
        };
        debounced?.cancel();
        const res = await deleteCartItemAPI(payload);
        if (res || !res) {
          setIsDelete(false);
        }
      }
    } else {
      const payload = {
        cart_item_id: data?.id,
        quantity: data?.quantity - 1,
      };
      updateCart(payload, 'decrease');
      if (data?.quantity - 1 === 1) {
        setIsDelete(false);
      }
    }
  };

  const handleEditPress = () => {
    navigation?.navigate(screenName?.productDetails, {
      product_id: data?.product_id,
      type: 'edit_cart',
      data: data,
      combination_id: data?.product_variation_combination_id,
      screenName: getCurrentRoute(),
    });
  };

  const handleWishIconPress = () => {
    userType === 'guest'
      ? loginAlert(route.name, route?.params)
      : addRemoveAPI(
          {
            product_id: data?.product?.id,
            action: data?.product?.is_favourite ? 'remove' : 'add',
          },
          'cart',
        );
  };

  return (
    <View style={styles.mainView} testID={'CartItemMainView'}>
      <MyImage
        style={styles.imgProduct}
        source={data?.product?.thumbnail_url}
        testID={'CartItemThumbnailImage'}
      />
      <View style={styles.middleView} testID={'CartItemMiddleViews'}>
        <PrimaryText
          props={{numberOfLines: 1}}
          style={styles.txtProductName}
          testID={'CartItemProductName'}>
          {data?.product?.product_name}
        </PrimaryText>
        <PrimaryText style={styles.txtPrice} testID={'CartItemProductPrice'}>
          {strings.currency} {(price * data?.quantity)?.toFixed(2)}
        </PrimaryText>
        {!isActive && (
          <PrimaryText
            style={styles.txtNotAvailable}
            testID={'CartItemNotAvailable'}>
            {strings.ctProductNotAvailable}
          </PrimaryText>
        )}
        {data?.product_variation_combination_id && isActive && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleEditPress}
            style={styles.editWrapper}
            testID={'CartItemEdit'}>
            <Image
              style={commonStyles.icon10}
              source={images.icPencil}
              testID={'CartItemImagePencil'}
            />
            <PrimaryText style={styles.txtEdit} testID={'CartItemTxtEdit'}>
              {strings.ctEditThisItem}
            </PrimaryText>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.rightView} testID={'CartItemRightView'}>
        <TouchableOpacity
          disabled
          onPress={handleWishIconPress}
          style={{
            ...styles.btnWish,
            ...commonStyles.shadowTwoStyles,
            backgroundColor: colors.white,
            opacity: 0,
          }}
          activeOpacity={0.8}
          testID={'CartItemWishIcon'}>
          <Image
            style={{
              ...styles.imgWish,
            }}
            source={
              data?.product?.is_favourite ? images.icHeart : images.icHeartLine
            }
          />
        </TouchableOpacity>
        <View style={styles.counterWrapper} testID={'CartItemCounterWrapper'}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleDecreaseQty}
            style={{
              ...styles.btnCounter,
              borderTopRightRadius: 13,
              borderBottomRightRadius: 13,
            }}
            testID={'CartItemDecreaseQty'}>
            <Image
              style={
                data?.quantity > 1 && isActive
                  ? styles.imgCounter
                  : styles.imgTrash
              }
              source={
                data?.quantity > 1 && isActive
                  ? images.icRemoveQty
                  : images.icCartTrash
              }
            />
          </TouchableOpacity>
          <View style={styles.midView} testID={'CartItemMidView'}>
            <PrimaryText testID={'CartItemQuantity'}>
              {data?.quantity}
            </PrimaryText>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            disabled={!isActive}
            onPress={handleIncreaseQty}
            style={{
              ...styles.btnCounter,
              borderTopLeftRadius: 13,
              borderBottomLeftRadius: 13,
            }}
            testID={'CartItemIncreaseQty'}>
            <Image
              style={styles.imgCounter}
              source={images.icAddQty}
              testID={'CartItemImageAddQty'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    width: '100%',
    borderRadius: 12,
    backgroundColor: colors.white,
    flexDirection: 'row',
    marginTop: '2%',
    paddingHorizontal: '2%',
    paddingVertical: '2%',
  },
  imgProduct: {
    height: 73,
    width: 73,
    resizeMode: 'contain',
    borderRadius: 9,
  },
  middleView: {
    width: '45%',
    paddingLeft: '2%',
    paddingVertical: '1%',
  },
  txtProductName: {
    ...fonts.medium16,
    color: colors.primary,
  },
  txtPrice: {
    marginTop: '3%',
  },
  editWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '3%',
  },
  txtEdit: {
    ...fonts.regular12,
    marginLeft: '4%',
  },
  rightView: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: '1%',
    justifyContent: 'space-between',
    paddingVertical: 1,
  },
  btnWish: {
    height: 28,
    width: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgWish: {
    height: 15,
    width: 18,
    resizeMode: 'contain',
  },
  counterWrapper: {
    flexDirection: 'row',
    height: 28,
    borderWidth: 1,
    borderColor: colors.blackText,
    borderRadius: 14,
    marginTop: '6%',
    overflow: 'hidden',
  },
  btnCounter: {
    height: 26,
    width: 26,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.blackText,
  },
  imgCounter: {
    ...commonStyles.icon12,
  },
  imgTrash: {
    ...commonStyles.icon17,
  },
  midView: {
    minWidth: 20,
    alignSelf: 'center',
    alignItems: 'center',
    paddingTop: 3,
  },
  txtNotAvailable: {
    ...fonts.regular12,
    color: colors.red,
    marginTop: 5,
  },
});
