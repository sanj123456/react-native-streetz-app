/* eslint-disable react-native/no-inline-styles */
import {FC} from 'react';
import {Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {images, perfectSize} from '../core';
import {colors, fonts} from '../styles';
import {strings} from '../i18n';
import {PrimaryText} from './PrimaryText';
import {GPSAndroidModalHeaderProps} from '../types/components';

export const GPSAndroidModalHeader: FC<GPSAndroidModalHeaderProps> = props => {
  const {onPress} = props;
  return (
    <View style={styles.header} testID={`GPSAndroidModalView`}>
      <View
        style={{
          flex: 1,
          marginRight: perfectSize(10),
        }}
        testID={`GPSAndroidModalMainView`}>
        <View style={styles.titleView} testID={`GPSAndroidModalTitleView`}>
          <FastImage
            source={images.icGpsLocation}
            style={styles.locationImg}
            resizeMode="contain"
          />
          <PrimaryText
            style={styles.whiteTitle}
            testID={`GPSAndroidModalTitle`}>
            {strings.msgAndroidLocationModalTitle}
          </PrimaryText>
        </View>
        <PrimaryText
          style={styles.whiteSubTitle}
          testID={`GPSAndroidModalSubTitle`}>
          {strings.msgAndroidLocationModalSubTitle}
        </PrimaryText>
      </View>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.grantBnt}
        onPress={onPress}
        testID={`GPSAndroidModalGrantBnt`}>
        <PrimaryText
          style={styles.bntPrimaryText}
          testID={`GPSAndroidModalBtGrant`}>
          {strings.btGrant}
        </PrimaryText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  whiteTitle: {
    ...fonts.medium16,
    color: colors.white,
    marginTop: Platform.OS === 'ios' ? 5 : 0,
  },

  whiteSubTitle: {
    color: colors.white,
    marginTop: 8,
  },
  header: {
    backgroundColor: colors.primary,
    paddingVertical: perfectSize(20),
    paddingHorizontal: perfectSize(20),
    flexDirection: 'row',
  },
  titleView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '95%',
  },
  locationImg: {
    height: perfectSize(20),
    width: perfectSize(20),
    marginRight: 7,
  },
  grantBnt: {
    height: 30,
    width: 70,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  bntPrimaryText: {
    ...fonts.heading14,
  },
});
