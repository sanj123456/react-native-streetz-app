import axios from 'axios';
import Config from 'react-native-config';
import {constants} from '../core';
import {getStore} from '../redux';
import {
  consoleHere,
  decryptData,
  encryptData,
  errorToast,
  resetDataForNewLogin,
} from './../core';

// Create Instance
const AxiosInstance = axios.create({
  baseURL: Config.API_BASE_URL,
  timeout: 20000,
  transformRequest: [
    function (data, headers) {
      const profileData = getStore().profile.profileData;
      const randomData = getStore().generic.randomData;
      if (
        profileData &&
        profileData?.api_token &&
        profileData.mobile_no.match(constants.numberRegex)
      ) {
        headers.Authorization = `Bearer ${profileData?.api_token}`;
      } else if (
        profileData &&
        profileData?.api_token &&
        randomData?.gp &&
        !profileData.mobile_no.match(constants.numberRegex)
      ) {
        const decoded = decryptData(
          JSON?.parse(profileData?.api_token),
          randomData?.gp,
        );
        const completeToken = encryptData(decoded, randomData?.gp);
        const stringifyToken = JSON.stringify(completeToken);
        headers.Authorization = stringifyToken;
        headers.isCredentialKey = 1;
      }
      if (data && data._parts) {
        return data;
      } else {
        return JSON.stringify(data);
      }
    },
  ],
  headers: {'Content-Type': 'application/json'},
});

// Response Interceptor
AxiosInstance.interceptors.response.use(
  response => {
    consoleHere({API_RESPONSE: JSON.stringify(response)});
    if (response?.data?.status === 99) {
      errorToast(response?.data?.message);
      resetDataForNewLogin();
      return response;
    } else {
      return response;
    }
  },
  error => {
    consoleHere({ERROR_CONFIG: error.config});
    consoleHere({ERROR_RESPONSE: error.response});
    if (!error.response) {
      return Promise.reject({
        status: constants.apiFailure,
        message: 'Something went wrong',
      });
    } else {
      return error.response;
    }
  },
);

export default AxiosInstance;
