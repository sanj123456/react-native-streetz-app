import {supportModalRef} from '../components/SupportModal';
import {consoleHere, constants, errorToast} from '../core';
import {dispatch} from '../redux';
import {setIsLoading, setLoader} from '../redux/modules/genericSlice';
import {LoadingParams} from '../types/paramsTypes';
import {get, post} from './request';

export const contactSupportAPI = async (payload: any) => {
  dispatch(
    setLoader({
      isLoading: true,
      loadingType: 'contact_us',
    }),
  );
  return post(constants.endPtContactSupport, payload, 'formData')
    .then(async res => {
      dispatch(
        setLoader({
          isLoading: false,
          loadingType: 'contact_us',
        }),
      );
      if (res?.status === constants.apiSuccess) {
        supportModalRef?.current?.showMessage({
          message: 'Success',
          description: res?.message,
          type: 'success',
          position: 'top',
          icon: 'auto',
        });
        return true;
      } else {
        supportModalRef?.current?.showMessage({
          message: 'Oops!',
          description: res?.message,
          type: 'danger',
          position: 'top',
          icon: 'auto',
        });
        return false;
      }
    })
    .catch(e => {
      consoleHere({e});
      dispatch(
        setLoader({
          isLoading: false,
          loadingType: 'contact_us',
        }),
      );
      return false;
    });
};

export const faqAPI = async (loadingType?: LoadingParams) => {
  dispatch(
    setLoader({
      isLoading: true,
      loadingType,
    }),
  );
  return get(constants.endPtFAQ)
    .then(async res => {
      consoleHere({res});
      dispatch(
        setLoader({
          isLoading: false,
          loadingType,
        }),
      );
      if (res?.status === constants.apiSuccess) {
        return res?.data;
      } else {
        errorToast(res?.message);
        return false;
      }
    })
    .catch(e => {
      consoleHere({e});
      dispatch(
        setLoader({
          isLoading: false,
          loadingType,
        }),
      );
      return false;
    });
};

export const orderReturnAvailableAPI = async () => {
  return get(constants.endPtOrderReturnList)
    .then(async res => {
      consoleHere({orderReturnAvailableAPI: res});
      if (res?.status === constants.apiSuccess) {
        return res?.data;
      } else {
        // errorToast(res?.message);
        return false;
      }
    })
    .catch(e => {
      consoleHere({e});
      return false;
    });
};

export const orderReturnRequestAPI = async (id: number) => {
  try {
    dispatch(setIsLoading(true));
    const res = await get(`${constants.endPtOrderReturnRequest}${id}`);

    dispatch(setIsLoading(false));
    if (res?.status === constants.apiSuccess) {
      return res?.data;
    } else {
      // errorToast(res?.message);
    }
  } catch (e) {
    consoleHere({e});
    dispatch(setIsLoading(false));
  }
};
