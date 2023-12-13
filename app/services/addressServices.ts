import {consoleHere, constants, errorToast, screenName} from '../core';
import {dispatch, getStore} from '../redux';
import {
  setIsAddressApiCallStatus,
  setIsLoading,
  setMyLocation,
} from '../redux/modules/genericSlice';
import {
  setAddressData,
  setUpdatedAddressData,
  setRemoveAddressData,
  setSelectedAddress,
} from '../redux/modules/addressSlice';
import {get, post} from './request';
import {getCurrentRoute} from '../navigation/RootNavigation';

export const getAddressAPI = async () => {
  const {selectedAddress, addressCalledFrom, addressData} = getStore().address;
  getCurrentRoute() === screenName?.myAddresses ||
  getCurrentRoute() === screenName.app
    ? (!addressData || addressData?.length === 0) &&
      dispatch(setIsLoading(true))
    : null;
  return get(constants.endPtGetAddress)
    .then(async res => {
      if (res?.status === constants.apiSuccess || res?.status === 99) {
        dispatch(setAddressData(res?.data));
        getCurrentRoute() === screenName.tabHome ? null: dispatch(setIsLoading(false));
        dispatch(setIsAddressApiCallStatus(true));
        if (!selectedAddress?.id || addressCalledFrom === 'Home') {
          return res?.data;
        } else {
          return selectedAddress;
        }
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

export const addAddressAPI = async (payload: any, navigation: any) => {
  dispatch(setIsLoading(true));
  post(constants.endPtStoreAddress, payload)
    .then(async res => {
      if (res?.status === constants.apiSuccess) {
        getAddressAPI();
        if (res?.data) {
          const locationObj = {
            coords: {
              latitude: payload?.latitude,
              longitude: payload?.longitude,
            },
            address: payload?.address_line_2 ?? '',
          };
          dispatch(setSelectedAddress(res?.data));
          dispatch(setMyLocation(locationObj));
        }
        navigation.goBack();
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

export const updateAddressAPI = async (payload: any, navigation: any) => {
  dispatch(setIsLoading(true));
  const {selectedAddress} = getStore().address;
  post(constants.endPtStoreAddress, payload)
    .then(async res => {
      if (res?.status === constants.apiSuccess) {
        if (payload.id === selectedAddress?.id) {
          dispatch(
            setMyLocation({
              address: payload?.address_line_2 ?? '',
            }),
          );
          dispatch(setSelectedAddress(payload));
        }
        dispatch(setUpdatedAddressData(payload));
        navigation.goBack();
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

export const removeAddressAPI = async (payload: any) => {
  const selectedAddress = getStore()?.address?.selectedAddress;
  // const coords = getStore()?.generic?.myLocation?.coords;
  dispatch(setIsLoading(true));
  post(constants.endPtRemoveAddress, payload)
    .then(async res => {
      if (res?.status === constants.apiSuccess) {
        dispatch(setRemoveAddressData(payload));
        if (payload?.id === selectedAddress?.id) {
          dispatch(setSelectedAddress(null));
          dispatch(
            setMyLocation({
              coords: {
                latitude: null,
                longitude: null,
              },
              address: '',
            }),
          );
        }
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

export const updateDefaultAddressAPI = async (payload: any) => {
  post(constants.endPtUpdateDefaultAddress, payload)
    .then(async res => {
      if (res?.status !== constants.apiSuccess) {
        errorToast(res?.message);
      }
    })
    .catch(e => {
      consoleHere({e});
    });
};
