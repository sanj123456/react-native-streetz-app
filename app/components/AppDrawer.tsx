/* eslint-disable react-native/no-inline-styles */
import {DrawerActions, useNavigation} from '@react-navigation/native';
import React, {FC, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import {images, screenName} from '../core';
import {strings} from '../i18n';
import {colors, commonStyles, fonts} from '../styles';
import {PrimaryText} from './PrimaryText';
import {PrimaryButton} from './PrimaryButton';
import {useSelector} from 'react-redux';
import {RootState} from '../redux';
import {getNotificationCountAPI, logoutAPI} from '../services';
import Config from 'react-native-config';
import {CartBadge} from './CartBadge';
import {useDrawerStatus} from '@react-navigation/drawer';

export const AppDrawer: FC = () => {
  const navigation: any = useNavigation();
  const drawerData: {
    label: string;
    screen: string;
    icon: any;
    protected: boolean;
  }[] = [
    {
      label: strings.ctHome,
      screen: screenName.tabHome,
      icon: images.menuHome,
      protected: false,
    },
    {
      label: strings.ctStores,
      screen: screenName.tabStore,
      icon: images.menuStore,
      protected: false,
    },
    {
      label: strings.ctMyCart,
      screen: screenName.tabCart,
      icon: images.menuCart,
      protected: false,
    },
    {
      label: strings.ctUpcomingOrder,
      screen: screenName.orderHistory,
      icon: images.icUpcomingOrder,
      protected: true,
    },
    {
      label: strings.ctMyProfile,
      screen: screenName.profileStack,
      icon: images.icProfile,
      protected: true,
    },
    {
      label: strings.ctWishlist,
      screen: screenName.wishlistStack,
      icon: images.icWishlist,
      protected: true,
    },
    {
      label: strings.ctNotification,
      screen: screenName.notificationStack,
      icon: images.icNotification,
      protected: true,
    },
    {
      label: strings.ctHelp,
      screen: screenName.menuHelp,
      icon: images.icHelp,
      protected: false,
    },
  ];

  const otherData: {
    label: string;
    screen: string;
    protected: boolean;
    url: any;
  }[] = [
    {
      label: strings.ctRefundPolicy,
      screen: screenName.policyView,
      protected: false,
      url: Config.REFUND_POLICY_URL,
    },
    {
      label: strings.ctShippingPolicy,
      screen: screenName.policyView,
      protected: false,
      url: Config.SHIPPING_POLICY_URL,
    },
    {
      label: strings.ctPrivacyPolicy,
      screen: screenName.policyView,
      protected: false,
      url: Config.PRIVACY_POLICY_URL,
    },
    {
      label: strings.ctTermsConditions,
      screen: screenName.policyView,
      protected: false,
      url: Config.TERMS_AND_CONDITIONS_URL,
    },
  ];

  /********* Hooks Functions **********/
  const profileData = useSelector(
    (state: RootState) => state.profile.profileData,
  );
  const myLocation = useSelector(
    (state: RootState) => state?.generic?.myLocation,
  );

  const isOpen: boolean = useDrawerStatus() === 'open';

  useEffect(() => {
    if (isOpen) {
      getNotificationCountAPI();
    }
  }, [isOpen]);

  /********* Main Functions **********/

  const handleOptionPress =
    (
      item: {label: string; screen: string; icon?: any; protected: boolean},
      index: number,
    ) =>
    () => {
      if (index < 4) {
        navigation.navigate(screenName.homeStack);
        setTimeout(() => {
          navigation.navigate(item.screen);
        }, 400);
      } else {
        navigation.navigate(item.screen);
      }
    };

  const handleCloseDrawer = () => {
    navigation.dispatch(DrawerActions.closeDrawer());
  };

  const logout = async () => {
    logoutAPI();
  };

  const handlePolicyOptionPress =
    (item: {label: string; screen: string; icon?: any; url: any}) => () => {
      navigation.navigate(item.screen, {
        label: item?.label,
        url: item?.url,
      });
    };

  return (
    <View style={styles.mainView}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{zIndex: 5}}
        contentContainerStyle={styles.contentContainerStyle}
        testID={'AppDrawerScroll'}>
        <View style={styles.topView} testID={'AppDrawerTopView'}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleCloseDrawer}
            style={styles.crossButton}
            testID={'AppDrawerCloseOpacity'}>
            <Image
              style={commonStyles.icon28}
              source={images.icClose}
              testID={'AppDrawerImageClose'}
            />
          </TouchableOpacity>
          <View style={styles.profileView} testID={'AppDrawerProfileView'}>
            <View
              style={styles.profileSideView}
              testID={'AppDrawerProfileSideView'}>
              <PrimaryText
                style={styles.profileName}
                testID={'AppDrawerProfileName'}>
                {profileData?.first_name
                  ? `${profileData?.first_name} ${profileData?.last_name}`
                  : strings.ctHeyUser}
              </PrimaryText>
              {myLocation?.address && (
                <View
                  style={commonStyles.horizontalCenterStyles}
                  testID={'AppDrawerHorizontalView'}>
                  <Image
                    style={commonStyles.icon12}
                    source={images.icPin}
                    testID={'AppDrawerImagePin'}
                  />
                  <PrimaryText
                    props={{numberOfLines: 1}}
                    style={styles.address}
                    testID={'AppDrawerAddressText'}>
                    {myLocation?.address}
                  </PrimaryText>
                </View>
              )}
            </View>
          </View>
        </View>
        {drawerData.map((item, index) => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleOptionPress(item, index)}
            style={styles.itemWrapper}
            key={`${index}_drawerListItem`}
            testID={`${index}_AppDrawerHandleOption`}>
            <View>
              {(item?.label === strings.ctMyCart ||
                item?.label === strings.ctNotification) && (
                <CartBadge
                  type={
                    item?.label === strings.ctMyCart ? 'cart' : 'notification'
                  }
                  style={styles.badgeStyles}
                />
              )}
              <Image style={styles.iconImage} source={item.icon} />
            </View>
            <PrimaryText style={styles.itemText}>{item.label}</PrimaryText>
          </TouchableOpacity>
        ))}
        <View style={styles.bottomViewStyle} testID={'AppDrawerBottomView'}>
          {otherData?.map((item, index) => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handlePolicyOptionPress(item)}
              style={styles.itemWrapper}
              key={`${index}_drawerListItem2`}
              testID={`${index}_AppDrawerPolicyOption`}>
              <PrimaryText style={styles.itemText}>{item.label}</PrimaryText>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <View style={styles.logoutWrapper} testID={'AppDrawerViewLogout'}>
        <PrimaryButton
          onPress={logout}
          title={strings.ctLogout}
          testID={'AppDrawerLogoutButton'}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: '5%',
  },
  topView: {
    width: '84%',
    paddingVertical: '5%',
  },
  crossButton: {
    alignSelf: 'flex-end',
  },
  profileView: {
    ...commonStyles.horizontalCenterStyles,
    marginTop: '5%',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileSideView: {
    width: '78%',
    paddingHorizontal: '3%',
  },
  profileName: {
    ...fonts.medium16,
    color: colors.primary,
    marginBottom: '2%',
  },
  address: {
    ...fonts.regular10,
    paddingLeft: '2%',
  },
  contentContainerStyle: {
    marginTop: '3%',
  },
  itemWrapper: {
    width: '100%',
    paddingVertical: '3%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconImage: {
    ...commonStyles.icon28,
    marginRight: '3%',
    tintColor: colors.primary,
  },
  itemText: {
    ...fonts.regular16,
    color: colors.black,
    width: '83%',
    marginTop: Platform.OS === 'ios' ? 5 : 0,
  },
  bottomViewStyle: {
    width: '100%',
    borderTopWidth: 1,
    borderColor: colors.borderColor,
    marginTop: '5%',
    paddingVertical: '5%',
  },
  bottomImage: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
    marginRight: 10,
  },
  copyRightText: {
    ...fonts.regular12,
    color: colors.white,
  },
  logoutWrapper: {
    width: '70%',
    paddingBottom: '15%',
    paddingTop: '5%',
  },
  badgeStyles: {
    top: -2,
    right: 5,
  },
});
