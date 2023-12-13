import {createDrawerNavigator} from '@react-navigation/drawer';
import React, {FC} from 'react';
import {AppDrawer} from '../components';
import {screenName} from '../core';
import {HomeStack} from '../modules/home';
import {ProfileStack} from '../modules/profile';
import {WishlistStack} from '../modules/wishlist';
import {NotificationStack} from '../modules/notification';
import {Help} from '../modules/profile/Help';
import {colors, commonStyles} from '../styles';
import {View, SafeAreaView, StatusBar} from 'react-native';
import {PolicyView} from '../modules/home/PolicyView';
import {useSelector} from 'react-redux';
import {RootState} from '../redux';
import {GPSAndroidModal} from '../components';

const Drawer = createDrawerNavigator();

const renderAppDrawer = (props: any) => {
  return <AppDrawer {...props} />;
};

export const AppNavigator: FC = () => {
  const homeSafeArea = useSelector(
    (state: RootState) => state?.generic?.homeSafeArea,
  );
  const catSafeArea = useSelector(
    (state: RootState) => state?.generic?.catSafeArea,
  );
  const showAndroidEnabler = useSelector(
    (state: RootState) => state?.generic?.showAndroidEnabler,
  );

  return (
    <View style={commonStyles.flex1}>
      <StatusBar barStyle={'light-content'} backgroundColor={colors.primary} />
      <SafeAreaView
        style={{
          backgroundColor:
            homeSafeArea || catSafeArea ? colors.primary : colors.primary,
        }}
      />

      <GPSAndroidModal visible={showAndroidEnabler} />

      <Drawer.Navigator
        screenOptions={{
          sceneContainerStyle: {
            backgroundColor: colors.transparent,
          },
          swipeEnabled: false,
          drawerStyle: {marginLeft: '20%', width: '100%'},
          drawerType: 'front',
          headerShown: false,
          drawerPosition: 'right',
        }}
        drawerContent={renderAppDrawer}>
        <Drawer.Screen name={screenName.homeStack} component={HomeStack} />
        <Drawer.Screen
          name={screenName.profileStack}
          component={ProfileStack}
        />

        <Drawer.Screen
          name={screenName.wishlistStack}
          component={WishlistStack}
          options={{unmountOnBlur: true}}
        />
        <Drawer.Screen
          name={screenName.notificationStack}
          component={NotificationStack}
        />
        <Drawer.Screen name={screenName.menuHelp} component={Help} />
        <Drawer.Screen name={screenName.policyView} component={PolicyView} />
      </Drawer.Navigator>
    </View>
  );
};
