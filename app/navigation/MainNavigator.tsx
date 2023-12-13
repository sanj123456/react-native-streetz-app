/* eslint-disable react-hooks/exhaustive-deps */
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {FC, useCallback, useEffect, useRef, useState} from 'react';
import {AppState, Keyboard, LogBox, Platform, View} from 'react-native';
import {PERMISSIONS} from 'react-native-permissions';
import uuid from 'react-native-uuid';
import {useSelector} from 'react-redux';
import {
  Background,
  LoadingApp,
  NotificationHandler,
  RatingModal,
} from '../components';
import {
  appUpdateAlert,
  consoleHere,
  constants,
  extractSubstring,
  screenName,
} from '../core';
import {CheckPermission} from '../core/CheckPermission';
import {Intro, Splash} from '../modules/auth';
import LocationEntered from '../modules/auth/LocationEntered';
import LocationEnteredManually from '../modules/auth/LocationEnteredManually';
import {RootState, dispatch} from '../redux';
import {
  setAppStateVisible,
  setDeepLinkData,
  setIntroSkipStatus,
  setKeyboardStatus,
  setLocationEnteredSkip,
  setMyDeviceUUID,
} from '../redux/modules/genericSlice';
import {setRecentlyViewed} from '../redux/modules/homeSlice';
import {
  setRatingOrderID,
  setShowRatingModal,
} from '../redux/modules/orderSlice';
import {setProfileData, setUserType} from '../redux/modules/profileSlice';
import {
  analyticsLogEvent,
  getAsyncData,
  getSettingsAPI,
  setAsyncData,
} from '../services';
import {getRandomDataAPI} from '../services/genericServices';
import {colors, commonStyles} from '../styles';
import {AppNavigator} from './AppNavigator';
import AuthNavigator from './AuthNavigator';

const Stack = createNativeStackNavigator();

