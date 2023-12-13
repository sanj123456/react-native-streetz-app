import { StyleSheet } from 'react-native';
import { colors } from '../../colors';
import { fonts } from '../../fonts';

export const storeDetailsStyles = StyleSheet.create({
  contentContainerStyle: {
    paddingTop: '4%',
    paddingBottom: '23%',
    paddingHorizontal: '3%',
    minHeight: '100%',
  },
  storeTopWrapper: {
    width: '100%',
    height: 100,
  },
  coverImage: {
    height: 180,
    width: '100%',
    borderRadius: 9,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  coverEffect: {
    height: 180,
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  storeDetailsWrapper: {
    width: '100%',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
  },
  storeImage: {
    height: 102,
    width: 102,
    resizeMode: 'cover',
    borderRadius: 9,
    borderWidth: 0.5,
    borderColor: colors.borderColor,
  },
  storeMiddle: {
    width: '75%',
    paddingHorizontal: '3%',
    paddingVertical: '2%',
  },
  storeText: {
    ...fonts.medium16,
    color: colors.primary,
    width: '60%',
  },
  reviewText: {
    ...fonts.regular12,
    color: colors.greyText,
    paddingLeft: 5,
  },
  itemLocationText: {
    ...fonts.regular12,
    paddingLeft: 5,
    width: '75%',
  },
  catHeading: {
    ...fonts.medium16,
    marginTop: '4%',
    color: colors.primary,
  },
  btnOther: {
    marginTop: '3%',
    marginLeft: '28%',
    width: '75%',
  },
  txtOther: {
    ...fonts.regular12,
    color: colors.primary,
    textAlign: 'center',
  },
  searchView: {
    flexDirection: 'row',
    borderRadius: 25,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 5,
    marginLeft: 15,
    marginRight: 15,
    height: 32,
    backgroundColor: colors.white,
  },
  inputStyles: {
    padding: 0,
    ...fonts.regular12,
    width: '87%',
    height: 35,
    paddingHorizontal: 10,
  },
  subCatContainerStyles: {
    padding: 10,
  },
  subItem: {
    padding: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
    marginRight: 10,
    justifyContent: 'center',
    borderWidth: 0,
  },
  closedView: {
    paddingHorizontal: '4%',
    paddingVertical: '2%',
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 5,
    alignSelf: 'center',
    marginVertical: '1%',
    marginBottom: 8,
  },
  txtClosed: {
    ...fonts.medium14,
    textAlign: 'center',
  },
  tabHeader: {
    height: 60,
    backgroundColor: colors.white,
    minWidth: '100%',
    borderRadius: 8,
  },
  whatsappButton: {
    width: 45,
    height: 45,
    marginTop:10
  },
  shareButton: {
    width: 42,
    height: 42,
    marginTop:10
  },
  shareView:{
    overflow: 'hidden',
    position: "absolute",
    bottom: '5%',
    right:'5%',
  },
  whatsappImage: {
    height: '100%',
    width:'100%',
  },
  shareImage: {
    width: 40,
    height: 40,
    tintColor:colors.primary
  }

});
