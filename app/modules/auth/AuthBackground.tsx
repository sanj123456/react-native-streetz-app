import {FC, memo} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {images} from '../../core';
import {authBgStyles, commonStyles} from '../../styles';
import {AuthBackgroundProps} from '../../types/components';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Background} from '../../components';

const AuthBackground: FC<AuthBackgroundProps> = props => {
  const {children, title, smallTitle, onBack} = props;
  const safeArea = useSafeAreaInsets();

  return (
    <Background>
      <KeyboardAwareScrollView
        contentContainerStyle={[authBgStyles.root, {paddingBottom: safeArea.bottom}]}
        bounces={false}
        extraScrollHeight={0}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={false}
        showsVerticalScrollIndicator={false}
        testID={`AuthBackground`}>
        <View style={authBgStyles.container}>
          {onBack ? (
            <TouchableOpacity
              activeOpacity={0.8}
              testID="btnBackHeader"
              onPress={() => {
                onBack ? onBack() : null;
              }}>
              <Image style={commonStyles.icon29} source={images.icBack} />
            </TouchableOpacity>
          ) : null}

          <FastImage
            source={images.icLogo}
            resizeMode="contain"
            style={authBgStyles.logo}
          />
          <View style={authBgStyles.textContainer}>
            {smallTitle ? (
              <Text style={authBgStyles.smallTextStyle}>{smallTitle}</Text>
            ) : null}
            <Text style={authBgStyles.textStyle}>{title}</Text>
          </View>
        </View>
        <View style={authBgStyles.contentContainerStyle}>{children}</View>
      </KeyboardAwareScrollView>
    </Background>
  );
};
export default memo(AuthBackground);

