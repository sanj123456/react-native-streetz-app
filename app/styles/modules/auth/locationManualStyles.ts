import {StyleSheet} from 'react-native';
import {colors} from '../../colors';
import {perfectSize} from '../../../core';
import {fonts} from '../../fonts';

export const locationManualStyles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    backgroundColor: colors.primary,
    height: '35%',
    padding: perfectSize(20),
  },
  logo: {
    height: perfectSize(85),
    width: perfectSize(85),
    alignSelf: 'flex-end',
  },
  textStyle: {
    ...fonts.extraBold30,
    color: colors.white,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  inputViewStyles: {
    height: 38,
    backgroundColor: colors.white,
    paddingHorizontal: '5%',
    marginTop: 12,
  },
  inputStyles: {
    ...fonts.regular15,
  },
});
