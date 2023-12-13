import Geolocation from '@react-native-community/geolocation';
import {calculateDistance, consoleHere, getGMP} from '../core';
import axios from 'axios';
import {dispatch, getStore} from '../redux';
import {setIsLoading, setMyLocation} from '../redux/modules/genericSlice';
import {setSelectedAddress} from '../redux/modules/addressSlice';
import {getAddressAPI} from './addressServices';

export const getGeoLocation = async () => {
  Geolocation.getCurrentPosition(
    async position => {
      //dispatch(setIsLoading(false));
      const {latitude, longitude} = position?.coords;
      //  const { latitude, longitude } = { latitude: 23.0225, longitude: 72.5714 };
      const userType = getStore()?.profile?.userType;
      if (userType === 'registered') {
        const addressRes: any = await getAddressAPI();
        let nearestAddress: any = {};
        addressRes?.map((address: any) => {
          if (
            calculateDistance(
              {latitude, longitude},
              {
                latitude: address?.latitude,
                longitude: address?.longitude,
              },
            ) <= 0.5
          ) {
            nearestAddress = address;
          }
        });
        if (Object.keys(nearestAddress).length !== 0) {
          const payload = {
            coords: {
              latitude: nearestAddress?.latitude,
              longitude: nearestAddress?.longitude,
            },
            address: nearestAddress?.address_line_2 ?? '',
          };

          dispatch(setSelectedAddress(nearestAddress));
          dispatch(setMyLocation(payload));
        } else {
          getAddressFromCoords(latitude, longitude);
        }
      } else {
        getAddressFromCoords(latitude, longitude);
      }
    },
    err => {
      dispatch(setIsLoading(false));
      consoleHere({err});
    },
    {
      timeout: 1 * 60 * 1000,
      maximumAge: 0,
      enableHighAccuracy: false,
    },
  );
};

export const getAddressFromCoords = (latitude: number, longitude: number) => {
  axios({
    url: 'https://maps.googleapis.com/maps/api/geocode/json',
    method: 'get',
    params: {
      address: `${latitude},${longitude}`,
      key: getGMP(),
    },
  })
    .then(res => {
      consoleHere({res});
      const payload = {
        coords: {latitude, longitude},
        address: res?.data?.results?.[0]?.formatted_address ?? '',
      };
      dispatch(setMyLocation(payload));
      dispatch(setSelectedAddress({latitude, longitude}));
    })
    .catch(err => consoleHere({err}));
};
