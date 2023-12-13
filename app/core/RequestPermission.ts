import {requestMultiple} from 'react-native-permissions';

export const RequestPermission = async (permission: any) => {
  const checkPermisionResult = await requestMultiple([...permission]);

  if (Object.values(checkPermisionResult).every(ele => ele === 'granted')) {
    return 1;
  } else if (
    Object.values(checkPermisionResult).every(ele => ele === 'denied')
  ) {
    return 0;
  } else if (
    Object.values(checkPermisionResult).every(
      ele => ele === 'blocked' || 'unavailable' || 'limited',
    )
  ) {
    return -1;
  }
};
