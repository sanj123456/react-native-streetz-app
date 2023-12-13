import {Platform, StyleSheet} from 'react-native';
import {colors} from './colors';
import {fonts} from './fonts';

export const commonStyles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: colors.white,
  },
  flex1: {
    flex: 1,
  },
  bgPrimary: {
    backgroundColor: colors.primary,
  },
  errorText: {
    ...fonts.regular12,
    color: colors.red,
    marginTop: 5,
    zIndex: -100,
  },
  containerCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  horizontalCenterStyles: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  horizontalBetweenStyles: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

  },
  listGridWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  primaryButtonStyle: {
    height: 45,
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonLabelStyles: {
    ...fonts.regular18,
    color: colors.white,
  },
  primaryHeaderStyles: {
    width: '100%',
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '4%',
    justifyContent: 'space-between',
  },
  primaryHeaderLeftSide: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  primaryHeaderMenuIcon: {
    height: 35,
    width: 35,
    resizeMode: 'contain',
    marginRight: 15,
  },
  primaryHeaderBackIcon: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
    marginRight: 15,
    tintColor: colors.white,
  },
  primaryHeaderLabelStyles: {
    ...fonts.medium16,
    color: colors.white,
    paddingLeft: '3%',
    alignItems: 'center',
    marginTop: 5,
    width: '70%',
  },
  primaryHeaderRightSide: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flex: 1,
  },
  icon53: {
    height: 17,
    width: 17,
    resizeMode: 'contain',
    marginLeft: 15,
  },
  icon52: {
    height: 52,
    width: 52,
    resizeMode: 'contain',
  },
  icon48: {
    height: 48,
    width: 48,
    resizeMode: 'contain',
  },
  icon42: {
    height: 42,
    width: 42,
    resizeMode: 'contain',
  },
  icon40: {
    height: 40,
    width: 40,
    resizeMode: 'contain',
  },
  icon38: {
    height: 38,
    width: 38,
    resizeMode: 'contain',
  },
  icon32: {
    height: 32,
    width: 32,
    resizeMode: 'contain',
  },
  icon29: {
    height: 29,
    width: 29,
    resizeMode: 'contain',
  },
  icon28: {
    height: 28,
    width: 28,
    resizeMode: 'contain',
  },
  icon25: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
  },
  icon21: {
    height: 21,
    width: 21,
    resizeMode: 'contain',
  },
  icon20: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
  icon18: {
    height: 18,
    width: 18,
    resizeMode: 'contain',
  },
  icon17: {
    height: 17,
    width: 17,
    resizeMode: 'contain',
  },
  icon15: {
    height: 15,
    width: 15,
    resizeMode: 'contain',
  },
  icon12: {
    height: 12,
    width: 12,
    resizeMode: 'contain',
  },
  icon10: {
    height: 10,
    width: 10,
    resizeMode: 'contain',
  },
  icon8: {
    height: 8,
    width: 8,
    resizeMode: 'contain',
  },
  icLogo: {
    height: 90,
    width: 90,
    resizeMode: 'contain',
    marginTop: '25%',
  },
  welcomeText: {
    ...fonts.regular22,
    marginTop: '2%',
  },
  placesListViewStyles: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ececec',
    width: '100%',
    paddingHorizontal: '5%',
    paddingBottom: 15,
    marginBottom: 15,
    borderRadius: 20,
    maxHeight: 200,
  },
  placesListItem: {
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ececec',
  },
  fieldInputViewStyles: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 35,
    borderRadius: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.white,
    justifyContent: 'space-between',
  },
  fieldInputMainViewStyles: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 45,
    borderRadius: 8,
    paddingHorizontal: '5%',
    borderWidth: 0.8,
    borderColor: colors.primary,
    justifyContent: 'space-between',
  },
  shadowTwoStyles: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  shadowStyles: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  shadowPrimaryStyles: {
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  hitSlop: {
    top: 15,
    bottom: 15,
    right: 15,
    left: 15,
  },
  hitSlop5: {
    top: 5,
    bottom: 5,
    right: 5,
    left: 5,
  },
  myImageWrapper: {
    overflow: 'hidden',
    backgroundColor: colors.backgroundImage,
    zIndex: 1,
  },
  myImageBackgroundWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 2,
  },
  myImageBackground: {height: '100%', width: '100%', resizeMode: 'contain'},
  zIndex5: {
    zIndex: 5,
  },
  payItemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '4%',
  },
  payCartItemWrapper: {
    
    marginVertical: '4%',
    backgroundColor: colors.white,
    borderRadius: 12,
    width: '92%',
    alignSelf: 'center',
    overflow:'hidden'
  },
  payCartItemLabel: {
    ...fonts.regular15,
    paddingHorizontal: '2.5%',
    marginTop: 5,
  },
  payItemLabel: {
    ...fonts.medium16,
    padding: '3%',
 
  },
  payItemContainContainer:{
    flexDirection:'row',  alignItems: 'center',  paddingHorizontal: '3%',
    paddingVertical: '2%',
  },
  payItemMiddle: {
    width: '80%',
  },
  payCartItemMiddle: {
    width: '78%',
  },
});
