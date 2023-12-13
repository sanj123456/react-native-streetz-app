import { Alert } from 'react-native';
import { ratingToast } from '../components/RatingModal';
import {
  consoleHere,
  constants,
  errorToast,
  forcedlyClearCartAlert,
  screenName,
  successToast,
} from '../core';
import { strings } from '../i18n';
import { navigate } from '../navigation/RootNavigation';
import { dispatch, getStore } from '../redux';
import { setIsLoading, setLoader } from '../redux/modules/genericSlice';
import {
  setOrderDetails,
  setOrderHistory,
  setPaymentModes,
  setUpcomingOrders,
} from '../redux/modules/orderSlice';
import { LoadingParams } from '../types/paramsTypes';
import { get, post } from './request';
import { analyticsLogEvent } from './analyticsServices';

export const placeOrderAPI = async (payload: {
  user_address_id: number;
  delivery_time_slot_id?: number;
  date?: string;
}) => {
  dispatch(setIsLoading(true));
  return post(constants.endPtPlaceOrder, payload)
    .then(async res => {
      dispatch(setIsLoading(false));
      if (res?.status === constants.apiSuccess) {
        return res?.data?.orderData;
      } else {
        errorToast(res?.message);
        if (res?.data?.is_store_disabled) {
          forcedlyClearCartAlert();
        }
        return false;
      }
    })
    .catch(e => {
      consoleHere({ e });
      dispatch(setIsLoading(false));
      return false;
    });
};

export const checkPaymentStatusAPI = async (
  payload: { order_id: number },
  navigation?: any,
  orderData?: any,
) => {
  dispatch(setIsLoading(true));
  return post(constants.endPtCheckPaymentStatus, payload)
    .then(async res => {
      consoleHere({ res });
      if (res?.status === constants.apiSuccess) {
        if (res?.orderData?.payment_status === 'payment success') {
          successToast('Payment Successful');
          consoleHere({CHECk_result:res})
          navigate(screenName.timeToDelivery, {
            orderID: payload?.order_id,
            prevFlow: 'payment',
          });
          analyticsLogEvent(constants.analyticsEvents.paymentComplete);
          analyticsLogEvent(constants.analyticsEvents.conversionNumber, {
            order_number: orderData?.order_number,
          });
          analyticsLogEvent(constants.analyticsEvents.conversionValue, {
            order_number: orderData?.order_number,
            total_amount: orderData?.final_price,
          });
        } else if (res?.orderData?.payment_status === 'Payment Failed') {
          errorToast('Payment Failed');
          navigation?.goBack();
        }
      } else {
        errorToast(res?.message);
      }
      dispatch(setIsLoading(false));
    })
    .catch(e => {
      consoleHere({ e });
      dispatch(setIsLoading(false));
    });
};

export const checkDeliveryAvailAPI = async (payload: {
  type: number;
  date?: string;
  delivery_time_slot_id?: number;
}) => {
  payload?.type === 0 && dispatch(setIsLoading(true));
  return post(constants.endPtCheckDeliveryTime, payload)
    .then(async res => {
      dispatch(setIsLoading(false));
      if (res?.status === constants.apiSuccess) {
        return true;
      } else {
        errorToast(res?.message);
        if (res?.data?.is_store_disabled) {
          forcedlyClearCartAlert();
        }
        return false;
      }
    })
    .catch(e => {
      consoleHere({ e });
      dispatch(setIsLoading(false));
      return false;
    });
};

export const makePaymentAPI = (payload: {
  order_id: number;
  payment_method: string;
}) => {
  dispatch(setIsLoading(true));
  post(constants.endPtMakePayment, payload)
    .then(async res => {
      dispatch(setIsLoading(false));
      if (res?.status === constants.apiSuccess) {
        if (payload?.payment_method === 'COD') {
          successToast(strings.msgOrderPlacedSuccess);
          navigate(screenName.timeToDelivery, {
            orderID: payload?.order_id,
            prevFlow: 'payment',
          });
          analyticsLogEvent(constants.analyticsEvents.conversionNumber, {
            order_number: res?.data?.orderData?.order_number,
          });
          analyticsLogEvent(constants.analyticsEvents.conversionValue, {
            order_number: res?.data?.orderData?.order_number,
            total_amount: res?.data?.orderData?.final_price,
          });
        } else {
          navigate(screenName?.paymentView, res?.data);
        }
      } else {
        errorToast(res?.message);
      }
    })
    .catch(e => {
      consoleHere({ e });
      dispatch(setIsLoading(false));
    });
};

