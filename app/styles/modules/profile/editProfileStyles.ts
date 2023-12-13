import {StyleSheet} from 'react-native';
import {colors} from '../../colors';

export const editProfileStyles = StyleSheet.create({
  contentContainerStyle: {
    paddingHorizontal: '6%',
    paddingVertical: '5%',
  },
  profileWrapper: {
    alignSelf: 'center',
    height: 110,
    width: 110,
    marginTop: 15,
  },
  profilePic: {
    width: '100%',
    height: '100%',
    borderRadius: 55,
  },
  pickerWrapper: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    zIndex: 100,
  },
  inputViewStyles: {
    marginTop: '5%',
  },
  inputStyles: {
    color: colors.primary,
  },
  errorView: {
    paddingHorizontal: 18,
  },
});
