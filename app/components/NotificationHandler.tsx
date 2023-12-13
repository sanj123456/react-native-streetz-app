import {FC, Fragment, useCallback, useEffect, useRef} from 'react';
import messaging from '@react-native-firebase/messaging';
import {consoleHere, constants, screenName, toNumber} from '../core';
import {getAsyncData, orderDetailsAPI, setAsyncData} from '../services';
import {Platform} from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {notificationService} from '../services';
import {dispatch, getStore} from '../redux';
import {setFcmToken} from '../redux/modules/genericSlice';
import {getCurrentRoute, navigate} from '../navigation/RootNavigation';
import {readSingleNotificationAPI} from '../services/notificationService';
import {PERMISSIONS} from 'react-native-permissions';
import {CheckPermission} from '../core/CheckPermission';
import {RequestPermission} from '../core/RequestPermission';

const NotificationHandler: FC = ({}) => {
  // ******************** Hooks Functions ************************ //
  const delayTimeout = useRef<any>(null);

  useEffect(() => {
    onComponentMount();
    notificationService.configure(onOpenNotification, onShowNotification);
    return () => {
      notificationService.unRegister();
      clearTimeout(delayTimeout.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ******************** Main Functions ************************ //

  const onShowNotification = (payload: any) => {
    payload;
  };

  const onOpenNotification = (notify: any) => {
    consoleHere({App_onOpenNotification: notify});

    if (notify?.notiType) {
      delayTimeout.current = setTimeout(
        () => handleNotificationRoute(notify),
        800,
      );
    }
  };

  const handleNotificationRoute = (notify: any) => {
    readSingleNotificationAPI({notification_id: notify?.id});
    // Navigation handling
    if (notify?.notiType === 'order') {
      navigate(screenName.timeToDelivery, {
        orderID: notify?.order_id,
        prevFlow: 'notification',
      });
    } else if (notify?.notiType === 'StoreDetails') {
      navigate(notify?.notiType, {
        category_id: notify?.category_id,
        seller_store_id: notify?.seller_store_id,
      });
    } else {
      navigate(screenName.notificationStack);
    }
  };
  const permissionHandler = useCallback(async () => {
    const permissionsArray = [PERMISSIONS.ANDROID.POST_NOTIFICATIONS];

    const result = await CheckPermission(permissionsArray);
    switch (result) {
      case 0:
        await RequestPermission(permissionsArray);
        break;
    }
  }, []);

  const onComponentMount = async () => {
    await checkPermission();
    Platform.OS === 'android' && (await permissionHandler());
    await createNotificationListeners(); //add this line

    if (Platform.OS === 'ios') {
      PushNotificationIOS.getInitialNotification()
        .then(res => {
          consoleHere({notification_handler_component_mount: res});
          if (res) {
            // @ts-ignore
            onOpenNotification(res?._data?.item);
          }
        })
        .catch(e => consoleHere({iOS_getInitialNotification_ERROR: e}));
    }

    messaging().onMessage(async remoteMessage => {
      const orderDetails = getStore()?.order?.orderDetails;
      const {notification, data} = remoteMessage;
      consoleHere({notification_from_component_did_mount: remoteMessage});
      const notificationId = Math.trunc(Math.random() * 10000);

      notificationService.showNotification(
        // @ts-ignore
        notificationId,
        // @ts-ignore
        notification.title,
        // @ts-ignore
        notification.body,
        data,
        Platform.OS === 'android'
          ? {largeIconUrl: notification?.android?.imageUrl}
          : {},
      );
      if (Platform.OS === 'ios' && data) {
        onShowNotification(data);
      }
      if (
        data?.notiType === 'order' &&
        getCurrentRoute() === screenName.timeToDelivery &&
        toNumber(data?.order_id) === orderDetails?.id
      ) {
        orderDetailsAPI(toNumber(data?.order_id));
      }
    });
    messaging().onNotificationOpenedApp(remoteMessage => {
      consoleHere({
        Notification_caused_app_to_open_from_background_state: remoteMessage,
      });
      const {data} = remoteMessage;
      onOpenNotification(data);
    });
  };

  const checkPermission = async () => {
    // authorizationStatus: 1=Authorized, 0=Denied, -1=Not Determined, 2=Provisional
    const authorizationStatus = await messaging().requestPermission({
      sound: true,
      alert: true,
      badge: true,
    });
    consoleHere({Permission_status: authorizationStatus});
    if (authorizationStatus === 1) {
      consoleHere({Permission_status: authorizationStatus});
      await getToken();
    } else if (authorizationStatus === 0) {
      consoleHere('User denied permissions request');
    }
  };

  const getToken = async () => {
    try {
      const apnsToken = await messaging().getAPNSToken();
      consoleHere({apnsToken});
    } catch (error) {
      consoleHere({error});
    }
    let fcmToken = await getAsyncData(constants.asyncFcmToken);
    consoleHere({FCM_TOKEN_async: fcmToken});
    if (fcmToken) {
      dispatch(setFcmToken(fcmToken));
    }
    if (fcmToken == null) {
      try {
        fcmToken = await messaging().getToken();
        consoleHere({FCM_TOKEN_firebase: fcmToken});
        if (fcmToken) {
          // user has a device token
          await setAsyncData(constants.asyncFcmToken, fcmToken);
          dispatch(setFcmToken(fcmToken));
        }
      } catch (error) {
        consoleHere({fcmTokenError: error});
      }
    }
  };

  const createNotificationListeners = async () => {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      consoleHere({Message_handled_in_the_background: remoteMessage});
    });
    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          consoleHere({
            Notification_caused_app_to_open_from_quit_state: remoteMessage,
          });
          const {data} = remoteMessage;

          onOpenNotification(data);
        }
      })
      .catch(e =>
        consoleHere({Notification_caused_app_to_open_from_quit_state_Error: e}),
      );
  };

  return <Fragment />;
};

export default NotificationHandler;
