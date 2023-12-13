/* eslint-disable react-native/no-inline-styles */
import {
  CommonActions,
  DrawerActions,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, {FC} from 'react';
import {View, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {constants, images, screenName} from '../core';
import {colors, commonStyles, fonts} from '../styles';
import {PrimaryHeaderProps} from '../types/components';
import {PrimaryText} from './PrimaryText';
import {strings} from '../i18n';
import {useSelector} from 'react-redux';
import {RootState, dispatch} from '../redux';
import {resetNavigation} from '../navigation/RootNavigation';
import {loginAlert} from '../core/genericUtils';
import {removeAsyncData} from '../services';
import {CartBadge} from './CartBadge';
import {setFilterList, setStoreFilterList} from '../redux/modules/homeSlice';

export const PrimaryHeader: FC<PrimaryHeaderProps> = ({
  title,
  left,
  right,
  screen_from,
  searchType,
  onDetailSearch,
  isHome,
  transparent,
}) => {
  /********** Props and Data destructuring *********/

  /********** Hooks Functions *********/

  const userType = useSelector((state: RootState) => state.profile.userType);
  const myLocation = useSelector(
    (state: RootState) => state?.generic?.myLocation,
  );

  const navigation: any = useNavigation();
  const route = useRoute();

  const handleOpenDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };
  const handleGoBack = async () => {
    if (screen_from === 'WishList') {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: screenName.wishlistStack}],
        }),
      );
      return;
    }
    if (screen_from === 'payment' || screen_from === 'notification') {
      resetNavigation(screenName.app);
      return;
    }
    if (screen_from === 'Login') {
      await removeAsyncData(constants.asyncLoginData);
    }
    if (screen_from === 'store') {
      dispatch(setStoreFilterList([]));
    }
    navigation.goBack();
  };
  const handleAddress = () => {
    navigation.navigate(screenName.myAddresses);
  };

  return (
    <View
      style={{
        ...commonStyles.primaryHeaderStyles,
        backgroundColor: transparent
          ? colors.transparent
          : left === 'location'
          ? colors.primary
          : colors.primary,
        borderBottomLeftRadius: isHome ? 0 : 10,
        borderBottomRightRadius: isHome ? 0 : 10,
      }}>
      <View
        style={{
          ...commonStyles.primaryHeaderLeftSide,
        }}>
        {left === 'back' && (
          <TouchableOpacity
            activeOpacity={0.8}
            hitSlop={commonStyles.hitSlop5}
            testID="btnBackHeader"
            onPress={handleGoBack}>
            <Image style={commonStyles.icon29} source={images.icBack} />
          </TouchableOpacity>
        )}
        {left === 'location' && (
          <TouchableOpacity
            testID={'AddressBtn'}
            activeOpacity={0.8}
            onPress={() => {
              userType === 'guest' ? loginAlert(route.name) : handleAddress();
            }}
            style={{
              width: '80%',
              paddingTop: 8,
              paddingBottom: 5,
            }}>
            <View>
              <PrimaryText
                style={{
                  ...fonts.medium12,
                  color: colors.white,
                }}>
                {strings.ctDeliveryIn}
              </PrimaryText>
              <PrimaryText
                style={{
                  ...fonts.medium20,
                  color: colors.white,
                }}>
                {strings.ctDeliveryMinutes(2)}
              </PrimaryText>
              <PrimaryText
                props={{numberOfLines: 1}}
                style={{
                  ...fonts.regular12,
                  color: colors.white,
                }}>
                {myLocation?.address}
              </PrimaryText>
            </View>
          </TouchableOpacity>
        )}

        {title && (
          <PrimaryText
            props={{numberOfLines: 1}}
            testID="txtHeaderTitle"
            style={commonStyles.primaryHeaderLabelStyles}>
            {title}
          </PrimaryText>
        )}
      </View>

      <View style={commonStyles.primaryHeaderRightSide}>
        {(right === 'search_plus_menu' ||
          right === 'search_plus_cart_plus_menu') && (
          <TouchableOpacity
            activeOpacity={0.8}
            hitSlop={commonStyles.hitSlop5}
            testID="btnSearchHeader"
            onPress={() => {
              searchType === 'storeDetail' || searchType === 'category'
                ? onDetailSearch
                  ? onDetailSearch()
                  : null
                : navigation.navigate(screenName.search);
            }}>
            <Image
              style={commonStyles.icon29}
              source={
                left === 'location'
                  ? images.icWhiteSearch
                  : images.icWhiteSearch
              }
            />
          </TouchableOpacity>
        )}
        {(right === 'cart_plus_menu' ||
          right === 'search_plus_cart_plus_menu') && (
          <TouchableOpacity
            activeOpacity={0.8}
            hitSlop={commonStyles.hitSlop5}
            testID="btnCartHeader"
            onPress={() => navigation.navigate(screenName.cart)}>
            <CartBadge style={styles.badgeStyles} />
            <Image
              style={{
                ...commonStyles.icon29,
                marginLeft: right === 'search_plus_cart_plus_menu' ? 8 : 0,
              }}
              source={images.icCart}
            />
          </TouchableOpacity>
        )}
        {right === 'home_plus_menu' && (
          <TouchableOpacity
            activeOpacity={0.8}
            hitSlop={commonStyles.hitSlop5}
            testID="btnHomeHeader"
            onPress={() => resetNavigation(screenName.app)}>
            <Image style={commonStyles.icon29} source={images.icHomeButton} />
          </TouchableOpacity>
        )}
        {right === 'help' && (
          <TouchableOpacity
            activeOpacity={0.8}
            hitSlop={commonStyles.hitSlop5}
            testID="btnHelpHeader"
            onPress={() => navigation.navigate(screenName.help)}>
            <Image style={commonStyles.icon29} source={images.icHelpHeader} />
          </TouchableOpacity>
        )}
        {(right === 'search_plus_menu' ||
          right === 'menu' ||
          right === 'cart_plus_menu' ||
          right === 'home_plus_menu' ||
          right === 'search_plus_cart_plus_menu') && (
          <TouchableOpacity
            activeOpacity={0.8}
            hitSlop={commonStyles.hitSlop5}
            testID="btnMenuHeader"
            style={{marginLeft: 8}}
            onPress={() => handleOpenDrawer()}>
            <Image
              style={commonStyles.icon29}
              source={
                left === 'location' ? images.icWhiteMenu : images.icWhiteMenu
              }
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  badgeStyles: {
    top: -3,
    right: -5,
  },
});
