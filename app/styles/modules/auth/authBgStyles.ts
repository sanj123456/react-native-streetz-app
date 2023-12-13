import {StyleSheet} from 'react-native';
import {colors} from '../../colors';
import {perfectSize} from '../../../core';
import {fonts} from '../../fonts';

export const authBgStyles = StyleSheet.create({
  root: {
    minHeight: '100%',
  },
  container: {
    backgroundColor: colors.primary,
    height: '38%',
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
    paddingHorizontal: '5%',
  },
  smallTextStyle: {
    ...fonts.regular18,
    color: colors.white,
    marginBottom: perfectSize(5),
    paddingHorizontal: '5%',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  containContainer: {
    flex: 1,
    paddingHorizontal: perfectSize(45),
    paddingTop: perfectSize(80),
  },

  contentContainerStyle: {
    flexGrow: 1,
    paddingHorizontal: perfectSize(45),
    paddingTop: perfectSize(80),
    paddingBottom: perfectSize(100),
  },
});
