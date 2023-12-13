import React, {FC} from 'react';
import {Background, PrimaryHeader} from '../../components';
import WebView from 'react-native-webview';
import {commonStyles} from '../../styles';
import {CommonNavigationProps} from '../../types/navigationTypes';

export const PolicyView: FC<CommonNavigationProps> = ({route}) => {
  return (
    <Background>
      <PrimaryHeader
        left="back"
        title={route?.params?.label}
        right="home_plus_menu"
      />
      <WebView style={commonStyles.flex1} source={{uri: route?.params?.url}} />
    </Background>
  );
};
