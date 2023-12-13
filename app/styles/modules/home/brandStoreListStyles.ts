import {StyleSheet} from 'react-native';
import {colors} from '../../colors';
import {fonts} from '../../fonts';
import {commonStyles} from '../../commonStyles';

export const brandStoreListStyles = StyleSheet.create({
  contentContainerStyle: {
    paddingTop: '4%',
    paddingBottom: '23%',
    paddingHorizontal: '3%',
    flexGrow: 1,
  },
  bannerMainWrapper: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  bannerImage: {
    height: '100%',
    width: '100%',
  },
  bannerIndicatorWrapper: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: '10%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerIndicatorView: {
    borderRadius: 15,
    backgroundColor: colors.white,
    marginHorizontal: 2,
  },
  catHeading: {
    ...fonts.medium16,
    marginTop: '4%',
  },
  listGridWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  itemListWrapper: {
    width: '100%',
    paddingHorizontal: '3%',
    paddingVertical: '2%',
    flexDirection: 'row',
    marginTop: '3%',
    backgroundColor: colors.white,
    borderRadius: 12,
  },
  itemListImage: {
    height: 73,
    width: 73,
    resizeMode: 'cover',
    borderRadius: 9,
  },
  itemListMiddle: {
    width: '75%',
    paddingHorizontal: '3%',
    paddingVertical: '2%',
  },
  itemStoreText: {
    ...fonts.medium16,
    color: colors.primary,
  },
  itemReviewText: {
    ...fonts.regular12,
    color: colors.greyText,
    paddingLeft: 5,
    width: '50%',
  },
  itemLocationText: {
    ...fonts.regular12,
    paddingLeft: 5,
  },
  itemRightArrow: {
    ...commonStyles.icon12,
    alignSelf: 'center',
  },
  itemGridWrapper: {
    width: '48%',
    paddingHorizontal: '3%',
    paddingVertical: '2%',
    marginTop: '3%',
    backgroundColor: colors.white,
    borderRadius: 12,
  },
  itemGridImage: {
    height: 73,
    width: '100%',
    resizeMode: 'cover',
    borderRadius: 9,
  },
  itemGridMiddle: {
    paddingVertical: '3%',
  },
  btnOther: {
    marginTop: '3%',
    marginLeft: '25%',
    width: '75%',
  },
  txtOther: {
    ...fonts.regular12,
    color: colors.primary,
    textAlign: 'center',
  },
});