export const orderHistoryAPI = (
  params: { page: number; is_upcoming: number },
  loadingType?: LoadingParams,
) => {
  const orderHistory = getStore()?.order?.orderHistory;
  const upcomingOrders = getStore()?.order?.upcomingOrders;
  dispatch(setLoader({ isLoading: true, loadingType }));
  get(constants.endPtOrderHistory, params)
    .then(async res => {
      dispatch(setLoader({ isLoading: false, loadingType }));
      if (res?.status === constants.apiSuccess) {
        if (loadingType === 'loading_more') {
          if (params?.is_upcoming === 1) {
            const newArray = [...upcomingOrders?.data, ...res?.data?.data];
            dispatch(
              setUpcomingOrders({
                ...res?.data,
                data: newArray,
              }),
            );
          } else {
            const newArray = [...orderHistory?.data, ...res?.data?.data];
            dispatch(
              setOrderHistory({
                ...res?.data,
                data: newArray,
              }),
            );
          }
        } else {
          params?.is_upcoming === 1
            ? dispatch(setUpcomingOrders(res?.data))
            : dispatch(setOrderHistory(res?.data));
        }
      } else {
        errorToast(res?.message);
      }
    })
    .catch(e => {
      consoleHere({ e });
      dispatch(setLoader({ isLoading: false, loadingType }));
    });
};

export const orderDetailsAPI = (id: number, loadingType?: LoadingParams) => {
  loadingType !== 'refreshing' && dispatch(setOrderDetails(null));
  dispatch(setLoader({ isLoading: true, loadingType }));
  get(`${constants.endPtOrderDetails}${id}`)
    .then(async res => {
      dispatch(setLoader({ isLoading: false, loadingType }));
      if (res?.status === constants.apiSuccess) {
        dispatch(setOrderDetails(res?.data));
      } else {
        errorToast(res?.message);
      }
    })
    .catch(e => {
      consoleHere({ e });
      dispatch(setLoader({ isLoading: false, loadingType }));
    });
};

export const reviewRatingAPI = async (payload: any) => {
  dispatch(setLoader({ isLoading: true, loadingType: 'rating' }));
  const orderDetails = getStore()?.order?.orderDetails;
  const orderHistory = getStore()?.order?.orderHistory;
  return post(constants.endPtRating, payload)
    .then(async res => {
      dispatch(setLoader({ isLoading: false, loadingType: 'rating' }));
      if (res?.status === constants.apiSuccess) {
        successToast(res?.message);
        if (orderDetails && orderDetails?.id === payload?.order_id) {
          dispatch(
            setOrderDetails({
              ...orderDetails,
              is_feedback_provide: 1,
            }),
          );
        }
        if (orderHistory?.data?.length > 0) {
          const newArray = orderHistory?.data?.map(item => ({
            ...item,
            is_feedback_provide:
              item?.id === payload?.order_id ? 1 : item?.is_feedback_provide,
          }));
          dispatch(
            setOrderHistory({
              ...orderHistory,
              data: newArray,
            }),
          );
        }
        return true;
      } else {
        ratingToast(res?.message, 'error');
        return false;
      }
    })
    .catch(e => {
      dispatch(setLoader({ isLoading: false, loadingType: 'rating' }));
      consoleHere({ e });
      return false;
    });
};

export const cancelOrderAPI = async (payload: { order_id: number }) => {
  const orderHistory = getStore()?.order?.orderHistory;
  dispatch(setIsLoading(true));
  return post(constants.endPtCancelOrder, payload)
    .then(async res => {
      dispatch(setIsLoading(false));
      if (res?.status === constants.apiSuccess) {
        dispatch(setOrderDetails(res?.orderDetail));
        res?.orderDetail?.payment_status === 'Payment Pending'
          ? successToast(strings.msgOrderCanceled)
          : Alert.alert(strings.msgOrderCanceled, strings.msgRefundDays);
        /****************************************************************/
        /**** Start:Update cancel order status in order history list ****/
        /****************************************************************/
        const newArray = orderHistory?.data?.map(item => item?.id === payload?.order_id ? {
          ...item,
          status: res?.orderDetail?.status,
          updated_at: res?.orderDetail?.updated_at
        } : item)
        dispatch(setOrderHistory({
          ...orderHistory,
          data: newArray
        }))
        /****************************************************************/
        /***** End:Update cancel order status in order history list *****/
        /****************************************************************/
        return true;
      } else {
        errorToast(res?.message);
        return false;
      }
    })
    .catch(e => {
      dispatch(setIsLoading(false));
      consoleHere({ e });
      return false;
    });
};

export const orderInvoiceAPI = async (id: any) => {
  return get(constants.endPtOrderInvoice(id))
    .then(async res => {
      if (res?.status === constants.apiSuccess) {
        return res?.data;
      } else {
        errorToast(res?.message);
        return false;
      }
    })
    .catch(e => {
      consoleHere({ e });
      return false;
    });
};

export const getPayModesAPI = async () => {
  const myDeviceUUID = getStore().generic.myDeviceUUID;
  const selectedAddress = getStore().address?.selectedAddress;
  const paymentModesCount = getStore().order?.paymentModes?.length;
  paymentModesCount === 0 && dispatch(setIsLoading(true));
  const payload = {
    uuid: myDeviceUUID,
    latitude: selectedAddress?.latitude,
    longitude: selectedAddress?.longitude,
  };

  return post(constants.endPtPayModes, payload)
    .then(async res => {
      dispatch(setIsLoading(false));
      if (res?.status === constants.apiSuccess) {
        dispatch(setPaymentModes(res?.data));
        return true;
      } else {
        errorToast(res?.message);
        return false;
      }
    })
    .catch(e => {
      dispatch(setIsLoading(false));
      consoleHere({ e });
      return false;
    });
};
