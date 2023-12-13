import {StyleSheet} from 'react-native';
import {colors} from '../../colors';

export const invoiceStyles = StyleSheet.create({
  btnDownload: {
    height: 28,
    width: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: colors.primary,
    position: 'absolute',
    top: 10,
    right: 15,
    zIndex: 10,
  },
});
