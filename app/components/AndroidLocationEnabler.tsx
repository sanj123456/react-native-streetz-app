import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import {getGeoLocation} from '../services';
import {dispatch} from '../redux';
import {setAndroidEnablerStatus} from '../redux/modules/genericSlice';

export const AndroidLocationEnabler = async () => {
  try {
    const isLocationEnabled =
      await RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
        interval: 10000,
        fastInterval: 5000,
      });
    if (isLocationEnabled) {
      dispatch(setAndroidEnablerStatus(false));
      setTimeout(() => {
        getGeoLocation();
      }, 100);
    } else {
    }
  } catch (error) {
    console.error('Error enabling location services:', error);
  }
};
