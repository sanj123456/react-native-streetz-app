import {StyleSheet} from 'react-native';
import {fonts} from '../../fonts';
import {colors} from '../../colors';

export const introStyles = StyleSheet.create({
  btnSkip: {
    alignSelf: 'flex-end',
    marginRight: '5%',
    marginTop: '5%',
  },
  txtSkip: {
    ...fonts.regular14,
  },
  sliderImage: {
    width: '100%',
    height: 377,
    resizeMode: 'contain',
    marginTop: '8%',
  },
  heading: {
    ...fonts.medium26,
    alignSelf: 'center',
    color: colors.primary,
    marginTop: '5%',
    width: '90%',
    textAlign: 'center',
  },
  desc: {
    color: colors.black,
    lineHeight: 24,
    marginTop: '5%',
    width: '90%',
    alignSelf: 'center',
    textAlign: 'center',
  },
  btnNext: {
    width: '90%',
    alignSelf: 'center',
    marginVertical: '10%',
  },
});
