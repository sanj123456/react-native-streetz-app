import {StyleSheet} from 'react-native';
import {fonts} from '../../fonts';
import {colors} from '../../colors';
import {commonStyles} from '../../commonStyles';

export const searchStyles = StyleSheet.create({
  productPrice: {
    ...fonts.regular12,
    marginTop: '2%',
  },
  productName: {
    ...fonts.medium16,
  },
  productRealPrice: {
    ...fonts.regular12,
    marginTop: '2%',
    textDecorationLine: 'line-through',
    color: colors.lightGreyText,
  },
  columnWrapperStyle: {
    justifyContent: 'space-between',
  },
  contentContainerStyle: {
    paddingHorizontal: '4%',
    paddingBottom: '23%',
    flexGrow: 1,
  },
  inputStyles: {
    padding: 0,
    ...fonts.regular12,
    width: '87%',
    height: 35,
    paddingHorizontal: 10,
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
  itemCategoryText: {
    ...fonts.medium12,
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
  itemGridWrapper: {
    marginTop: '3%',
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    width: '48%',
  },
  itemGridWrapper2: {
    width: '48%',
    paddingHorizontal: '3%',
    paddingVertical: '2%',
    marginTop: '3%',
    backgroundColor: colors.white,
    borderRadius: 12,
  },
  itemGridImage: {
    height: 150,
    width: '100%',
    resizeMode: 'cover',
    borderRadius: 9,
  },
  itemGridImageProduct: {
    height: 150,
    width: '100%',
    resizeMode: 'contain',
    borderRadius: 9,
  },
  itemGridMiddle2: {
    paddingVertical: '3%',
  },
  itemGridMiddle: {
    borderTopWidth: 1,
    borderColor: colors.background,
    paddingVertical: '5%',
    paddingHorizontal: '5%',
  },
  itemRightArrow: {
    ...commonStyles.icon12,
    alignSelf: 'center',
  },
  headerIcon: {
    width: '10%',
    marginTop: 5,
  },
  headerIconView: {
    flexDirection: 'row',
    paddingLeft: 5,
    backgroundColor: colors.primary,
  },
  searchView: {
    flexDirection: 'row',
    borderRadius: 25,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginTop: 12,
    height: 32,
    width: '88%',
    backgroundColor: colors.white,
  },
  searchBar: {
    paddingLeft: 8,
    width: '78%',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    overflow: 'hidden',
    backgroundColor: '#323232',
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 5,
    marginTop: 8,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 20,
  },
  selectedSegment: {
    backgroundColor: '#8A2AF9',
    color: 'white',
  },
  segmentText: {
    fontWeight: '400',
    color: 'white',
  },
  selectedText: {
    color: 'white',
  },
});
