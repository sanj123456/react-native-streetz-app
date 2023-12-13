import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React, {FC, useState} from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import {images, screenName} from '../core';
import {colors, commonStyles} from '../styles';
import {getCurrentRoute} from './RootNavigation';
import {Home} from '../modules/home/Home';
import {Cart} from '../modules/home/Cart';
import {TabCategory} from '../modules/home/TabCategory';
import {Stores} from '../modules/home/Stores';
import {CartBadge} from '../components';
import DeviceInfo from 'react-native-device-info';

const Tab = createBottomTabNavigator();
const hideTabBarArray: any[] = [];

export const TabNavigator: FC = ({}) => {
  /******** Destructured Props ********/

  /******* Hooks Function *******/
  const {width} = useWindowDimensions();

  /******* Main Function *******/

  const renderTabItem = (
    focused: boolean,
    tabImage: any,
    type?: 'cart' | undefined,
  ) => {
    return (
      <View style={{...styles.tabItemWrapper, width: width / 5}}>
        {type === 'cart' && <CartBadge style={styles.badgeStyles} />}
        <Image
          style={{
            ...commonStyles.icon25,
          }}
          source={tabImage}
        />
        {focused && <View style={styles.tabActiveBar} />}
      </View>
    );
  };

  const hideTabBarFunction = () => {
    return hideTabBarArray.includes(getCurrentRoute());
  };

  return (
    <Tab.Navigator
      initialRouteName={screenName.tabHome}
      sceneContainerStyle={{
        backgroundColor: colors.transparent,
      }}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          ...styles.tabBarStyles,
          display: hideTabBarFunction() ? 'none' : 'flex',
        },
        tabBarShowLabel: false,
      }}>
      <Tab.Screen
        name={screenName.tabHome}
        options={{
          tabBarIcon: ({focused}) => renderTabItem(focused, images.tabHome),
        }}
        component={Home}
      />
      <Tab.Screen
        name={screenName.tabCategory}
        options={{
          tabBarIcon: ({focused}) => renderTabItem(focused, images.tabCategory),
        }}
        component={TabCategory}
      />
      <Tab.Screen
        name={screenName.tabStore}
        options={{
          tabBarIcon: ({focused}) => renderTabItem(focused, images.tabStore),
        }}
        component={Stores}
      />
      <Tab.Screen
        name={screenName.tabCart}
        options={{
          tabBarIcon: ({focused}) =>
            renderTabItem(focused, images.tabCart, 'cart'),
        }}
        component={Cart}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarStyles: {
    height: Platform.OS === 'ios' ? 88 : 70,
    backgroundColor: colors.primary,
    paddingHorizontal: '10%',
    position: 'absolute',
  },
  tabItemWrapper: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
  },
  tabActiveBar: {
    height: 4,
    width: 28,
    backgroundColor: colors.white,
    borderRadius: 5,
    marginTop: 5,
  },
  badgeStyles: {
    top: Platform.OS === 'ios' && DeviceInfo.hasNotch() === false ? 25 : 12,
    right: '27%',
  },
});
