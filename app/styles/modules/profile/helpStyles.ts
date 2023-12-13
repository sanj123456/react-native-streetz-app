import {StyleSheet} from 'react-native';
import {fonts} from '../../fonts';
import {colors} from '../../colors';
import {commonStyles} from '../../commonStyles';

export const helpStyles = StyleSheet.create({
  contentContainerStyle: {
    paddingHorizontal: '4%',
    paddingBottom: '28%',
  },
  itemWrapper: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    paddingHorizontal: '4%',
    marginTop: '3%',
  },
  screenHeading: {
    ...fonts.medium16,
    color: colors.black,
    paddingHorizontal: '4%',
    paddingTop: '3%',
  },
  topWrapper: {
    ...commonStyles.horizontalBetweenStyles,
    height: 50,
  },
  txtItem1: {
    ...fonts.regular12,
    color: colors.white,
    paddingBottom: '3%',
  },
  txtOrderFrom: {
    ...fonts.regular12,
    color: colors.white,
    marginTop: -12,
  },
  orderWrapper: {
    ...commonStyles.horizontalBetweenStyles,
    backgroundColor: colors.white,
    borderRadius: 8,
    marginTop: '2.5%',
    paddingHorizontal: '3%',
    paddingVertical: '1%',
  },
  faqWrapper: {
    backgroundColor: colors.white,
    borderRadius: 8,
    marginTop: '2.5%',
    paddingHorizontal: '3%',
    paddingVertical: '1%',
    width: '100%',
  },
  viewWrapper: {
    paddingBottom: '3%',
  },
  leftView: {
    width: '60%',
    height: 35,
    justifyContent: 'space-between',
  },
  txtOrderTime: {
    width: '30%',
    textAlign: 'right',
    ...fonts.medium12,
  },
  imgLoc: {
    ...commonStyles.icon12,
    tintColor: colors.blackText,
    marginRight: 3,
  },
  btnContact: {
    alignSelf: 'center',
    marginTop: '10%',
  },
  txtContact: {
    ...fonts.regular14,
    color: colors.primary,
    textDecorationLine: 'underline',
  },
});
