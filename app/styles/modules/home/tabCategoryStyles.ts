import {StyleSheet} from 'react-native';
import {fonts} from '../../fonts';
import {colors} from '../../colors';

export const tabCategoryStyles = StyleSheet.create({
  contentContainerStyle: {
    paddingHorizontal: 10,
    flexGrow: 1,
  },
  noFoundView: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  itemView: {
    backgroundColor: colors.white,
    marginVertical: 10,
    overflow: 'hidden',
    borderRadius: 12,
  },
  titleView: {
    marginBottom: 15,
    backgroundColor: colors.primary1,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleStyle: {
    ...fonts.medium16,
    fontSize: 16,
  },
  itemSeparatorStyle: {
    width: 25,
    marginHorizontal: 5,
  },
  subCategoryView: {
    width: 100,
  },
  imageStyle: {
    height: 100,
    width: 100,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary1,
  },
  subText: {
    ...fonts.regular14,
    textAlign: 'center',
    marginTop: 10,
  },
  rightArrowImage: {
    height: 20,
    width: 20,
    tintColor: colors.primary,
    resizeMode: 'contain',
  },
  leftScrollArrow: {
    position: 'absolute',
    left: 10,
    top: 100,
    opacity: 0.7,
  },
  rightScrollArrow: {
    position: 'absolute',
    right: 10,
    top: 100,
    opacity: 0.7,
  },
  arrowImage: {
    height: 50,
    width: 50,
    tintColor: colors.infoText,
  },
});
