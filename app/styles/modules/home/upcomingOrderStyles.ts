import {StyleSheet} from 'react-native';
import {colors} from '../../colors';
import {fonts} from '../../fonts';

export const upcomingOrderStyles = StyleSheet.create({
  contentContainerStyle: {
    paddingHorizontal: '4%',
    paddingBottom: '8%',
    minHeight: '100%',
  },
  orderDetailsWrapper: {
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: '4%',
    paddingVertical: '4%',
    marginTop: '4%',
  },
  leftView: {
    width: '60%',
  },
  rightView: {
    width: '40%',
    alignItems: 'flex-end',
  },
  userName: {
    ...fonts.medium16,
    color: colors.primary,
    marginBottom: 5,
  },
  txtLocation: {
    ...fonts.regular12,
    marginLeft: '2%',
  },
  txtStatusGreen: {
    ...fonts.medium12,
    color: colors.greenBg,
    marginTop: '10%',
    width: '90%',
    textAlign: 'right',
  },
  txtItemsInclude: {
    ...fonts.medium14,
    marginTop: '2%',
    marginBottom: '1%',
  },
  leftProductView: {
    width: '70%',
  },
  txtProduct: {
    ...fonts.regular12,
    marginTop: '1%',
  },
  txtPrice: {
    ...fonts.regular16,
    color: colors.primary,
    alignSelf: 'flex-end',
  },
  txtButtonWrapper: {
    flexDirection: 'row',
    width: '65%',
    justifyContent: 'space-between',
    paddingTop: '3%',
  },
  txtButton: {
    ...fonts.medium14,
    color: colors.primary,
  },
});
