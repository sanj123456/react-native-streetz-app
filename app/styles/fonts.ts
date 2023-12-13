import {StyleSheet} from 'react-native';
import {colors} from './colors';

export const fontFamily = {
  primaryExtraBold: 'HelveticaNeueLTStd-Hv',
  primaryBold: 'HelveticaNeueLTStd-Bd',
  primaryRegular: 'HelveticaNeueLTStd-Roman',
  primaryMedium: 'HelveticaNeueLTStd-Md',
  primaryLight: 'HelveticaNeueLTStd-Lt',
  primaryOuterBold: 'HelveticaNeueLTPro-BdOu',

  secondaryRegular: 'Inter-Regular',
};

const outerBoldFont = {
  fontFamily: fontFamily.primaryOuterBold,
  color: colors.blackText,
};

const extraBoldFont = {
  fontFamily: fontFamily.primaryExtraBold,
  color: colors.blackText,
};

const headingFont = {
  fontFamily: fontFamily.primaryBold,
  color: colors.blackText,
};

const mediumFont = {
  fontFamily: fontFamily.primaryMedium,
  color: colors.blackText,
};

const regularFont = {
  fontFamily: fontFamily.primaryRegular,
  color: colors.blackText,
};

const lightFont = {
  fontFamily: fontFamily.primaryLight,
  color: colors.blackText,
};

const regularFontSecond = {
  fontFamily: fontFamily.secondaryRegular,
  color: colors.blackText,
};

export const fonts = StyleSheet.create({
  // Outer Bold
  outerBold26: {
    ...outerBoldFont,
    fontSize: 26,
    lineHeight: 31.2,
  },

  // Extra Bold
  extraBold30: {
    ...extraBoldFont,
    fontSize: 30,
    lineHeight: 33,
  },

  // Bold
  heading16: {
    ...headingFont,
    fontSize: 16,
    lineHeight: 19,
  },
  heading14: {
    ...headingFont,
    fontSize: 14,
  },

  // medium
  medium42: {
    ...mediumFont,
    fontSize: 42,
    lineHeight: 50.4,
  },
  medium26: {
    ...mediumFont,
    fontSize: 26,
    lineHeight: 31.2,
  },
  medium22: {
    ...mediumFont,
    fontSize: 22,
    lineHeight: 26,
  },
  medium20: {
    ...mediumFont,
    fontSize: 20,
    lineHeight: 24,
  },
  medium18: {
    ...mediumFont,
    fontSize: 18,
    lineHeight: 24,
  },
  medium16: {
    ...mediumFont,
    fontSize: 16,
    lineHeight: 19,
  },
  medium14: {
    ...mediumFont,
    fontSize: 14,
  },
  medium12: {
    ...mediumFont,
    fontSize: 12,
    lineHeight: 14.4,
  },

  // Regular
  regular22: {
    ...regularFont,
    fontSize: 22,
    lineHeight: 26.4,
  },
  regular18: {
    ...regularFont,
    fontSize: 18,
    lineHeight: 21.6,
  },
  regular16: {
    ...regularFont,
    fontSize: 16,
    lineHeight: 19,
  },
  regular15: {
    ...regularFont,
    fontSize: 15,
    lineHeight: 17.58,
  },
  regular14: {
    // Used in CustomText component
    ...regularFont,
    fontSize: 14,
  },
  regular12: {
    ...regularFont,
    fontSize: 12,
    lineHeight: 14.4,
  },
  regular10: {
    ...regularFont,
    fontSize: 10,
    lineHeight: 12,
  },

  // Light
  light32: {
    ...lightFont,
    fontSize: 32,
  },
  light18: {
    ...lightFont,
    fontSize: 18,
  },
  light16: {
    ...lightFont,
    fontSize: 16,
    lineHeight: 19,
  },
  light14: {
    ...lightFont,
    fontSize: 14,
  },

  // Secondary
  regularSecondary12: {
    ...regularFontSecond,
    fontSize: 12,
    lineHeight: 14.4,
  },
  regularSecondary10: {
    ...regularFontSecond,
    fontSize: 10,
    lineHeight: 12,
  },
});
