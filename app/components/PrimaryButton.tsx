import React, {FC} from 'react';
import {TouchableOpacity} from 'react-native';
import {colors, commonStyles} from '../styles';
import {PrimaryButtonProps} from '../types/components';
import {PrimaryText} from './PrimaryText';

export const PrimaryButton: FC<PrimaryButtonProps> = ({
  style,
  title,
  addMargin,
  onPress,
  onPressIn,
  onPressOut,
  disabled,
  id,
  testID,
}) => {
  return (
    <TouchableOpacity
      id={id}
      testID={`${testID}Btn`}
      disabled={disabled}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      activeOpacity={0.8}
      style={[
        commonStyles.primaryButtonStyle,
        !disabled ? commonStyles.shadowPrimaryStyles : undefined,
        {
          marginTop: addMargin ?? 0,
          backgroundColor: disabled ? colors.borderColor2 : colors.primary,
        },
        style,
      ]}>
      <PrimaryText
        testID={`${testID}BtnLabel`}
        style={commonStyles.primaryButtonLabelStyles}>
        {title}
      </PrimaryText>
    </TouchableOpacity>
  );
};
