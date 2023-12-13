import {StyleSheet} from 'react-native';
import {perfectSize} from '../../../core';
import {colors} from '../../colors';

export const locationStyles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoStyle: {
    height: perfectSize(300),
    width: perfectSize(300),
  },

  darkButton: {
    backgroundColor: colors.darkButton,
    marginTop: perfectSize(10),
  },
});