const MainNavigator: FC = ({}) => {
  /*********** Props and data destructuring ***********/
  LogBox.ignoreAllLogs();
  /*********** Hooks Functions ***********/

  const showRatingModal = useSelector(
    (state: RootState) => state?.order?.showRatingModal,
  );
  const initiateNotification = useSelector(
    (state: RootState) => state?.generic?.initiateNotification,
  );
  const introSkipStatus = useSelector(
    (state: RootState) => state.generic.intro_skip,
  );
  const linkData = useSelector(
    (state: RootState) => state.generic.deepLinkData,
  );

  const appState = useRef(AppState.currentState);
  const [showApp, setShowApp] = useState(false);
  const [fromBG, setFromBG] = useState(false);

  const navigation = useNavigation<any>();

  useEffect(() => {
    getUser();
    getUUID();
    permissionHandler();
    getRecentlyViewed();
    getSettingsAPI();
    getRandomDataAPI();
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        setFromBG(true);
        consoleHere('App has come to the foreground! main');
        //if you are going to app upload please add this alert
        appUpdateAlert();
      }

      appState.current = nextAppState;
      dispatch(setAppStateVisible(appState.current));
      consoleHere({AppState: appState.current});
    });

    return () => {
      subscription.remove();
    };
  }, []);

  /*********** Main Functions ***********/
  const getUser = async () => {
    const res = await getAsyncData(constants.asyncUserToken);
    if (res) {
      dispatch(setProfileData(res));
      dispatch(setUserType('registered'));
    }
    setShowApp(true);
  };

  const permissionHandler = useCallback(async () => {
    const permissionsArray =
      Platform.OS === 'ios'
        ? [PERMISSIONS.IOS.LOCATION_WHEN_IN_USE]
        : [PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION];

    const result = await CheckPermission(permissionsArray);

    switch (result) {
      case 0:
        dispatch(setLocationEnteredSkip(false));
        break;

      case 1:
        dispatch(setLocationEnteredSkip(true));
        break;

      case -1:
        dispatch(setLocationEnteredSkip(false));
        break;
    }
  }, [dispatch]);

  const getUUID = async () => {
    const res = await getAsyncData(constants.asyncMyDeviceUUID);
    if (res) {
      dispatch(setMyDeviceUUID(res));
    } else {
      const newUUID = uuid?.v4();
      setAsyncData(constants.asyncMyDeviceUUID, newUUID);
      dispatch(setMyDeviceUUID(newUUID));
    }
  };

  const getRecentlyViewed = async () => {
    const res = await getAsyncData(constants.asyncRecentlyViewed);
    if (res) {
      dispatch(setRecentlyViewed(res));
    } else {
      dispatch(setRecentlyViewed([]));
    }
  };

  const getUserData = async () => {
    const introSkiped = await getAsyncData(constants.asyncIntroSkip);
    const locationEnteredSkiped = await getAsyncData(
      constants.asyncLocationEnteredSkip,
    );
    if (introSkiped) {
      dispatch(setIntroSkipStatus(introSkiped));
    }

    if (locationEnteredSkiped) {
      dispatch(setLocationEnteredSkip(locationEnteredSkiped));
    }
  };

  useEffect(() => {
    getUserData();
    analyticsLogEvent(constants.analyticsEvents.appOpen);
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      dispatch(setKeyboardStatus(true));
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      dispatch(setKeyboardStatus(false));
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink(async (link: any) => {
      if (link.url.includes('product')) {
        dispatch(setDeepLinkData(''));
        let productId = link.url.split('productId=').pop();
        dispatch(setDeepLinkData({type: 'product', data: productId}));
      } else if (link.url.includes('store')) {
        let category_id = extractSubstring(link?.url, '=', '&');
        let seller_store_id = link.url.split('seller_store_id=').pop();
        dispatch(
          setDeepLinkData({
            type: 'store',
            data: {
              category_id,
              seller_store_id,
            },
          }),
        );
      }
    });
    return () => {
      unsubscribe();
    };
  }, [navigation]);

  useEffect(() => {
    if (introSkipStatus && showApp === true && linkData) {
      setTimeout(
        () => {
          if (linkData?.type === 'product') {
            navigation.navigate(screenName?.productDetails, {
              product_id: linkData?.data,
              type: '',
            });
          } else if (linkData?.type === 'store') {
            navigation.navigate(screenName?.storeDetails, linkData?.data);
          }
        },
        fromBG ? 500 : 4800,
      );
    }
  }, [showApp, navigation, linkData, introSkipStatus]);

  useEffect(() => {
    dynamicLinks()
      .getInitialLink()
      .then((link: any) => {
        if (link.url.includes('product')) {
          let productId = link.url.split('productId=').pop();
          dispatch(setDeepLinkData({type: 'product', data: productId}));
        } else if (link.url.includes('store')) {
          let category_id = extractSubstring(link?.url, '=', '&');
          let seller_store_id = link.url.split('seller_store_id=').pop();
          dispatch(
            setDeepLinkData({
              type: 'store',
              data: {
                category_id,
                seller_store_id,
              },
            }),
          );
        }
      });
  }, []);

  return (
    <View style={commonStyles.mainView}>
      <Background>
        <RatingModal
          isVisible={showRatingModal}
          onClose={() => {
            dispatch(setRatingOrderID(null));
            dispatch(setShowRatingModal(false));
          }}
        />
        {initiateNotification && <NotificationHandler />}

        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: colors.transparent,
            },
            gestureEnabled: false,
          }}>
          {showApp ? (
            <>
              <Stack.Screen name={screenName.splash} component={Splash} />
              <Stack.Screen name={screenName.intro} component={Intro} />
              <Stack.Screen
                name={screenName.locationEntered}
                component={LocationEntered}
              />
              <Stack.Screen
                name={screenName.locationEnteredManually}
                component={LocationEnteredManually}
              />

              <Stack.Screen name={screenName.app} component={AppNavigator} />

              <Stack.Screen name={screenName.auth} component={AuthNavigator} />
            </>
          ) : (
            <Stack.Screen name={screenName.loadingApp} component={LoadingApp} />
          )}
        </Stack.Navigator>
      </Background>
    </View>
  );
};

export default MainNavigator;
