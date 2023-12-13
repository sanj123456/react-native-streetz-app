import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React, {useRef, useEffect, useState} from 'react';
import Modal from 'react-native-modal';
import WebView from 'react-native-webview';
import {images} from '../core';
import {useNavigation} from '@react-navigation/native';
import {InstaAuthProps} from '../types/components';
const instaConfig = {
  client_id: 284304564190786,
  redirect_uri: 'https://streetz.shop/',
  scope: ['user_profile', 'user_media'].join(','),
  response_type: 'code',
};
const insta_uri = `https://api.instagram.com/oauth/authorize?client_id=${instaConfig.client_id}&redirect_uri=${instaConfig.redirect_uri}&scope=${instaConfig.scope}&response_type=${instaConfig.response_type}`;

export default function InstagramWebAuth(props: InstaAuthProps) {
  const webViewRef = useRef(null);
  const [url, setUrl] = useState('');

  const navigation = useNavigation();

  useEffect(() => {
    navigation?.addListener('focus', () => {});
  }, [navigation]);

  useEffect(() => {
    if (url && url.startsWith(instaConfig.redirect_uri)) {
      // Extract the access token from the URL
      const regex = /code=([^&]+)/;
      const match = url.match(regex);
      if (match) {
        const accessToken = match[1];
        props.onLoginSuccess(accessToken);
      }
      props.onClose();
    }
  }, [url]);

  const handleNavigationStateChange = (newNavState: any) => {
    setUrl(newNavState.url);
  };

  return (
    <Modal isVisible={props.isVisible}>
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: '#FFF',
          width: '100%',
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={props.onClose}
          style={{
            alignSelf: 'auto',
            width: 64,
            height: 64,

            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={{
              uri: Image.resolveAssetSource(images.icClose).uri,
              width: 32,
              height: 32,
            }}
          />
        </TouchableOpacity>
      </View>
      <WebView
        ref={webViewRef}
        incognito
        onShouldStartLoadWithRequest={false}
        onNavigationStateChange={handleNavigationStateChange}
        source={{uri: insta_uri}}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalHeader: {
    flexDirection: 'row',
  },
});
