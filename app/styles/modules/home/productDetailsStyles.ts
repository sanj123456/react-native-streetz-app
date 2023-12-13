import {StyleSheet} from 'react-native';
import {colors} from '../../colors';
import {fonts} from '../../fonts';
import {commonStyles} from '../../commonStyles';

export const productDetailsStyles = StyleSheet.create({
  contentContainerStyle: {
    backgroundColor: colors.background,
  },
  footer: {
    height: 100,
    width: '100%',
    backgroundColor: colors.white,
  },
  bannerMainWrapper: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: colors.white,
  },
  bannerImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
  bannerIndicatorWrapper: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: '5%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerIndicatorView: {
    borderRadius: 15,
    backgroundColor: colors.white,
    marginHorizontal: 2,
  },
  buttonShare: {
    position: 'absolute',
    top: '5%',
    right: '4%',
  },
  buttonZoom: {
    position: 'absolute',
    bottom: '5%',
    right: '4%',
  },
  infoWrapper: {
    paddingHorizontal: '4%',
    paddingVertical: '2.5%',
    backgroundColor: colors.white,
  },
  priceText: {
    ...fonts.medium26,
    marginTop: '1.5%',
  },
  discountedView: {
    backgroundColor: colors.greenBg,
    paddingHorizontal: '2%',
    paddingVertical: '1%',
    borderRadius: 20,
  },
  discountedText: {
    ...fonts.regular12,
    color: colors.white,
  },
  mrpText: {
    ...fonts.regular12,
    marginLeft: '1.5%',
  },
  actualPriceText: {
    ...fonts.regular12,
    color: colors.greyText,
    textDecorationLine: 'line-through',
    marginLeft: '1.5%',
  },
  offText: {
    ...fonts.medium12,
    color: colors.darkPinkText,
    marginLeft: '1.5%',
  },
  infoMarginWrapper: {
    paddingHorizontal: '4%',
    paddingVertical: '3%',
    backgroundColor: colors.white,
    marginTop: '3%',
  },
  sizeListWrapper: {
    ...commonStyles.horizontalCenterStyles,
    flexWrap: 'wrap',
    marginTop: '2%',
  },
  sizeItem: {
    borderRadius: 20,
    borderWidth: 1,
    marginRight: '2%',
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginTop: '3%',
  },
  sizeText: {
    ...fonts.medium16,
  },
  colorListWrapper: {
    ...commonStyles.horizontalCenterStyles,
    flexWrap: 'wrap',
    marginTop: '3%',
  },
  colorItem: {
    height: 33,
    width: 33,
    borderRadius: 20,
    marginRight: '2%',
  },
  infoDetailsWrapper: {
    ...commonStyles.horizontalCenterStyles,
    paddingHorizontal: '1%',
    marginTop: '3%',
  },
  bulletPoint: {
    height: 7,
    width: 7,
    borderRadius: 5,
    backgroundColor: colors.blackText,
    marginRight: '3%',
  },
  reviewItemWrapper: {
    marginTop: '3%',
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
    paddingVertical: '3%',
  },
  reviewedDate: {
    ...fonts.regular12,
  },
  reviewDate: {
    marginTop: '2%',
    alignItems: 'flex-end',
    width: '30%',
  },
  loadMoreButton: {
    alignSelf: 'center',
  },
  loadMoreText: {
    ...fonts.regular12,
    color: colors.primary,
  },
  productListWrapper: {
    flexDirection: 'row',
  },
  recentScroll: {
    minHeight: 230,
  },
  productItem: {
    width: 190,
    marginRight: 10,
    marginTop: '1.5%',
  },
  sizeChartView: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 10,
    backgroundColor: `${colors.background}`,
  },
  chartImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  chartClose: {
    position: 'absolute',
    zIndex: 12,
    right: '5%',
    top: '5%',
  },
  txtOutOfStock: {
    ...fonts.medium14,
    color: colors.red,
    marginTop: '3%',
  },
  txtDescHeading: {
    ...fonts.medium16,
  },
  bottomView: {
    ...commonStyles.horizontalBetweenStyles,
    width: '80%',
    position: 'absolute',
    bottom: '3%',
    alignSelf: 'center',
  },
  cartButton: {
    width: '47%',
  },
  qtyBtn: {
    ...commonStyles.horizontalBetweenStyles,
    width: '47%',
    height: 45,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: colors.primary2,
    borderColor: colors.primary,
    paddingHorizontal: '5%',
  },
  qtyBtnDisabled: {
    ...commonStyles.horizontalBetweenStyles,
    width: '47%',
    height: 45,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: colors.borderColor2,
    borderColor: colors.borderColor2,
    paddingHorizontal: '5%',
  },
  qtyDrop: {
    ...commonStyles.icon15,
    tintColor: colors.black,
  },
  qtyTxt: {
    ...fonts.regular18,
    color: colors.black,
  },
  reviewHeader: {
    marginBottom: 3,
  },
});
