import {StyleSheet} from 'react-native';
import {colors} from '../../colors';
import {fonts} from '../../fonts';

export const verifyOtpStyles = StyleSheet.create({
  contentContainerStyle: {
    paddingHorizontal: '8%',
  },
  btnBack: {
    position: 'absolute',
    top: '3%',
    left: '8%',
  },
  inputViewStyles: {
    marginTop: '10%',
  },
  bottomWrapper: {
    marginTop: '40%',
  },
  otpView: {
    width: '100%',
    height: 45,
    marginTop: '4%',
  },
  underlineStyleBase: {
    width: 60,
    height: 45,
    borderWidth: 0.8,
    borderColor: colors.primary,
    borderRadius: 7,
    alignSelf: 'center',
    borderBottomWidth: 0.8,
    ...fonts.regular18,
  },
  btnResend: {
    marginTop: '4%',
    alignSelf: 'flex-end',
  },
  txtResend: {
    color: colors.primary,
  },
});
