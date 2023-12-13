import {FC, memo, useCallback} from 'react';
import {Pressable, StyleSheet, View, useWindowDimensions} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import {colors} from '../../styles';
import {MyImage} from '../MyImage';
import {StoreCarouselProps} from '../../types/components';

const StoreCarousel: FC<StoreCarouselProps> = props => {
  const {onSnapToItem, onPress, bannerCurrentIndex, data} = props;
  const {width} = useWindowDimensions();

  const renderHandler = useCallback(
    ({item}: any) => {
      return (
        <Pressable
          key={`banner`}
          testID={'bannerMain'}
          style={styles.bannerMainWrapper}
          onPress={onPress.bind(null, item)}>
          <MyImage
            testID="StoreBannerImage"
            style={{...styles.bannerImage, width: width - 33}}
            source={item?.banner_url}
            isBanner
          />
        </Pressable>
      );
    },
    [onPress, width],
  );
  return (
    <View>
      <Carousel
        panGestureHandlerProps={{
          activeOffsetX: [-10, 10],
        }}
        autoPlayInterval={2500}
        loop
        width={width - 33}
        height={200}
        autoPlay={true}
        style={styles.carouselWrapper}
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
                  index === bannerCurrentIndex ? colors.primary : colors.white,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};
export default memo(StoreCarousel);
const styles = StyleSheet.create({
  carouselWrapper: {
    bottom: 10,
    marginLeft: 6,
    marginRight: 8,
    marginTop: 15,
  },
  bannerMainWrapper: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  bannerImage: {
    height: 200,
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
    height: 10,
    width: 10,
  },
});
