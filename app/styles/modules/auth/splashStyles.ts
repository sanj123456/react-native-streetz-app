import {Platform, StyleSheet} from 'react-native';
import {fonts} from '../../fonts';
import {colors} from '../../colors';

export const splashStyles = StyleSheet.create({
  video: {
    width: '100%',
    height: '100%',
  },
  floatingView: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 100,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: '5%',
    paddingVertical: '8%',
  },
  txtOuterLine: {
    height: 66,
    width: 209,
    resizeMode: 'contain',
    top: Platform.OS === 'android' ? 0 : -10,
  },
  imgLogo: {
    height: 110,
    width: 110,
    resizeMode: 'contain',
  },
  txtHeading: {
    ...fonts.extraBold30,
    marginTop: '2%',
  },
  txtDesc: {
    ...fonts.regular16,
    marginTop: '1%',
    lineHeight: 26,
    color: colors.primary,
  },
});
