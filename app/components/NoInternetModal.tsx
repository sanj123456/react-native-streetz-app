/* eslint-disable prettier/prettier */
import {Image, StyleSheet, View, Text} from 'react-native';
// eslint-disable-next-line prettier/prettier
import {colors} from '../styles';
import {consoleHere, images, perfectSize, screenName} from '../core';
import {PrimaryButton} from './PrimaryButton';
import {fontFamily} from '../styles/fonts';
import {useSelector} from 'react-redux';
import {RootState, dispatch} from '../redux';
import React, {FC, useEffect, useRef, useState} from 'react';
import NetInfo from '@react-native-community/netinfo';
import {setNoInternet} from '../redux/modules/genericSlice';
import {resetNavigation} from '../navigation/RootNavigation';
import {NoInternetProps} from '../types/components';
import {strings} from '../i18n';

const NoInternetModal: FC<NoInternetProps> = () => {
  const noInternet = useSelector(
    (state: RootState) => state?.generic?.noInternet,
  );
  const timeout = useRef<any>(null);

  const [timer, setTimer] = useState(false);
  const [isNet, setIsNet] = useState(false);

  const profileData = useSelector(
    (state: RootState) => state.profile.profileData,
  );
  const isIntroSkipped = useSelector(
    (state: RootState) => state.generic.intro_skip,
  );
  const isLocationSkipped = useSelector(
    (state: RootState) => state.generic.location_entered_skip,
  );

  useEffect(() => {
    timeout.current = setTimeout(() => {
      setTimer(true);
    }, 6000);
    // Subscribe
    const unsubscribe = NetInfo.addEventListener(state => {
      consoleHere({InternetInfo: state?.isInternetReachable});
      if (state?.isInternetReachable === true) {
        setIsNet(true);
      }

      if (state?.isInternetReachable === false) {
        setIsNet(false);
        dispatch(setNoInternet(true));
      }
    });

    return () => {
      clearTimeout(timeout.current);
      unsubscribe();
    };
  }, []);

  const tryAgainHandler = () => {
    if (isNet === true) {
      dispatch(setNoInternet(false));
      if (profileData && isIntroSkipped && isLocationSkipped) {
        resetNavigation(screenName.app);
      }
    }
  };
  if (noInternet && timer) {
    return (
      <View style={styles.root} testID={`NoInternetModal`}>
        <Image
          source={images.icNoInternet}
          style={styles.image}
          testID={`IcNoInternet`}
        />
        <Text style={styles.text} testID={`OopsText`}>
          {strings.ctOops}
        </Text>
        <Text style={styles.text2} testID={`NoInternetText`}>
          {strings.ctNoInternet}
        </Text>
        <PrimaryButton
          title="Try Again"
          onPress={tryAgainHandler}
          style={styles.buttonStyle}
          testID={`NoInternetTryAgain`}
        />
      </View>
    );
  }
  return null;
};
export default NoInternetModal;
const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    zIndex: 1,
    position: 'absolute',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    backgroundColor: colors.white,
    marginTop: 0,
    paddingHorizontal: 50,
  },
  image: {
    height: perfectSize(290),
    width: perfectSize(290),
  },
  text: {
    color: colors.primary,
    fontSize: 28,
    marginTop: 40,
    fontFamily: fontFamily.primaryBold,
  },
  text2: {
    fontFamily: fontFamily.primaryRegular,
    color: colors.blackText,
    fontSize: 18,
    marginTop: 10,
    textAlign: 'center',
  },
  buttonStyle: {
    marginTop: 30,
  },
});
