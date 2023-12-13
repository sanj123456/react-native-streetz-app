import {StyleSheet} from 'react-native';
import {colors} from '../../colors';
import {commonStyles} from '../../commonStyles';
import {fonts} from '../../fonts';

export const addAddressStyles = StyleSheet.create({
  contentContainerStyle: {
    paddingHorizontal: '4%',
    paddingVertical: '3%',
  },
  horizontalView: {
    ...commonStyles.horizontalBetweenStyles,
    alignItems: 'flex-start',
  },
  fieldWrapperFifty: {
    width: '48%',
  },
  inputViewStyles: {
    height: 54,
    backgroundColor: colors.white,
    paddingHorizontal: '5%',
    marginTop: 12,
  },
  btnAddAddress: {
    alignSelf: 'center',
  },
  errorView: {
    paddingHorizontal: 18,
  },
  errorViewFifty: {
    paddingHorizontal: 18,
  },
  inputStyles: {
    ...fonts.regular15,
  },
  saveText: {
    ...fonts.regular14,
    color: colors.blackText,
    marginVertical: 8,
    marginLeft: 7,
  },
  addressView: {
    flexDirection: 'row',
  },
});
