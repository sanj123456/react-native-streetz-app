import {Platform, StyleSheet} from 'react-native';
import {fonts} from '../../fonts';
import {colors} from '../../colors';
import {commonStyles} from '../../commonStyles';

export const myProfileStyles = StyleSheet.create({
  contentContainerStyle: {
    paddingHorizontal: '8%',
    paddingVertical: '8%',
  },
  profileWrapper: {
    alignSelf: 'center',
    height: 110,
    width: 110,
  },
  profilePic: {
    width: '100%',
    height: '100%',
    borderRadius: 55,
  },
  pickerWrapper: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  userName: {
    alignSelf: 'center',
    ...fonts.medium16,
    color: colors.black,
    marginTop: '4%',
  },
  infoHorizontal: {
    ...commonStyles.horizontalCenterStyles,
    marginTop: '1%',
    alignSelf: 'center',
  },
  infoTxt: {
    ...fonts.regular12,
    color: colors.infoText,
    paddingLeft: '1%',
  },
  contentWrapper: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: '3%',
  },
  itemWrapper: {
    width: '48%',
    borderRadius: 8,
    height: 92,
    marginTop: '3%',
    overflow: 'hidden',
  },
  itemText: {
    ...fonts.medium14,
    color: colors.white,
    alignSelf: 'flex-end',
  },
  deleteTxt: {
    ...fonts.regular12,
    color: colors.wishRed,
    alignSelf: 'center',
  },
  deleteView: {
    marginBottom: 20,
  },
  referralView: {
    width: '100%',
    marginTop: '10%',
  },
  referralTitle: {
    ...fonts.medium16,
    color: colors.primary,
  },
  referralWrapperView: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingHorizontal: '4%',
    marginTop: '3%',
    paddingVertical: '3%',
  },
  referralBottomView: {
    ...commonStyles.horizontalBetweenStyles,
    marginTop: '3%',
  },
  referralTxt: {
    ...fonts.light18,
    color: colors.black,
    marginTop: Platform.OS === 'ios' ? 2 : 0,
  },
  referralBgView: {
    backgroundColor: colors.referBg,
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 13,
  },
  inviteBlack: {
    ...fonts.light14,
  },
  invitePrimary: {
    ...fonts.light14,
    color: colors.primary,
  },
  inviteTxtView: {
    ...commonStyles.horizontalCenterStyles,
    flexWrap: 'wrap',
  },
  profileBlock: {
    width: '100%',
    height: '100%',
  },
  innerWrapper: {
    flex: 1,
    paddingHorizontal: '8%',
    paddingVertical: '7%',
    justifyContent: 'space-between',
  },
});
