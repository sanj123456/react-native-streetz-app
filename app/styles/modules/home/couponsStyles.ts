import {StyleSheet} from 'react-native';
import {commonStyles} from '../../commonStyles';
import {fonts} from '../../fonts';
import {colors} from '../../colors';

export const couponsStyles = StyleSheet.create({
  contentContainerStyle: {
    paddingVertical: '4%',
    paddingHorizontal: '4%',
  },
  contentContainerFlatListStyle: {
    paddingVertical: '1%',
    // paddingHorizontal: '1%',
  },
  couponWrapper: {
    ...commonStyles.horizontalBetweenStyles,
    marginTop: '3%',
    borderWidth: 0.5,
    borderColor: colors.dotBorder,
    borderStyle: 'dashed',
    paddingHorizontal: '2.5%',
    paddingVertical: '1%',
    marginBottom: '4%',
  },
  couponInput: {
    padding: 0,
    ...fonts.regular12,
    width: '70%',
    height: 35,
  },
  txtAllCoupon: {
    ...fonts.regular12,
    color: colors.primary,
  },
  itemWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '3%',
    backgroundColor: colors.white,
    borderRadius: 9,
    paddingHorizontal: '3%',
    paddingVertical: '2%',
    minHeight: 75,
  },
  leftView: {
    width: '65%',
  },
  txtLabel: {
    ...fonts.medium16,
    color: colors.primary,
  },
  txtDesc: {
    ...fonts.regular12,
    marginTop: '3%',
  },
  rightView: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  txtApply: {
    ...fonts.medium12,
    color: colors.primary,
  },
  txtCode: {
    ...fonts.regular12,
    color: colors.codeText,
  },
  Code: {
    ...fonts.medium14,
    color: colors.black,
    marginHorizontal: -2,
  },
});
