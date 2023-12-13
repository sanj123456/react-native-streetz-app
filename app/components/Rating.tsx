/* eslint-disable react-native/no-inline-styles */
import React, {FC} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {RatingProps} from '../types/components';
import {images} from '../core';

const starList = [1, 2, 3, 4, 5];

export const Rating: FC<RatingProps> = ({
  value,
  onChangeValue,
  size,
  disabled,
  style,
}) => {
  return (
    <View style={{...styles.mainView, ...style}}>
      {starList.map((item, index) => (
        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            height: size === 'small' ? 12 : size === 'large' ? 32 : 20,
            width: size === 'small' ? 12 : size === 'large' ? 32 : 20,
            marginHorizontal: size === 'small' ? 2 : 5,
          }}
          disabled={disabled}
          onPress={() => (onChangeValue ? onChangeValue(item) : null)}
          key={`${index}_star_keys`}>
          <Image
            style={styles.starImage}
            source={item <= value ? images.icActiveStar : images.icInactiveStar}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starWrapper: {},
  starImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
});
