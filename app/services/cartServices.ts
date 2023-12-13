import {
  clearCartAlert,
  consoleHere,
  constants,
  errorToast,
  screenName,
  successToast,
} from '../core';
import {strings} from '../i18n';
import {getCurrentRoute, resetNavigation} from '../navigation/RootNavigation';
import {dispatch, getStore} from '../redux';
import {
  setIsDeliveryAvailable,
  setMyCart,
  setPayMode,
} from '../redux/modules/cartSlice';
import {setIsLoading} from '../redux/modules/genericSlice';
import {
  setCouponCodeList,
  setDeliveryTimeSlotData,
} from '../redux/modules/homeSlice';
import {CartItemParams} from '../types/paramsTypes';
import {analyticsLogEvent} from './analyticsServices';
import {get, post} from './request';

export const addToCartAPI = async (
  payload: CartItemParams,
  seller_store_address_id: any,
  successMsg?: 'show' | 'hide',
  product_name?: string,
) => {
  dispatch(setIsLoading(true));
  const myDeviceUUID = getStore().generic.myDeviceUUID;
  const selectedAddress = getStore().address?.selectedAddress;
  let newPayload: CartItemParams | null = null;
  const myCart = getStore().cart.myCart;
  // Check store id
  if (
    myCart?.items?.length > 0 &&
    seller_store_address_id !== myCart?.seller_store_address_id
  ) {
    clearCartAlert(payload, seller_store_address_id, product_name);
    dispatch(setIsLoading(false));
    return false;
  }

  // Check if there is any item in cart or not
  // If there is an item then match the current item
  // And add the quantity in that item
  if (myCart?.items?.length > 0) {
    // Check combination variation product
    const foundComboProduct = myCart?.items?.find(
      item =>
        payload?.product_variation_combination_id &&
        item?.product_id === payload?.product_id &&
        item?.product_variation_combination_id ===
          payload?.product_variation_combination_id,
    );
    // Check Simple product
    const foundProduct = myCart?.items.find(
      item =>
        item?.product_id === payload?.product_id &&
        !payload?.product_variation_combination_id,
    );

    if (foundComboProduct) {
      newPayload = {
        product_id: foundComboProduct?.product_id,
        quantity: foundComboProduct?.quantity + 1,
        product_variation_combination_id:
          foundComboProduct?.product_variation_combination_id,
      };
    } else if (foundProduct) {
      newPayload = {
        product_id: foundProduct?.product_id,
        quantity: foundProduct?.quantity + 1,
      };
    } else {
      newPayload = payload;
    }
  } else {
    newPayload = payload;
  }
  consoleHere({
    newPayload: {
      ...newPayload,
      uuid: myDeviceUUID,
      latitude: selectedAddress?.latitude,
      longitude: selectedAddress?.longitude,
    },
  });
  return post(constants.endPtAddToCart, {
    ...newPayload,
    uuid: myDeviceUUID,
    latitude: selectedAddress?.latitude,
    longitude: selectedAddress?.longitude,
  })
    .then(async res => {
      if (res?.status === constants.apiSuccess) {
        if (myCart?.items?.length === 0) {
          analyticsLogEvent(constants.analyticsEvents.cartBuild);
        }
        successMsg === 'show' && successToast(strings.msgAddedToCart);
        dispatch(setMyCart(res?.data?.CartData));
        dispatch(setIsLoading(false));
        analyticsLogEvent(constants.analyticsEvents.addToCart, {
          product_name,
        });
        return true;
      } else {
        errorToast(res?.message);
        dispatch(setIsLoading(false));
        return false;
      }
    })
    .catch(e => {
      consoleHere({e});
      dispatch(setIsLoading(false));
      return false;
    });
};

export const getCartAPI = async () => {
  const myDeviceUUID = getStore().generic.myDeviceUUID;
  const selectedAddress = getStore().address?.selectedAddress;
  const payMode = getStore().cart?.payMode;
  const myCart = getStore().cart?.myCart;
  post(constants.endPtGetCart, {
    uuid: myDeviceUUID,
    latitude: selectedAddress?.latitude,
    longitude: selectedAddress?.longitude,
  })
    .then(async res => {
      if (res?.status === constants.apiSuccess) {
        (!payMode ||
          res?.data?.cart_items?.prevPaymentMode?.enum !==
            myCart?.prevPaymentMode?.enum) &&
          dispatch(setPayMode(res?.data?.cart_items?.prevPaymentMode));
        dispatch(
          setMyCart(
            res?.data?.cart_items ?? {
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
            },
          ),
        );
        dispatch(setIsDeliveryAvailable(res?.data?.is_delivery_available));
      } else {
      }
    })
    .catch(e => {
      consoleHere({e});
    });
};

