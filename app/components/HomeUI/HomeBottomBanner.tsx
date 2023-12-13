import {
  Image,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import {images} from '../../core';
import {FC, memo} from 'react';
import {HomeBottomBannerProps} from '../../types/components';

const HomeBottomBanner: FC<HomeBottomBannerProps> = props => {
  const {onPress, marginTop} = props;
  const {width} = useWindowDimensions();
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      testID="homeSellWithUsBtn"
      onPress={onPress}
      style={[
        styles.sellTextWrapper,
        {
          width: width - 25,
          marginTop: marginTop,
        },
      ]}>
      <Image style={styles.sellImage} source={images.dummySellWithStreetz} />
    </TouchableOpacity>
  );
};
export default memo(HomeBottomBanner);
const styles = StyleSheet.create({
  sellTextWrapper: {
    height: 107,
    borderRadius: 8,
    overflow: 'hidden',
    alignSelf: 'center',
    marginBottom: 15,
  },
  sellImage: {
    height: '100%',
    width: '100%',
  },
});
