/* eslint-disable react-native/no-inline-styles */
import React, { FC, useRef } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { default as ImgZoom } from 'react-native-image-pan-zoom';
import Carousel from 'react-native-reanimated-carousel';
import { Background, MyImage, PrimaryHeader } from '../../components';
import { CommonNavigationProps } from '../../types/navigationTypes';

export const ImageZoom: FC<CommonNavigationProps> = ({route}) => {
  const images = route.params?.images;
  const bannerCurrentIndex = route.params?.bannerCurrentIndex;
  const {width, height} = useWindowDimensions();
  const carouselRef = useRef<any>(null);
  const zoomHeight = height - 100;
  return (
    <Background>
      <PrimaryHeader left="back" />
      <View style={{flex: 1, justifyContent: 'center'}}>
        <Carousel
          defaultIndex={bannerCurrentIndex}
          ref={carouselRef}
          maxScrollDistancePerSwipe={10}
          width={width}
          height={zoomHeight}
          data={images}
          testID={'CarouselImage'}
          renderItem={({item}: any) => (
            //   @ts-ignore
            <ImgZoom
              horizontalOuterRangeOffset={offsetX => {
                if (offsetX === 100) {
                  carouselRef?.current?.prev({count: 1});
                } else if (offsetX === -100) {
                  carouselRef?.current?.next({count: 1});
                }
              }}
              cropWidth={width}
              cropHeight={zoomHeight}
              imageWidth={width}
              imageHeight={width}
              testID={'ImgZoom'}>
              <MyImage
                style={{width: width, height: width, resizeMode: 'contain'}}
                source={item?.image_url}
                testID={'ProductImage'}
              />
            </ImgZoom>
          )}
        />
      </View>
    </Background>
  );
};
