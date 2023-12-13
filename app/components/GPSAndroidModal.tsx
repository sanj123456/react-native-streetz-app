import {FC, useCallback} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Alert,
  Linking,
  Platform,
  SafeAreaView,
} from 'react-native';
import Modal from 'react-native-modal';
import {colors, fonts} from '../styles';
import {GPSAndroidModalHeader} from './GPSAndroidModalHeader';
import {strings} from '../i18n';
import {Image} from 'react-native';
import {images, screenName} from '../core';
import {getGeoLocation} from '../services';
import {useSelector} from 'react-redux';
import {RootState, dispatch} from '../redux';
import {
  setAndroidEnablerStatus,
  setMyLocation,
} from '../redux/modules/genericSlice';
import {navigate} from '../navigation/RootNavigation';
import {setSelectedAddress} from '../redux/modules/addressSlice';
import {PERMISSIONS} from 'react-native-permissions';
import {CheckPermission} from '../core/CheckPermission';
import {RequestPermission} from '../core/RequestPermission';
import {PrimaryText} from './PrimaryText';
import {AndroidLocationEnabler} from './AndroidLocationEnabler';
import {GPSAndroidModalProps} from '../types/components';

export const GPSAndroidModal: FC<GPSAndroidModalProps> = props => {
  const {visible} = props;

  const addressData = useSelector(
    (state: RootState) => state.address?.addressData,
  );

  const showAlertHandler = useCallback(() => {
    Alert.alert(
      'Allow Permission',
      "Streetz Hyperlocal requires your device's location permission in order to find nearby stores.",
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Open Settings',
          style: 'default',
          onPress: () => {
            Linking.openSettings();
          },
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
            if (Platform.OS === 'android') {
              AndroidLocationEnabler();
            } else if (Platform.OS === 'ios') {
              await getGeoLocation();
            }
            dispatch(setAndroidEnablerStatus(false));
            break;

          case -1:
            showAlertHandler();
            break;
        }
        break;

      case 1:
        if (Platform.OS === 'android') {
          AndroidLocationEnabler();
        } else if (Platform.OS === 'ios') {
          await getGeoLocation();
        }
        dispatch(setAndroidEnablerStatus(false));
        break;

      case -1:
        showAlertHandler();
        break;
    }
  }, [showAlertHandler]);

  const viewAddressHandler = () => {
    dispatch(setAndroidEnablerStatus(false));
    navigate(screenName.myAddresses);
  };

  const selectAddressHandler = (address: any) => {
    dispatch(setAndroidEnablerStatus(false));
    const payload = {
      coords: {
        latitude: address?.latitude,
        longitude: address?.longitude,
      },
      address: address?.address_line_2 ?? '',
    };

    dispatch(setSelectedAddress(address));
    dispatch(setMyLocation(payload));
  };

  return (
    <Modal
      isVisible={visible}
      style={styles.modalView}
      testID={`ModalGPSAndroid`}>
      <View style={styles.card} testID={`ModalGpsCard`}>
        <GPSAndroidModalHeader onPress={permissionHandler} />

        {addressData && addressData?.length > 0 ? (
          <View style={styles.titleView} testID={`ModalGpsTitleView`}>
            <PrimaryText
              style={styles.titlePrimaryText}
              testID={`ModalGpsDeliveryAddress`}>
              {strings.msgSelectDeliveryAddress}
            </PrimaryText>
            <PrimaryText
              style={styles.viewAllPrimaryText}
              props={{onPress: viewAddressHandler}}
              testID={`ModalGpsViewAll`}>
              {strings.btViewAll}
            </PrimaryText>
          </View>
        ) : null}
        {addressData && addressData?.[0]?.address_label ? (
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.addressView}
            onPress={selectAddressHandler.bind(null, addressData[0])}
            testID={`ModalGpsAddressView`}>
            <Image
              source={images.icLocation}
              style={styles.iconImage}
              resizeMode="contain"
              testID={`ModalGpsImageLocation`}
            />
            <View>
              <PrimaryText
                style={styles.addressTitle}
                testID={`ModalGpsAddressTitle`}>
                {addressData[0].address_label}
              </PrimaryText>
              <PrimaryText
                numberOfLines={1}
                style={styles.addressPrimaryText}
                testID={`ModalGpsAddress_line_1`}>
                {addressData[0].address_line_1}
              </PrimaryText>
            </View>
          </TouchableOpacity>
        ) : null}

        {addressData && addressData?.[1]?.address_label ? (
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.addressView}
            onPress={selectAddressHandler.bind(null, addressData[1])}
            testID={`ModalGpsAddressViewData`}>
            <Image
              source={images.icLocation}
              style={styles.iconImage}
              resizeMode="contain"
              testID={`ModalGpsIcLocation`}
            />
            <View>
              <PrimaryText
                style={styles.addressTitle}
                testID={`ModalGpsAddress_label`}>
                {addressData[1].address_label}
              </PrimaryText>
              <PrimaryText
                numberOfLines={1}
                style={styles.addressPrimaryText}
                testID={`ModalGpsAddressPrimaryText`}>
                {addressData[1].address_line_1}
              </PrimaryText>
            </View>
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.addressView}
          onPress={viewAddressHandler}
          testID={`ModalGpsViewAddress`}>
          <Image
            source={images.icSearch}
            style={styles.iconImage}
            testID={`ModalGpsIcSearch`}
          />
          <PrimaryText
            style={styles.enterLocation}
            testID={`ModalGpsEnterLocation`}>
            {strings.btEnterAddressManually}
          </PrimaryText>
        </TouchableOpacity>
        <SafeAreaView />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    margin: 0,
    justifyContent: 'flex-end',
  },
  card: {
    width: '100%',
    overflow: 'hidden',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: colors.white,
  },
  titlePrimaryText: {
    ...fonts.heading16,
  },
  viewAllPrimaryText: {
    ...fonts.heading14,
    color: colors.primary,
    padding: 5,
  },
  titleView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
  },
  addressTitle: {
    ...fonts.medium16,
  },
  addressView: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  iconImage: {
    height: 25,
    width: 25,
    marginRight: 5,
  },
  addressPrimaryText: {
    color: colors.inactiveIndicator,
    marginTop: 5,
  },
  enterLocation: {
    ...fonts.medium16,
    color: colors.inactiveIndicator,
    marginLeft: 15,
  },
});
