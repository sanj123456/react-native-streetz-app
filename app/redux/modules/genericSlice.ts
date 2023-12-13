import {createSlice} from '@reduxjs/toolkit';
import {LoaderParams, randomData} from '../../types/paramsTypes';

interface GenericState {
  loader: LoaderParams;
  noInternet: boolean;
  appStateVisible: 'inactive' | 'background' | 'active' | null;
  myLocation: {
    coords: {
      latitude: number | null;
      longitude: number | null;
    };
    address: string;
  };
  myDeviceUUID: string;
  loginInitiatedFrom: string;
  loginInitiatedParams: any;
  initiateNotification: boolean;
  appSettings: {
    storeTiming: {
      key: string;
      value: string;
    }[];
  };
  intro_skip: any;
  location_entered_skip: any;
  deepLinkData: {
    data: any,
    type:'store'|'product'
  }|null;
  homeSafeArea: boolean;
  catSafeArea: boolean;
  fcmToken: any;
  showAndroidEnabler: boolean;
  isAddressApiCall: boolean;
  isDisplayingKeyboard: boolean;
  randomData: randomData | null;
}

const initialState: GenericState = {
  loader: {
    isLoading: false,
    loadingType: undefined,
  },
  noInternet: false,
  appStateVisible: 'active',
  myLocation: {
    coords: {
      latitude: null,
      longitude: null,
    },
    address: '',
  },
  myDeviceUUID: '',
  loginInitiatedFrom: '',
  loginInitiatedParams: undefined,
  initiateNotification: false,
  appSettings: {
    storeTiming: [],
  },
  intro_skip: '',
  location_entered_skip: '',
  deepLinkData: null,
  homeSafeArea: false,
  catSafeArea: false,
  fcmToken: null,
  showAndroidEnabler: false,
  isAddressApiCall: false,
  isDisplayingKeyboard: false,
  randomData: null,
};

export const genericSlice = createSlice({
  name: 'generic',
  initialState,
  reducers: {
    setIsLoading: (state, action) => {
      state.loader = {
        isLoading: action?.payload,
        loadingType: undefined,
      };
    },
    setLoader: (
      state,
      action: {
        payload: LoaderParams;
      },
    ) => {
      state.loader = action?.payload;
    },
    setNoInternet: (state, action) => {
      state.noInternet = action?.payload;
    },
    setAppStateVisible: (state, action) => {
      state.appStateVisible = action?.payload;
    },
    setMyLocation: (state, action) => {
      state.myLocation = {
        ...state?.myLocation,
        ...action?.payload,
      };
    },
    setMyDeviceUUID: (state, action) => {
      state.myDeviceUUID = action?.payload;
    },
    setLoginInitiatedFrom: (state, action) => {
      state.loginInitiatedFrom = action?.payload;
    },
    setLoginInitiatedParams: (state, action) => {
      state.loginInitiatedParams = action?.payload;
    },
    setInitiateNotification: (state, action) => {
      state.initiateNotification = action?.payload;
    },
    setStoreTiming: (state, action) => {
      state.appSettings = {
        ...state?.appSettings,
        storeTiming: action?.payload,
      };
    },
    setIntroSkipStatus: (state, action) => {
      state.intro_skip = action.payload;
    },
    setLocationEnteredSkip: (state, action) => {
      state.location_entered_skip = action.payload;
    },
    setDeepLinkData: (state, action) => {
      state.deepLinkData = action.payload;
    },
    setHomeSafeArea: (state, action) => {
      state.homeSafeArea = action.payload;
    },
    setCatSafeArea: (state, action) => {
      state.catSafeArea = action.payload;
    },
    setFcmToken: (state, action) => {
      state.fcmToken = action.payload;
    },
    setAndroidEnablerStatus: (state, action) => {
      state.showAndroidEnabler = action.payload;
    },
    setIsAddressApiCallStatus: (state, action) => {
      state.isAddressApiCall = action.payload;
    },
    setKeyboardStatus: (state, action) => {
      state.isDisplayingKeyboard = action.payload;
    },

    setRandomData: (state, action) => {
      state.randomData = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setIsLoading,
  setNoInternet,
  setAppStateVisible,
  setLoader,
  setMyLocation,
  setMyDeviceUUID,
  setLoginInitiatedFrom,
  setInitiateNotification,
  setLoginInitiatedParams,
  setStoreTiming,
  setIntroSkipStatus,
  setLocationEnteredSkip,
  setDeepLinkData,
  setHomeSafeArea,
  setCatSafeArea,
  setFcmToken,
  setAndroidEnablerStatus,
  setIsAddressApiCallStatus,
  setKeyboardStatus,

  setRandomData,
} = genericSlice.actions;

export default genericSlice.reducer;
