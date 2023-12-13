import React, { FC } from 'react';
import { Platform } from 'react-native';
import Config from 'react-native-config';
import WebView from 'react-native-webview';
import { Background, PrimaryHeader } from '../../components';
import { dispatch } from '../../redux';
import { setIsLoading } from '../../redux/modules/genericSlice';
import { checkPaymentStatusAPI } from '../../services';
import { commonStyles } from '../../styles';
import { CommonNavigationProps } from '../../types/navigationTypes';

export const PaymentView: FC<CommonNavigationProps> = ({route, navigation}) => {
  const paymentURL = Config.PAYMENT_URL ?? '';


  /******************************************************************************/
  /********************** Encoding to post data in WebView **********************/
  /******************************************************************************/
  const postData = route?.params?.paymentData;
  // const headerObj = {'Content-Type': 'application/x-www-form-urlencoded'};
  // let urlEncodedData = '',
  //   urlEncodedDataPairs = [],
  //   key;
  // for (key in postData) {
  //   urlEncodedDataPairs.push(
  //     encodeURIComponent(key) + '=' + encodeURIComponent(postData[key]),
  //   );
  // }
  // urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');
  /******************************************************************************/
  /******************************************************************************/
  /******************************************************************************/

  const onNavigationStateChange = (nav: any) => {
    // if (
    //   (nav?.url === postData?.return_url ||
    //     nav?.url === postData?.return_url_cancel ||
    //     nav?.url === postData?.return_url_failure) &&
    //   nav?.title?.length === 0 &&
    if (
      (nav?.url === postData?.returnUrl || nav?.url === postData?.cancelUrl) &&
      nav?.title?.length === 0 &&
      Platform.OS === 'ios'
    ) {
      checkPaymentStatusAPI(
        {
          order_id: route?.params?.orderData?.id,
        },
        navigation,
        route?.params?.orderData,
      );
    } else if (
      (nav?.url === postData?.returnUrl || nav?.url === postData?.cancelUrl) &&
      !nav?.loading &&
      Platform.OS === 'android'
    ) {
      checkPaymentStatusAPI(
        {
          order_id: route?.params?.orderData?.id,
        },
        navigation,
        route?.params?.orderData,
      );
    }
  };

  return (
    <Background>
      <PrimaryHeader left="back" title={route?.params?.label} />
      <WebView
        style={commonStyles.flex1}
        source={{
          uri: postData.url,
          // method: 'POST',
          // headers: headerObj,
          // body: urlEncodedData,
        }}
        javaScriptEnabled
        onNavigationStateChange={onNavigationStateChange}
        onLoadStart={() => dispatch(setIsLoading(true))}
        onLoadEnd={() => dispatch(setIsLoading(false))}
      />
    </Background>
  );
};
