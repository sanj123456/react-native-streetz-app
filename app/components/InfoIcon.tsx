import React, {FC, useState} from 'react';
import {TouchableOpacity, Image, StyleSheet} from 'react-native';
import {images} from '../core';
import {InfoIconProps} from '../types/components';
import Tooltip from 'react-native-walkthrough-tooltip';
import {PrimaryText} from './PrimaryText';
import {colors, commonStyles} from '../styles';

export const InfoIcon: FC<InfoIconProps> = ({msg, onPress, type}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <>
      <Tooltip
        disableShadow
        isVisible={showTooltip}
        content={<PrimaryText>{msg}</PrimaryText>}
        placement="top"
        onClose={() => setShowTooltip(false)}>
        <TouchableOpacity
          hitSlop={commonStyles.hitSlop5}
          onPress={() =>
            type === 'on_press' && onPress ? onPress() : setShowTooltip(true)
          }
          style={type === 'on_press' ? styles.btnInfo22 : styles.btnInfo}
          testID={`ShowTooltip`}>
          <Image
            style={[
              styles.imgInfo,
              {
                tintColor: type === 'on_press' ? colors.white : colors.black,
              },
            ]}
            source={images.icInfo}
            testID={`ShowTooltipInfo`}
          />
        </TouchableOpacity>
      </Tooltip>
    </>
  );
};

const styles = StyleSheet.create({
  btnInfo: {
    height: 16,
    width: 16,
    marginHorizontal: 5,
  },
  btnInfo22: {
    height: 22,
    width: 22,
    marginHorizontal: 5,
  },
  imgInfo: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
});