export const updateCartItemAPI = async (
  payload: {
    cart_item_id: number;
    quantity?: number;
    product_variation_combination_id?: number | null;
  },
  type: 'increase' | 'decrease' | 'update' | 'product_qty',
  preQuantity?: any,
) => {
  (type === 'update' || type === 'product_qty') && dispatch(setIsLoading(true));
  const myCart = getStore().cart?.myCart;
  const myDeviceUUID = getStore().generic.myDeviceUUID;
  const selectedAddress = getStore().address?.selectedAddress;
  const payMode = getStore().cart?.payMode;
  return post(constants.endPtUpdateCartItem, {
    ...payload,
    uuid: myDeviceUUID,
    latitude: selectedAddress?.latitude,
    longitude: selectedAddress?.longitude,
  })
    .then(async res => {
      if (res?.status === constants.apiSuccess) {
        if (
          !payMode ||
          res?.data?.CartData?.prevPaymentMode?.enum !==
            myCart?.prevPaymentMode?.enum
        ) {
          dispatch(setPayMode(res?.data?.CartData?.prevPaymentMode));
        }
        if (type === 'update') {
          successToast(res?.message);
          dispatch(setMyCart(res?.data?.CartData));
        }
        if (type !== 'update' && type !== 'product_qty') {
          const myNewCart = getStore().cart?.myCart;
          dispatch(
            setMyCart({
              ...myNewCart,
              totalPrice: res?.data?.CartData?.totalPrice,
              prevPaymentMode: res?.data?.CartData?.prevPaymentMode,
            }),
          );
        }
        if (type === 'product_qty') {
          successToast(strings.msgAddedToCart);
          dispatch(setMyCart(res?.data?.CartData));
        }
        (type === 'update' || type === 'product_qty') &&
          dispatch(setIsLoading(false));
        return true;
      } else {
        errorToast(res?.message);
        if (type !== 'update' && type !== 'product_qty') {
          const newArray = myCart?.items?.map(item => ({
            ...item,
            quantity:
              item?.id === payload?.cart_item_id ? preQuantity : item?.quantity,
          }));
          dispatch(
            setMyCart({
              ...myCart,
              items: newArray,
            }),
          );
        }
        (type === 'update' || type === 'product_qty') &&
          dispatch(setIsLoading(false));
        return false;
      }
    })
    .catch(e => {
      consoleHere({e});
      if (type !== 'update' && type !== 'product_qty') {
        const newArray = myCart?.items?.map(item => ({
          ...item,
          quantity:
            item?.id === payload?.cart_item_id ? preQuantity : item?.quantity,
        }));
        dispatch(
          setMyCart({
            ...myCart,
            items: newArray,
          }),
        );
      }
      (type === 'update' || type === 'product_qty') &&
        dispatch(setIsLoading(false));
      return false;
    });
};

export const deleteCartItemAPI = async (payload: {cart_item_id: number}) => {
  const myCart = getStore().cart?.myCart;
  const myDeviceUUID = getStore().generic?.myDeviceUUID;
  const selectedAddress = getStore().address?.selectedAddress;
  const payMode = getStore().cart?.payMode;
  return post(constants.endPtDeleteCartItem, {
    ...payload,
    uuid: myDeviceUUID,
    latitude: selectedAddress?.latitude,
    longitude: selectedAddress?.longitude,
  })
    .then(async res => {
      if (res?.status === constants.apiSuccess) {
        successToast(strings.msgCartItemRemoved);
        (!payMode ||
          res?.data?.CartData?.prevPaymentMode?.enum !==
            myCart?.prevPaymentMode?.enum) &&
          dispatch(setPayMode(res?.data?.CartData?.prevPaymentMode));
        const newArray = myCart?.items?.filter(
          item => item?.id !== payload?.cart_item_id,
        );
        dispatch(
          setMyCart({
            ...res?.data?.CartData,
            items: newArray,
            prevPaymentMode: res?.data?.CartData?.prevPaymentMode,
          }),
        );
        return true;
      } else {
        errorToast(res?.message);
        return false;
      }
    })
    .catch(e => {
      consoleHere({e});
      return false;
    });
};

