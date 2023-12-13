import {Platform, StyleSheet} from 'react-native';
import {colors} from '../../colors';
import {fonts} from '../../fonts';

export const onboardingStyles = StyleSheet.create({
  itemStyle: {
    backgroundColor: colors.white,
    marginBottom: 15,
    padding: 15,
    borderRadius: 8,
  },
  scrollViewContentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 20,
  },
  questionStyle: {
    color: colors.primary,
    fontSize: 18,
    marginBottom: 8,
  },
  textStyle: {
    color: colors.black,
    fontSize: 16,
    marginTop: Platform.OS === 'ios' ? 5 : 0,
  },
  inputStyle: {
    color: colors.black,
    fontSize: 16,
    borderBottomWidth: 1,
    borderColor: colors.greyText,
    height: 45,
    width: '100%',
  },
  iconStyle: {
    height: 20,
    width: 20,
    marginRight: 5,
  },
  unTickedCheckBoxStyle: {
    height: 20,
    width: 20,
    backgroundColor: colors.primary,
    borderRadius: 3,
    marginRight: 5,
  },
  elementStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  dropdownFieldWrapper: {
    height: 45,
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    marginTop: '4%',
    paddingLeft: '1%',
    paddingRight: '4%',
  },
  placeholderStyle: {
    ...fonts.regular14,
    color: colors.greyText,
  },
  selectedTextStyle: {
    ...fonts.regular14,
  },

  questionView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  requireStyle: {
    color: colors.pureRed,
    fontSize: 16,
  },
});
