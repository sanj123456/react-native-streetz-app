import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import {PrimaryText} from './PrimaryText';
import {CartBadgeProps} from '../types/components';
import {useSelector} from 'react-redux';
import {RootState} from '../redux';
import {colors, fonts} from '../styles';

export const CartBadge: FC<CartBadgeProps> = ({style, type}) => {
  const myCart = useSelector((state: RootState) => state?.cart?.myCart);
  const notificationCount = useSelector(
    (state: RootState) => state?.notification?.notificationCount,
  );

  if (notificationCount > 0 && type === 'notification') {
    return (
      <View
        style={{
          ...styles.mainView,
          ...style,
        }}
        testID={'CartMainView'}>
        <PrimaryText
          style={
            myCart?.items?.length > 9 ? styles.mainTextTwo : styles.mainText
          }
          testID={'CartMainText'}>
          {notificationCount > 9 ? '9+' : notificationCount}
        </PrimaryText>
      </View>
    );
  }
  if (myCart?.items?.length > 0 && (!type || type === 'cart')) {
    return (
      <View
        style={{
          ...styles.mainView,
          ...style,
        }}
        testID={'CartMainView'}>
        <PrimaryText
          style={
            myCart?.items?.length > 9 ? styles.mainTextTwo : styles.mainText
          }
          testID={'CartMainText'}>
          {myCart?.items?.length > 9 ? '9+' : myCart?.items?.length}
        </PrimaryText>
      </View>
    );
  }
  return null;
};

const styles = StyleSheet.create({
  mainView: {
    height: 18,
    width: 18,
    borderRadius: 9,
    backgroundColor: colors.pureRed,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 100,
  },
  mainText: {
    ...fonts.regularSecondary12,
    color: colors.white,
  },
  mainTextTwo: {
    ...fonts.regularSecondary10,
    color: colors.white,
  },
});
