import {consoleHere, constants, errorToast, successToast} from '../core';
import {dispatch, getStore} from '../redux';
import {setMyCart} from '../redux/modules/cartSlice';
import {setIsLoading, setLoader} from '../redux/modules/genericSlice';
import {
  _addWishListItem,
  _removeWishListItem,
} from '../redux/modules/homeSlice';
import {removeWishListItem, setWishList} from '../redux/modules/wishlistSlice';
import {LoadingParams} from '../types/paramsTypes';
import {get, post} from './request';

export const getWishListAPI = async (
  payload: any,
  loadingType?: LoadingParams,
) => {
  const list = getStore().wishlist.wishListData.data;
  const showLoader = !loadingType && (!list || list?.length === 0);
  showLoader && dispatch(setLoader({isLoading: true, loadingType}));
  get(constants.endPtWishList, payload)
    .then(async res => {
      if (res?.status === constants.apiSuccess) {
        if (loadingType === 'loading_more') {
          let data = [...list, ...res.data?.data];
          dispatch(
            setWishList({
              ...res.data,
              data,
            }),
          );
        } else {
          dispatch(setWishList(res?.data));
        }
      } else {
        errorToast(res?.message);
      }
      dispatch(setLoader({isLoading: false, loadingType}));
    })
    .catch(e => {
      consoleHere({e});
      dispatch(setLoader({isLoading: false, loadingType}));
    });
};

export const addRemoveAPI = async (payload: any, from?: 'cart') => {
  dispatch(setIsLoading(true));
  post(constants.endPtAddRemoveWishList, payload)
    .then(async res => {
      dispatch(setIsLoading(false));
      if (res?.status === constants.apiSuccess) {
        successToast(res?.message);
        if (from === 'cart') {
          const myCart = getStore().cart?.myCart;
          const newArray = myCart?.items?.map(item => ({
            ...item,
            product: {
              ...item?.product,
              is_favourite:
                item?.product_id === payload?.product_id
                  ? payload.action === 'remove'
                    ? 0
                    : 1
                  : item?.product?.is_favourite,
            },
          }));
          dispatch(
            setMyCart({
              ...myCart,
              items: newArray,
            }),
          );
        } else {
          if (payload.action === 'remove') {
            dispatch(removeWishListItem(payload));
            dispatch(_removeWishListItem(payload));
          } else {
            dispatch(_addWishListItem(payload));
          }
        }
      } else {
        errorToast(res?.message);
      }
    })
    .catch(e => {
      consoleHere({e});
      dispatch(setIsLoading(false));
    });
};
