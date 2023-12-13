import {Platform} from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import {consoleHere, constants, errorToast} from '../core';
import {get, post} from './request';
import {dispatch} from '../redux';
import {
  setNotificationCount,
  setNotificationList,
} from '../redux/modules/notificationSlice';
import {LoadingParams} from '../types/paramsTypes';
import {setLoader} from '../redux/modules/genericSlice';

interface Props {
  id: string;
  autoCancel: boolean;
  largeIcon: string;
  smallIcon: string;
  bigText: string;
  subText: string;
  vibrate: boolean;
  vibration: number;
  priority: string;
  importance: string;
  playSound: boolean;
  soundName: string;
  largeIconUrl: string;
  data: any;
}
class LocalPushNotification {
  configure = (onOpenNotification: any, onShowNotification: any) => {
    PushNotification.configure({
      onRegister: function () {},
      onNotification: function (notification) {
        if (!notification?.userInteraction) {
          onShowNotification(
            Platform.OS === 'ios'
              ? notification?.data?.item
              : notification?.data,
          );
        } else {
          onOpenNotification(
            Platform.OS === 'ios'
              ? notification?.data?.item
                ? notification?.data?.item
                : notification?.data
              : notification?.data,
          );
          if (Platform.OS === 'ios') {
            notification.finish(PushNotificationIOS.FetchResult.NoData);
          }
        }
      },
      onAction: function (notification: any) {
        notification;
      },
      onRegistrationError: function (err: {message: any}) {
        console.error(err.message, err);
      },
      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
    PushNotification.createChannel(
      {
        channelId: 'streetz_app_channel',
        channelName: 'Streetz channel',
        channelDescription: 'A channel to categorize your notifications',
        soundName: 'default',
        importance: 4,
        vibrate: true,
      },
      created => consoleHere(`CreateChannel returned '${created}'`),
    );
  };
  unRegister = () => {
    PushNotification.unregister();
  };
  showNotification = (
    id: string | number,
    title: string,
    message: string,
    data: any,
    option: Partial<Props>,
  ) => {
    PushNotification.localNotification({
      ...this.buildAndroidNotification(id, title, message, data, option),
      ...this.buildIOSNotification(id, title, message, data, option),
      channelId: 'streetz_app_channel',
      title: title || '', // (optional)
      message: message || '', // (required)
      playSound: option.playSound || true, // (optional) default: true
      soundName: option.soundName || 'default',
      ignoreInForeground: false,
      invokeApp: false,
      picture: data?.fcm_options?.image ?? undefined,
    });
  };
  buildAndroidNotification = (
    id: string | number,
    title: string,
    message: string,
    data: any,
    option: any,
  ) => {
    return {
      id: id,
      autoCancel: true,
      largeIcon: option?.largeIcon || 'ic_launcher',
      smallIcon: option?.smallIcon || 'ic_notification',
      largeIconUrl: option?.largeIconUrl || '',
      bigText: message || '', // (optional) default: "message" prop
      subText: title || '',
      vibrate: option?.vibrate || true,
      vibration: option?.vibration || 300,
      priority: option?.priority || 'high', // (optional) set notification priority, default: high
      importance: option?.importance || 'high',
      data: data,
    };
  };
  buildIOSNotification = (
    id: string | number,
    title: string,
    message: string,
    data: any,
    option: any,
  ) => {
    consoleHere({'test noti': id, data, option});
    return {
      alertAction: option.alertAction || 'view',
      category: option.category || '',
      userInfo: {
        id: id,
        item: data,
      },
    };
  };
  cancelAllLocalNotification = () => {
    PushNotification.cancelAllLocalNotifications();
  };
  removeDeliveredNotifications = (identifiers: string) => {
    PushNotification.removeDeliveredNotifications([identifiers]);
  };
  cancelLocalNotification = (identifier: string) => {
    PushNotification.cancelLocalNotification(identifier);
  };
}

export const notificationService = new LocalPushNotification();

export const getNotificationsAPI = (
  loadingType?: LoadingParams,
  hideLoader?: boolean,
) => {
  !hideLoader && dispatch(setLoader({isLoading: true, loadingType}));
  get(constants.endPtNotificationList)
    .then(async res => {
      if (res?.status === constants.apiSuccess) {
        dispatch(setNotificationList(res?.data));
        res?.data?.[0]?.id &&
          readNotificationAPI({notification_id: res?.data?.[0]?.id});
      } else {
        //errorToast(res?.message);
      }
      dispatch(setLoader({isLoading: false, loadingType}));
    })
    .catch(e => {
      consoleHere({'API ERROR': e});
      dispatch(setLoader({isLoading: false, loadingType}));
    });
};

export const getNotificationCountAPI = (loadingType?: LoadingParams) => {
  get(constants.endPtNotificationCount)
    .then(async res => {
      if (res?.status === constants.apiSuccess) {
        dispatch(setNotificationCount(res?.data?.unread_count));
      } else {
        errorToast(res?.message);
      }
    })
    .catch(e => {
      consoleHere({'API ERROR': e});
    });
};

export const readNotificationAPI = (payload: {notification_id: number}) => {
  post(constants.endPtReadNotification, payload)
    .then(async res => {
      if (res?.status === constants.apiSuccess) {
      } else {
        errorToast(res?.message);
      }
    })
    .catch(e => {
      consoleHere({'API ERROR': e});
    });
};

export const readSingleNotificationAPI = (payload: {
  notification_id: number;
}) => {
  post(constants.endPtReadSingleNotification, payload)
    .then(async res => {
      if (res?.status === constants.apiSuccess) {
        consoleHere({'readSingleNotificationAPI response': res?.status});
      } else {
        //errorToast(res?.message);
      }
    })
    .catch(e => {
      consoleHere({'API ERROR': e});
    });
};
