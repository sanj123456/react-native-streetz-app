/* eslint-disable react-hooks/exhaustive-deps */
import {FC, memo, useCallback, useEffect, useRef} from 'react';
import {
  Alert,
  AppState,
  Image,
  Linking,
  Platform,
  SafeAreaView,
  View,
} from 'react-native';
import {PERMISSIONS} from 'react-native-permissions';
import {useSelector} from 'react-redux';
import {PrimaryButton} from '../../components';
import {
  consoleHere,
  constants,
  images,
  perfectSize,
  screenName,
} from '../../core';
import {CheckPermission} from '../../core/CheckPermission';
import {RequestPermission} from '../../core/RequestPermission';
import {strings} from '../../i18n';
import {resetNavigation} from '../../navigation/RootNavigation';
import {RootState, dispatch} from '../../redux';
import {setLocationEnteredSkip} from '../../redux/modules/genericSlice';
import {setAsyncData} from '../../services';
import {commonStyles, locationStyles} from '../../styles';
import {CommonNavigationProps} from '../../types/navigationTypes';

const LocationAuth: FC<CommonNavigationProps> = props => {
  const {navigation} = props;
  const linkData: any = useSelector(
    (state: RootState) => state.generic.deepLinkData,
  );
  const appState = useRef(AppState.currentState);
  const navigationHandler = () => {
    resetNavigation(screenName.app);
    setAsyncData(constants.asyncLocationEnteredSkip, true);
    dispatch(setLocationEnteredSkip(true));
    if (linkData) {
      setTimeout(() => {
        if (linkData?.type === 'product') {
          navigation.navigate(screenName?.productDetails, {
            product_id: linkData?.data,
            type: '',
          });
        } else if (linkData?.type === 'store') {
          navigation.navigate(screenName?.storeDetails, linkData?.data);
        }
      }, 4500);
    }
  };

  const showAlertHandler = useCallback(() => {
    Alert.alert(
      'Allow Permission',
      "Streetz Hyperlocal requires your device's location permission in order to find nearby stores.",
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Open Settings',
          style: 'cancel',
          onPress: () => Linking.openSettings(),
        },
      ],
    );
  }, []);

  const permissionHandler = useCallback(async () => {
    const permissionsArray =
      Platform.OS === 'ios'
        ? [PERMISSIONS.IOS.LOCATION_WHEN_IN_USE]
        : [PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION];

    const result = await CheckPermission(permissionsArray);

    switch (result) {
      case 0:
        const result1 = await RequestPermission(permissionsArray);

        switch (result1) {
          case 0:
            showAlertHandler();
            break;

          case 1:
            navigationHandler();
            break;

          case -1:
            showAlertHandler();
            break;
        }
        break;

      case 1:
        navigationHandler();
        break;

      case -1:
        showAlertHandler();
        break;
    }
  }, [navigationHandler, showAlertHandler]);

  const checkPermissionHandler = useCallback(async () => {
    const permissionsArray =
      Platform.OS === 'ios'
        ? [PERMISSIONS.IOS.LOCATION_WHEN_IN_USE]
        : [PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION];

    const result = await CheckPermission(permissionsArray);

    switch (result) {
      case 0:
        showAlertHandler();
        break;

      case 1:
        navigationHandler();
        break;

      case -1:
        showAlertHandler();
        break;
    }
  }, [navigationHandler, showAlertHandler]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        consoleHere('App has come to the foreground!');
        checkPermissionHandler();
      }
      appState.current = nextAppState;
      consoleHere({AppState: appState.current});
    });

    return () => {
      subscription.remove();
    };
  }, [checkPermissionHandler]);

  const addLocationManually = useCallback(() => {
    navigation.navigate(screenName.locationEnteredManually);
  }, [navigation]);

  return (
    <View
      style={[
        commonStyles.mainView,
        {paddingBottom: perfectSize(20), paddingHorizontal: perfectSize(40)},
      ]}>
      <SafeAreaView />
      <View style={locationStyles.root}>
        <Image
          source={images.icMapImage}
          style={locationStyles.logoStyle}
          resizeMode="contain"
        />
      </View>
      <PrimaryButton
        onPress={permissionHandler}
        title={strings.btSelectCurrentLocation}
      />
      <PrimaryButton
        onPress={addLocationManually}
        title={strings.btEnterAddressManually}
        style={locationStyles.darkButton}
      />
    </View>
  );
};
export default memo(LocationAuth);
