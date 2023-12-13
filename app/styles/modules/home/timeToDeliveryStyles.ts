import {Platform, StyleSheet} from 'react-native';
import {fonts} from '../../fonts';
import {colors} from '../../colors';

export const timeToDeliveryStyles = StyleSheet.create({
  contentContainerStyle: {
    paddingHorizontal: '4%',
    paddingVertical: '4%',
  },
  txtReceivedOrder: {
    ...fonts.regular12,
    color: colors.black,
    alignSelf: 'center',
    marginTop: '4%',
  },
  txtTimeLeft: {
    ...fonts.medium42,
    alignSelf: 'center',
    color: colors.primary,
  },
  barWrapper: {
    flexDirection: 'row',
    alignSelf: 'center',
    width: 200,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '2%',
  },
  barItem: {
    width: 39,
    height: 2,
  },
  statusWrapper: {
    width: '80%',
    alignItems: 'center',
    paddingVertical: '3%',
    backgroundColor: colors.primary,
    borderRadius: 12,
    alignSelf: 'center',
    marginTop: '5%',
  },
  txtStatus: {
    ...fonts.medium16,
    color: colors.white,
  },
  txtStatusDesc: {
    ...fonts.regular12,
    color: colors.white,
    marginTop: '1%',
  },
  heading: {
    ...fonts.regular16,
    marginTop: '5%',
    color: colors.black,
  },
  orderDetailsWrapper: {
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: '4%',
    paddingVertical: '4%',
    marginTop: '4%',
  },
  leftView: {
    width: '60%',
  },
  rightView: {
    width: '40%',
    alignItems: 'flex-end',
  },
  userName: {
    ...fonts.medium16,
    color: colors.primary,
    marginBottom: 5,
  },
  txtLocation: {
    ...fonts.regular12,
    marginLeft: '2%',
  },
  txtStatusGreen: {
    ...fonts.medium12,
    marginTop: '10%',
    textAlign: 'right',
  },
  txtItemsInclude: {
    ...fonts.medium14,
    marginTop: '2%',
    marginBottom: '1%',
  },
  txtProduct: {
    ...fonts.regular12,
    width: '65%',
  },
  txtPrice: {
    ...fonts.regular16,
    color: colors.primary,
    alignSelf: 'flex-end',
  },
  bottomWrapper: {
    paddingVertical: '3%',
    paddingHorizontal: '8%',
  },
  separatorBar: {
    width: '100%',
    height: 1,
    backgroundColor: colors.background,
    marginTop: '1%',
  },
  horizontalMargin: {
    marginTop: '1%',
  },
  partnerView: {
    width: '100%',
    paddingHorizontal: '4%',
    paddingVertical: '2%',
    borderRadius: 12,
    backgroundColor: colors.white,
    marginTop: '3%',
  },
  partnerSubView: {
    flexDirection: 'column',
  },
  partnerMainSubView: {
    flexDirection: 'row',
  },
  nameText14: {
    fontSize: 14,
  },
  txtCancelBtn: {
    ...fonts.regular12,
    color: colors.red,
  },
  priceView: {
    width: '35%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  txtInvoice: {
    ...fonts.medium14,
    color: colors.backgroundFb,
    marginTop: Platform.OS === 'android' ? 0 : 5,
  },
  btnInvoice: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    // backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.backgroundFb,
    alignSelf: 'center',
    marginTop: 15,
  },
  sorryMessage: {
    ...fonts.regular12,
    color: colors.primary,
    width: '90%',
    textAlign: 'center',
    marginVertical: '2%',
    alignSelf: 'center',
  },
});
