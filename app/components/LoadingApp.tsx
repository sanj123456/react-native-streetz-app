import React, {FC} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {colors, commonStyles} from '../styles';

export const LoadingApp: FC = () => {
  return (
    <View
      style={{
        ...commonStyles.mainView,
      }}
      testID={`LoadingApp`}></View>
  );
};
