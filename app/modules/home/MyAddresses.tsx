/* eslint-disable react/no-unstable-nested-components */
import React, {FC, useEffect} from 'react';
import {Image, View} from 'react-native';
import {
  AddressItem,
  Background,
  PrimaryButton,
  PrimaryHeader,
  PrimaryText,
} from '../../components';
import {strings} from '../../i18n';
import {FlatList} from 'react-native-gesture-handler';
import {CommonNavigationProps} from '../../types/navigationTypes';
import {images, screenName} from '../../core';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux';
import {getAddressAPI} from '../../services';
import {commonStyles, myAddressesStyles} from '../../styles';

export const MyAddresses: FC<CommonNavigationProps> = ({navigation}) => {
  const addressData = useSelector(
    (state: RootState) => state.address?.addressData,
  );

  useEffect(() => {
    getAddressAPI();
  }, []);

  const EmptyListMessage = () => {
    return (
      <View style={myAddressesStyles.mainView}>
        <Image style={commonStyles.icon52} source={images.icLocation} />
        <PrimaryText style={myAddressesStyles.txtHeading}>
          {strings.ctNoAddressFound}
        </PrimaryText>
      </View>
    );
  };

  const dataFound = () => {
    return addressData?.length > 0;
  };

  return (
    <Background>
      <PrimaryHeader
        left="back"
        title={!dataFound() ? strings.ctAddAddress : strings.ctAddresses}
        screen_from={screenName.myAddresses}
      />

      {dataFound() ? (
        <>
          <FlatList
            contentContainerStyle={myAddressesStyles.contentContainerStyle}
            data={addressData}
            keyExtractor={(item, index) => `${index}_address_items`}
            renderItem={({item}) => (
              <AddressItem
                data={item}
                type="address_list"
                navigation={navigation}
              />
            )}
          />
          <PrimaryButton
            style={myAddressesStyles.btnAddAddress}
            title={strings.ctAddNewAddress}
            onPress={() => navigation.navigate(screenName.addAddress)}
            testID={'btnAddNewAddress'}
          />
        </>
      ) : (
        <View style={myAddressesStyles.listView}>
          {!dataFound() && EmptyListMessage()}
          <PrimaryButton
            title={strings.ctAddAddress}
            onPress={() => navigation.navigate(screenName.addAddress)}
            testID={'btnAddAddress'}
          />
        </View>
      )}
    </Background>
  );
};
