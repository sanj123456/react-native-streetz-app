import AsyncStorage from '@react-native-async-storage/async-storage';
import {consoleHere} from '../core';

export const setAsyncData = async (key: string, value: any) => {
  consoleHere({Key: key, Value: value});
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    consoleHere({setAsyncDataError: e});
  }
};

export const getAsyncData = async (key: string) => {
  let data = null;
  try {
    const res: any = await AsyncStorage.getItem(key);
    data = JSON.parse(res);
  } catch (e) {
    consoleHere({getAsyncDataError: e});
  }
  return data;
};

export const removeAsyncData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    // remove error
    consoleHere({removeAsyncDataError: e});
  }

  consoleHere('Removed.');
};
