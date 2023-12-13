import {StyleSheet} from 'react-native';
import {fonts} from '../../fonts';
import {commonStyles} from '../../commonStyles';
import {colors} from '../../colors';

export const notifyStyles = StyleSheet.create({
  contentContainerStyle: {
    paddingHorizontal: '4%',
    paddingTop: '3%',
    paddingBottom: '8%',
  },
  itemWrapper: {
    width: '100%',
    ...commonStyles.shadowStyles,
    borderRadius: 8,
    backgroundColor: colors.white,
    paddingHorizontal: '4%',
    paddingVertical: '3%',
    marginTop: '3%',
  },
  heading: {
    ...fonts.medium16,
    color: colors.primary,
  },
  desc: {
    ...fonts.regular14,
    marginTop: '2%',
  },
  image: {
    height: 250,
    width: '100%',
    resizeMode: 'contain',
    marginTop: '2%',
  },
});
