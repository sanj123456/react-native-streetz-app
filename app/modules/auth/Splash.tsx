/* eslint-disable react-hooks/exhaustive-deps */
import {FC, useEffect, useRef} from 'react';
import {AppState, Image, ImageBackground, StatusBar, View} from 'react-native';
import {colors, commonStyles, splashStyles} from '../../styles';
import {appUpdateAlert, constants, images, screenName} from '../../core';
import {PrimaryText} from '../../components';
import {strings} from '../../i18n';
import {RootState, dispatch} from '../../redux';
import Video from 'react-native-video';
import {resetNavigation} from '../../navigation/RootNavigation';
import {SafeAreaView} from 'react-native';
import {useSelector} from 'react-redux';
import {setInitiateNotification} from '../../redux/modules/genericSlice';
import {getAsyncData} from '../../services';

export const Splash: FC = () => {
  const initiateNotification = useSelector(
    (state: RootState) => state?.generic?.initiateNotification,
  );
  const appState = useRef(AppState.currentState);
  useEffect(() => {
    setTimeout(() => {
      getIntroSkip();
    }, 4000);
  }, []);

  const getIntroSkip = async () => {
    const isIntroSkipped = await getAsyncData(constants.asyncIntroSkip);
    const isLocationSkip = await getAsyncData(
      constants.asyncLocationEnteredSkip,
    );
    const profileData = await getAsyncData(constants.asyncUserToken);
    if (profileData && isLocationSkip && isIntroSkipped) {
      handleNavigation(screenName.app);
    } else if (profileData && !isLocationSkip && isIntroSkipped) {
      handleNavigation(screenName.locationEntered);
    } else if (!profileData && !isLocationSkip && isIntroSkipped) {
      handleNavigation(screenName.auth);
    } else if (!profileData && isLocationSkip && isIntroSkipped) {
      handleNavigation(screenName.auth);
    } else if (!profileData && !isLocationSkip && !isIntroSkipped) {
      handleNavigation(screenName.intro);
    }
  };

  const handleNavigation = (screen: any) => {
    appUpdateAlert();
    resetNavigation(screen);
    if (!initiateNotification) {
      dispatch(setInitiateNotification(true));
    }
  };

  return (
    <View style={commonStyles.mainView}>
      <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
      <Video
        source={images.vidSplash}
        resizeMode="cover"
        style={splashStyles.video}
      />
      <ImageBackground
        resizeMethod="scale"
        resizeMode="stretch"
        style={splashStyles.floatingView}
        source={images.dummySplashEffect}>
        <SafeAreaView />
        <View style={splashStyles.contentContainer}>
          <Image
            style={splashStyles.txtOuterLine}
            source={images.dummySplashText}
          />

          <View>
            <Image style={splashStyles.imgLogo} source={images.icLogo} />
            <PrimaryText style={splashStyles.txtHeading}>
              {strings.ctStreetzHyperlocal}
            </PrimaryText>
            <PrimaryText style={splashStyles.txtDesc}>
              {strings.ctQuickDeliveries}
            </PrimaryText>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};
