import React, {FC} from 'react';
import {ImageBackground, StyleSheet, View} from 'react-native';
import {BackgroundProps} from '../types/components';
import {images} from '../core';

export const Background: FC<BackgroundProps> = ({children}) => {
  return (
    <View style={styles.mainView} testID={'BackgroundMainView'}>
      <ImageBackground
        style={styles.bgImage}
        source={images.dummyBackground}
        testID={'ImageBackground'}>
        {children}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  bgImage: {
    height: '100%',
    width: '100%',
  },
});
