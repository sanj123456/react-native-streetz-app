import {StyleSheet} from 'react-native';
import {fonts} from '../../fonts';
import {commonStyles} from '../../commonStyles';
import {colors} from '../../colors';

export const loginStyles = StyleSheet.create({
  bottomWrapper: {
    marginTop: '12%',
  },
  orImage: {
    width: '50%',
    height: 40,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  txtLoginWith: {
    ...fonts.regular14,
    alignSelf: 'center',
    marginTop: '2%',
  },
  socialView: {
    ...commonStyles.horizontalCenterStyles,
    alignSelf: 'center',
    marginTop: '4%',
  },
  socialItem: {
    width: 42,
    height: 42,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialImage: {
    ...commonStyles.icon21,
  },

  txtSignUp: {
    ...fonts.regular14,
    color: colors.primary,
    marginLeft: '5%',
  },
  errorView: {
    paddingHorizontal: 18,
  },
  icLogo: {
    height: 90,
    width: 90,
    resizeMode: 'contain',
  },
});
