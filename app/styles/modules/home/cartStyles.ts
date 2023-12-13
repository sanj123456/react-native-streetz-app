import {Platform, StyleSheet} from 'react-native';
import {colors} from '../../colors';
import {commonStyles} from '../../commonStyles';
import {fonts} from '../../fonts';

export const cartStyles = StyleSheet.create({
  contentContainerStyle: {
    paddingVertical: '4%',
  },
  sidePadding: {
    paddingHorizontal: '4%',
  },
  imgAdd: {
    ...commonStyles.icon28,
    borderRadius: 14,
  },
  couponWrapper: {
    ...commonStyles.horizontalBetweenStyles,
    marginTop: '2%',
    borderWidth: 0.5,
    borderColor: colors.dotBorder,
    borderStyle: 'dashed',
    paddingHorizontal: '2.5%',
    paddingVertical: '1%',
    backgroundColor: colors.white,
    borderRadius: 12,
  },
  couponInput: {
    padding: 0,
    ...fonts.regular12,
    width: '70%',
    height: 35,
  },
  txtAllCoupon: {
    ...fonts.regular12,
    color: colors.primary,
  },
  totalWrapper: {
    paddingHorizontal: '4%',
    width: '100%',
    backgroundColor: colors.white,
    marginTop: '2%',
    paddingVertical: '3%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  txtPriceDetails: {
    ...fonts.medium16,
    color: colors.primary,
  },
  totalItem: {
    ...commonStyles.horizontalBetweenStyles,
  },
  btnPlaceOrder: {
    width: '80%',
    alignSelf: 'center',
  },
  appliedCouponText: {
    ...fonts.medium14,
    color: colors.primary,
    lineHeight: 30,
    width: '90%',
  },
  txtDeliveryNotPossible: {
    ...fonts.regular12,
    color: colors.wishRed,
    marginTop: '2%',
  },
  couponOuterWrapper: {
    width: '100%',
    paddingHorizontal: '4%',
  },
  storeText: {
    ...fonts.medium16,
  },
  storeMainWrapper: {
    ...commonStyles.horizontalCenterStyles,
    padding: '3%',
    overflow:'hidden',
    backgroundColor:colors.primary1,
    flexShrink: 1,
  },
  storeName: {
    ...fonts.medium16,
    color: colors.primary,
    flexGrow: 1,
    flexShrink: 1,
    //backgroundColor: colors.red,
  },
  leftTotalView: {
    width: '60%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightTotalView: {
    width: '38%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  giftWrapper: {
    ...commonStyles.horizontalCenterStyles,
   
  },
  txtGift: {
    paddingHorizontal: '2%',
    marginTop: Platform.OS === 'ios' ? 5 : 0,
  },
  addAddressView: {
    ...commonStyles.horizontalBetweenStyles,
    backgroundColor: colors.white,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  cartListWrapper: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginTop: 12,
    overflow:'hidden'
  },
  cartItemSeparator: {
    width: '94%',
    height: 1,
    backgroundColor: colors.borderColor2,
    alignSelf: 'center',
  },
  bottomWrapper: {
    ...commonStyles.horizontalBetweenStyles,
    backgroundColor: colors.primary,
    paddingHorizontal: '4%',
    paddingVertical: '3%',
  
  },
  placeOrderBtnCart: {
  flex:1,
    backgroundColor: colors.darkButton,
  },
  txtTotalAmountCart: {
    ...fonts.medium12,
    marginTop: Platform.OS === 'ios' ? 5 : 0,
    color: colors.white,
  },
  txtAmountCart: {
    ...fonts.medium22,
    color: colors.white,
  },
  bottomLeft: {
    flex:1
  },
  slotWrapper: {
    width: '92%',
    borderRadius: 12,
    backgroundColor: colors.white,
    alignSelf: 'center',
    marginTop: 12,
    paddingBottom: '2%',
    overflow:'hidden'
  },
  headingSlot: {
    ...fonts.medium16,
    padding: '3%',
   
    backgroundColor:colors.primary1
  },
  txtSelectOptionSlot: {
    ...fonts.regular12,
    paddingHorizontal: '3%',
  },
  optionSlotItemWrapper: {
    ...commonStyles.horizontalBetweenStyles,
    paddingVertical: '2%',
    paddingHorizontal: '3%',
  },
  optionSlotTopWrapper: {
    ...commonStyles.horizontalCenterStyles,
    flexWrap: 'wrap',
  },
  freeSlotWrapper: {
    width: '80%',
  },
  txtOptionLabelSlotView: {
    ...commonStyles.horizontalCenterStyles,
    paddingHorizontal: '2%',
  },
  txtOptionLabelSlot0: {
    paddingTop: Platform.OS === 'ios' ? 5 : 0,
  },
  txtOptionLabelSlotBold: {
    ...fonts.heading14,
    paddingTop: Platform.OS === 'ios' ? 5 : 0,
    color: colors.primary,
  },
  txtOptionLabelSlot: {
    paddingHorizontal: '2%',
    paddingTop: Platform.OS === 'ios' ? 5 : 0,
  },
  slotItemSeparator: {
    borderBottomWidth: 1,
    borderColor: colors.borderColor2,
  },
  slotDateAndTime: {
    ...fonts.regular12,
    paddingLeft: 27,
    marginTop: 3,
  },
});
