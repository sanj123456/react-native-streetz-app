/* eslint-disable react-native/no-inline-styles */
import {FC} from 'react';
import {Image, StyleSheet, TouchableOpacity, View, Alert} from 'react-native';
import {PrimaryText} from './PrimaryText';
import {AddressItemProps} from '../types/components';
import {colors, commonStyles, fonts} from '../styles';
import {images, screenName} from '../core';
import {removeAddressAPI} from '../services';
import {navigate} from '../navigation/RootNavigation';
import {setSelectedAddress} from '../redux/modules/addressSlice';
import {RootState, dispatch} from '../redux';
import {useSelector} from 'react-redux';
import {strings} from '../i18n';
import {setMyLocation} from '../redux/modules/genericSlice';

export const AddressItem: FC<AddressItemProps> = ({type, data, navigation}) => {
  const handleSelectedAddress = (val: any) => {
    const payload = {
      coords: {
        latitude: val?.data?.latitude,
        longitude: val?.data?.longitude,
      },
      address: val?.data?.address_line_2 ?? '',
    };
    dispatch(setMyLocation(payload));
    dispatch(setSelectedAddress(val?.data));
    navigation?.goBack();
  };

  const removeAddress = (val: any) => {
    Alert.alert(
      strings.ctRemoveSelectedAddress,
      strings.msgConfirmRemoveAddress,
      [
        {
          text: strings.btYes,
          onPress: () => {
            removeAddressAPI({id: val?.id});
          },
        },
        {text: strings.btNo},
      ],
    );
  };

  const selectedAddress = useSelector(
    (state: RootState) => state.address?.selectedAddress,
  );

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      testID="selectedAddressItem"
      disabled={type !== 'address_list'}
      onPress={() =>
        data?.id !== selectedAddress?.id && handleSelectedAddress({data})
      }
      style={{
        ...styles.addressWrapper,
        ...(type === 'address_list' || type === 'time_to_delivery'
          ? styles.addressListWrapper
          : styles.addressCartWrapper),
        marginTop: type === 'address_list' ? '4%' : '2%',
        backgroundColor:
          data?.id === selectedAddress?.id && type === 'address_list'
            ? colors.primary1
            : colors.white,
        padding: type === 'cart' ? 0 : 10,
        paddingBottom: 10,
        overflow: 'hidden',
      }}>
      <View style={commonStyles.horizontalBetweenStyles}>
        {type === 'address_list' && (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              testID="addressTagImage"
              source={
                data?.address_tag === 'home'
                  ? images.menuHome
                  : data?.address_tag === 'office'
                  ? images.icOfficeBag
                  : images.icPin
              }
              style={{height: 23, width: 23, marginRight: 5}}
              resizeMode="contain"
            />
            <PrimaryText
              testID={'addressTagText'}
              style={{...fonts.medium18, textTransform: 'capitalize'}}>
              {data?.address_tag ?? 'Other'}
            </PrimaryText>
          </View>
        )}
        {type === 'address_list' && (
          <View style={styles.optionView}>
            <TouchableOpacity
              activeOpacity={0.8}
              testID="addAddressNavigate"
              style={[
                styles.iconView,
                {
                  backgroundColor: colors.primary,
                },
              ]}
              onPress={() => navigate(screenName.addAddress, {item: data})}>
              <Image style={styles.iconSize} source={images.icPencil} />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              testID="removeAddress"
              onPress={() => removeAddress(data)}
              style={[
                styles.iconView,
                {
                  backgroundColor: colors.red,
                  marginLeft: 9,
                },
              ]}>
              <Image
                testID="deleteIcon"
                style={styles.iconSize}
                source={images.icDelete}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {type === 'cart' && (
        <View
          testID="cartView"
          style={{
            ...commonStyles.horizontalBetweenStyles,
            marginBottom: 8,
            backgroundColor: colors.primary1,
            paddingHorizontal: '4%',
            paddingVertical: '2%',
            overflow: 'hidden',
          }}>
          <PrimaryText style={fonts.medium16}>Address</PrimaryText>
          <TouchableOpacity
            activeOpacity={0.8}
            testID="cartNavigateToMyAddress"
            style={[
              styles.iconView,
              {
                backgroundColor: colors.primary,
              },
            ]}
            onPress={() =>
              navigation ? navigation.navigate(screenName.myAddresses) : null
            }>
            <Image style={styles.iconSize} source={images.icPencil} />
          </TouchableOpacity>
        </View>
      )}

      <View
        style={{
          marginLeft: type === 'address_list' ? 28 : 0,
          paddingHorizontal: type === 'cart' ? '4%' : '0%',
        }}>
        <PrimaryText
          testID={'cartUserName'}
          style={{
            ...styles.username,
            color: type === 'address_list' ? colors.blackText : colors.primary,
          }}>
          {data?.name}
        </PrimaryText>
        <PrimaryText testID={'cartFullAddress'} style={styles.txtAddress}>
          {data?.address_line_2},{data?.city},{data?.state} - {data?.pincode},
          {data?.country}
        </PrimaryText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mainView: {
    width: '100%',
  },
  addressWrapper: {
    width: '100%',
    borderRadius: 12,
  },
  addressListWrapper: {},
  addressCartWrapper: {
    backgroundColor: colors.white,
    marginTop: '1%',
  },
  username: {
    ...fonts.medium14,
  },
  txtAddress: {
    marginTop: '1%',
    lineHeight: 20,
  },
  optionView: {
    flexDirection: 'row',
  },
  iconView: {
    height: 30,
    width: 30,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSize: {
    height: 15,
    width: 15,
    tintColor: colors.white,
  },
});
