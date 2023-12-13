import React, {FC} from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {images} from '../core';
import {commonStyles} from '../styles';
import {PaymentItemProps} from '../types/components';
import {PrimaryText} from './PrimaryText';
import {dispatch} from '../redux';
import {setPayMode} from '../redux/modules/cartSlice';

export const PaymentItem: FC<PaymentItemProps> = ({
  item,
  onPress,
  selectedItemMode,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={commonStyles.payItemContainContainer}
      onPress={() => dispatch(setPayMode(item))}>
      <Image
        style={commonStyles.icon48}
        source={images?.[item?.img as keyof typeof images]}
      />
      <View style={commonStyles.payCartItemMiddle}>
        <PrimaryText style={commonStyles.payCartItemLabel}>
          {item?.label}
        </PrimaryText>
      </View>
      <Image
        style={commonStyles.icon20}
        source={
          item?.enum === selectedItemMode?.enum
            ? images.icTick
            : images?.icUnTick
        }
      />
    </TouchableOpacity>
  );
};
