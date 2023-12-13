import React, {FC} from 'react';
import {Text} from 'react-native';
import {fonts} from '../styles';
import {PrimaryTextProps} from '../types/components';

export const PrimaryText: FC<PrimaryTextProps> = ({
  style,
  children,
  props,
  id,
  testID,
  numberOfLines,
}) => {
  return (
    <Text
      id={id}
      numberOfLines={numberOfLines}
      testID={testID}
      style={[fonts.regular14, style]}
      maxFontSizeMultiplier={1.5}
      {...props}>
      {children}
    </Text>
  );
};
