import {StyleSheet} from 'react-native';
import {colors} from '../../colors';
import {commonStyles} from '../../commonStyles';
import {fonts} from '../../fonts';

export const productReviewStyles = StyleSheet.create({
  contentContainerStyle: {
    paddingHorizontal: '4%',
  },
  reviewItemWrapper: {
    marginTop: '3%',
    borderBottomWidth: 1,
    borderBottomColor: colors.greyText,
    paddingBottom: 5,
  },
  reviewTopItemWrapper: {
    ...commonStyles.horizontalCenterStyles,
    alignItems: 'flex-start',
  },
  reviewTopItemMiddleWrapper: {
    width: '55%',
    paddingHorizontal: '2%',
    flex: 1,
  },
  reviewerName: {
    marginTop: '3%',
  },
  reviewerRating: {
    marginTop: '3%',
  },
  reviewedDate: {
    ...fonts.regular12,
    marginTop: '3%',
  },
  icon52: {
    height: 52,
    width: 52,
    resizeMode: 'contain',
  },
});
