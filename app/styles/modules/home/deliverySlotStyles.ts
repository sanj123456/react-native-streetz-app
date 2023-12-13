import {StyleSheet} from 'react-native';
import {fonts} from '../../fonts';
import {commonStyles} from '../../commonStyles';
import {colors} from '../../colors';

export const deliverySlotStyles = StyleSheet.create({
  contentContainerStyle: {
    paddingVertical: '4%',
  },
  sidePadding: {
    paddingHorizontal: '4%',
  },
  heading: {
    ...fonts.medium16,
  },
  txtSelectOption: {
    ...fonts.regular12,
    marginTop: '1%',
  },
  optionWrapper: {
    marginTop: '1%',
  },
  optionItemWrapper: {
    ...commonStyles.horizontalCenterStyles,
    marginBottom: '2%',
  },
  txtOptionLabel: {
    paddingHorizontal: '2%',
  },
  calendarWrapper: {
    paddingHorizontal: '4%',
    //borderTopWidth: 10,
    borderColor: colors.background,
    // marginTop: '2%',
    paddingVertical: '3%',
  },
  btnMonthYear: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingHorizontal: '5%',
    paddingVertical: '2%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  txtMonthYear: {
    ...fonts.regular12,
    color: colors.white,
  },
  weekDaysWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '3%',
  },
  weekCircle: {
    height: 39,
    width: 39,
    borderRadius: 20,
    borderColor: colors.blackText,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  weekItem: {
    alignItems: 'center',
  },
  txtWeekDay: {
    ...fonts.medium12,
    color: colors.primary,
  },
  timeSlotTopWrapper: {
    // ...commonStyles.horizontalBetweenStyles,
    alignItems: 'flex-end',
    marginTop: '3%',
  },
  txtSelectedSlot: {
    ...fonts.regular12,
    marginTop: 4,
    marginBottom: 5,
  },
  timeSlotWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    justifyContent: 'space-between',
  },
  timeSlotItem: {
    width: '48%',
    paddingVertical: '4%',
    alignItems: 'center',
    marginTop: '3%',
    borderRadius: 4,
  },

  btnContinue: {
    width: '80%',
    alignSelf: 'center',
    marginBottom: '5%',
  },
});
