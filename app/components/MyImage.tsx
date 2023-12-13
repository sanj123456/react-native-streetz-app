/* eslint-disable react-hooks/exhaustive-deps */
import {FC, useState} from 'react';
import {ImageBackground, Platform, View, Image} from 'react-native';
import {MyImageProps} from '../types/components';
import {images} from '../core';
import {commonStyles} from '../styles';
import FastImage from 'react-native-fast-image';
// *************************************************************
// *********(Use this Component only for s3 image URL)**********
// *************************************************************
export const MyImage: FC<MyImageProps> = ({
  style,
  source,
  sourceType,
  componentType,
  children,
  testID,
  isBanner,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {resizeMode, ...rest} = style;

  return (
    <View style={[commonStyles.myImageWrapper, rest]}>
      {componentType === 'imageBackground' ? (
        sourceType !== 'local' && source? (
          <ImageBackground
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
            style={{
              ...commonStyles.zIndex5,
              ...style,
            }}
            source={{uri: source}}>
            {children}
          </ImageBackground>
        ) : (
          <ImageBackground
            style={{
              ...commonStyles.zIndex5,
              ...style,
            }}
            source={
              sourceType === 'local'
                ? source
                : isBanner
                ? images.dummyNoImageBanner
                : images.dummyNoImage
            }>
            {children}
          </ImageBackground>
        )
      ) : sourceType !== 'local' && source ? (
        Platform.OS === 'ios' ? (
          <FastImage
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
            style={[commonStyles.zIndex5, style]}
            source={{uri: source}}
          />
        ) :   (
          <FastImage
            onLoadStart={() => {
              setIsLoading(true);
            }}
            onLoadEnd={() => {
              setIsLoading(false);
            }}
            resizeMode={resizeMode ?? 'cover'}
           
            style={[commonStyles.zIndex5, style]}
            source={{
              uri: source
            }}
          />
        )
      ) : (
        <FastImage
          style={[commonStyles.zIndex5, style]}
          source={
            sourceType === 'local'
              ? source
              : isBanner
              ? images.dummyNoImageBanner
              : images.dummyNoImage
          }
        />
      )}
      {isLoading && source && (
        <View style={[rest, commonStyles.myImageBackgroundWrapper]}>
          <FastImage
            style={commonStyles.myImageBackground}
            source={images.icNoData}
          />
        </View>
      )}
    </View>
  );
};
