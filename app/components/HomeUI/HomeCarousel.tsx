import {FC, memo, useCallback} from 'react';
import {Pressable, StyleSheet, View, useWindowDimensions} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import {colors} from '../../styles';
import {MyImage} from '../MyImage';
import {HomeCarouselProps} from '../../types/components';

const HomeCarousel: FC<HomeCarouselProps> = props => {
  const {
    onSnapToItem,
    onPress,
    bannerCurrentIndex,
    data,
    isTrendingCarousel,
    isLightIndicator,
  } = props;
  const {width} = useWindowDimensions();

  const renderHandler = useCallback(
    ({item, index}: any) => {
      return (
        <Pressable
          key={index}
          testID={'bannerMain'}
          style={styles.bannerMainWrapper}
          onPress={onPress.bind(this, item)}>
          <MyImage
            testID="StoreBannerImage"
            style={{width: width - 33, height: 200}}
            source={item?.banner_url}
            isBanner
          />
        </Pressable>
      );
    },
    [onPress, width],
  );
  return (
    <View
      style={[
        styles.bannerTopWrapper,
        {marginTop: isTrendingCarousel ? 15 : 0},
      ]}>
      <Carousel
        panGestureHandlerProps={{
          activeOffsetX: [-10, 10],
        }}
        autoPlayInterval={2500}
        loop
        width={width - 33}
        height={200}
        autoPlay={true}
        style={styles.borderRadius}
        data={data}
        scrollAnimationDuration={1000}
        onSnapToItem={onSnapToItem}
        testID={'RecommendedStoreList'}
        renderItem={renderHandler}
      />
      <View style={styles.bannerIndicatorWrapper}>
        {data?.map((item: any, index: any) => (
          <View
            key={`${index}_banner_indicator_keys`}
            testID={`${index}_banner_indicator_keys`}
            style={[
              styles.bannerIndicatorView,
              {
                backgroundColor:
                  isLightIndicator === true
                    ? index === bannerCurrentIndex
                      ? colors.white
                      : colors.inactiveIndicator
                    : index === bannerCurrentIndex
                    ? colors.primary
                    : colors.inactiveIndicator,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};
export default memo(HomeCarousel);
const styles = StyleSheet.create({
  bannerTopWrapper: {
    alignSelf: 'center',
  },
  bannerImage: {height: '100%', width: '100%'},
  borderRadius: {
    borderRadius: 10,
  },
  bannerIndicatorWrapper: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  bannerIndicatorView: {
    borderRadius: 15,
    backgroundColor: colors.white,
    marginHorizontal: 2,
    height: 10,
    width: 10,
  },
  bannerMainWrapper: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
});
