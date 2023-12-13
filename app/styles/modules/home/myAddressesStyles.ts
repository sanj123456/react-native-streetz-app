import {StyleSheet} from 'react-native';
import {fonts} from '../../fonts';
import {colors} from '../../colors';

export const myAddressesStyles = StyleSheet.create({
  contentContainerStyle: {
    paddingHorizontal: '4%',
  },
  listView: {
    flex: 1,
    paddingHorizontal: '10%',
    paddingVertical: '8%',
    justifyContent: 'center',
  },
  bottomView: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingHorizontal: '8%',
    paddingVertical: '5%',
  },
  bottomNoDataView: {
    position: 'absolute',
    bottom: '35%',
    width: '100%',
    paddingHorizontal: '8%',
    paddingVertical: '5%',
  },
  mainView: {
    alignItems: 'center',
    marginBottom: '5%',
  },
  txtHeading: {
    ...fonts.regular14,
    color: colors.black,
    textAlign: 'center',
    lineHeight: 20,
    paddingVertical: 10,
  },
  btnAddAddress: {
    width: '80%',
    alignSelf: 'center',
    marginBottom: '7%',
    marginTop: '2%',
  },
});
