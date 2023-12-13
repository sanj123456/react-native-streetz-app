import {checkMultiple} from 'react-native-permissions';

export const CheckPermission = async (permission: any) => {
  const checkPermissionResult = await checkMultiple([...permission]);
  if (Object.values(checkPermissionResult).every(ele => ele === 'granted')) {
    return 1;
  } else if (
    Object.values(checkPermissionResult).every(ele => ele === 'denied')
  ) {
    return 0;
  } else if (
    Object.values(checkPermissionResult).every(
      ele => ele === 'blocked' || 'unavailable' || 'limited',
    )
  ) {
    return -1;
  }
};
