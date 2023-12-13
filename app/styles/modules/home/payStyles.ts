import {StyleSheet} from 'react-native';
import {fonts} from '../../fonts';
import {colors} from '../../colors';

export const payStyles = StyleSheet.create({
  contentContainerStyle: {
    paddingHorizontal: '4%',
    paddingTop: '4%',
    paddingBottom: '25%',
  },
  headingTxt: {
    ...fonts.medium16,
  },
  descTxt: {
    ...fonts.regular12,
    marginTop: '2%',
  },
  btnContinue: {
    width: '80%',
    alignSelf: 'center',
    position: 'absolute',
    bottom: '4%',
  },
  listWrapper: {
    width: '100%',
    marginTop: '3%',
    paddingHorizontal: '4%',
    paddingBottom: '5%',
    backgroundColor: colors.white,
    borderRadius: 12,
  },
});
