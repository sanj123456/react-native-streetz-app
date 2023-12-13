import {StyleSheet} from 'react-native';
import {commonStyles} from '../../commonStyles';
import {colors} from '../../colors';
import {fonts} from '../../fonts';

export const signupStyles = StyleSheet.create({
  contentContainerStyle: {
    paddingHorizontal: '8%',
    paddingBottom: 60,
  },
  btnBack: {
    position: 'absolute',
    top: '3%',
    left: '8%',
  },
  profilePicWrapper: {
    height: 122,
    width: 122,
    alignSelf: 'center',
    marginTop: '25%',
    marginBottom: '8%',
  },
  profilePic: {
    height: '100%',
    width: '100%',
    borderRadius: 100,
  },
  editWrapper: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  edit: {
    ...commonStyles.icon32,
  },
  inputViewStyles: {
    marginTop: '5%',
  },
  inputStyles: {
    color: colors.primary,
  },
  bottomWrapper: {
    marginTop: '18%',
  },
  orImage: {
    width: '50%',
    height: 40,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  errorView: {
    paddingHorizontal: 18,
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
  bottomTextWrapper: {
    ...commonStyles.horizontalCenterStyles,
    marginTop: '7%',
    justifyContent: 'center',
  },
  txtSignUp: {
    fontSize: 18,
    fontWeight: '500',
  },
  txtSignUp1: {
    color: colors.primary,
    marginLeft: '5%',
    fontSize: 18,
    fontWeight: '500',
  },
});