export const couponCodeListAPI = async (payload: any) => {
  const myDeviceUUID = getStore().generic.myDeviceUUID;
  dispatch(setCouponCodeList(null));
  dispatch(setIsLoading(true));
  return post(constants.endPtCouponCodeList, {
    uuid: myDeviceUUID,
    ...payload,
  })
    .then(async res => {
      if (res?.status === constants.apiSuccess) {
        dispatch(setCouponCodeList(res?.data));
      } else {
        errorToast(res?.message);
      }
      dispatch(setIsLoading(false));
    })
    .catch(e => {
      consoleHere({e});
      dispatch(setIsLoading(false));
    });
};

export const applyCouponCodeAPI = async (payload: any, navigation?: any) => {
  dispatch(setIsLoading(true));
  const selectedAddress = getStore().address?.selectedAddress;
  return post(constants.endPtApplyCouponCode, {
    ...payload,
    latitude: selectedAddress?.latitude,
    longitude: selectedAddress?.longitude,
  })
    .then(async res => {
      if (res?.status === constants.apiSuccess) {
        successToast(res?.message);
        dispatch(setMyCart(res?.data?.cartData));
        getCurrentRoute() === screenName.coupons ? navigation?.goBack() : null;
      } else {
        errorToast(res?.message);
      }
      dispatch(setIsLoading(false));
    })
    .catch(e => {
      consoleHere({e});
      dispatch(setIsLoading(false));
    });
};

export const removeCouponCodeAPI = async () => {
  dispatch(setIsLoading(true));
  const selectedAddress = getStore().address?.selectedAddress;
  return post(constants.endPtRemoveCouponCode, {
    latitude: selectedAddress?.latitude,
    longitude: selectedAddress?.longitude,
  })
    .then(async res => {
      if (res?.status === constants.apiSuccess) {
        successToast(res?.message);
        dispatch(setMyCart(res?.data?.cartData));
      } else {
        errorToast(res?.message);
      }
      dispatch(setIsLoading(false));
    })
    .catch(e => {
      consoleHere({e});
      dispatch(setIsLoading(false));
    });
};

export const giftWrapAPI = async (payload: {is_gift: 'yes' | 'no'}) => {
  dispatch(setIsLoading(true));
  const myDeviceUUID = getStore().generic.myDeviceUUID;
  const selectedAddress = getStore().address?.selectedAddress;

  return post(constants.endPtAddRemoveGift, {
    ...payload,
    uuid: myDeviceUUID,
    latitude: selectedAddress?.latitude,
    longitude: selectedAddress?.longitude,
  })
    .then(async res => {
      if (res?.status === constants.apiSuccess) {
        dispatch(setMyCart(res?.data));
        dispatch(setIsLoading(false));
        return true;
      } else {
        errorToast(res?.message);
        dispatch(setIsLoading(false));
        return false;
      }
    })
    .catch(e => {
      consoleHere({e});
      dispatch(setIsLoading(false));
      return false;
    });
};

export const clearCartItemAPI = async () => {
  dispatch(setIsLoading(true));
  const myDeviceUUID = getStore().generic?.myDeviceUUID;
  return post(constants.endPtClearCart, {
    uuid: myDeviceUUID,
  })
    .then(async res => {
      if (res?.status === constants.apiSuccess) {
        successToast(strings.msgCartCleared);
        resetNavigation(screenName.app);
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
              type: null,
              calculate_delivery_fee: 0,
              is_gift: 'no',
              gift_wrapping_fee: 0,
            },
            seller_store_address_id: null,
            seller_store_name: '',
            category_id: null,
            seller_store_address_name: '',
          }),
        );
        dispatch(setIsLoading(false));
        return true;
      } else {
        errorToast(res?.message);
        dispatch(setIsLoading(false));
        return false;
      }
    })
    .catch(e => {
      consoleHere({e});
      dispatch(setIsLoading(false));
      return false;
    });
};

export const deliveryTimeSlotAPI = async (payload: any) => {
  dispatch(setDeliveryTimeSlotData(null));
  dispatch(setIsLoading(true));
  return get(constants.endPtDeliveryTimeSlot, payload)
    .then(async res => {
      dispatch(setIsLoading(false));
      if (res?.status === constants.apiSuccess) {
        dispatch(setDeliveryTimeSlotData(res?.data));
        return res?.data;
      } else {
        errorToast(res?.message);
        return false;
      }
    })
    .catch(e => {
      consoleHere({e});
      dispatch(setIsLoading(false));
      return false;
    });
};
