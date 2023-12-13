import React, {FC} from 'react';
import {screenName} from '../core';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Login, SignUp, VerifyOtp} from '../modules/auth';
import {colors, commonStyles} from '../styles';
import {View, SafeAreaView, StatusBar} from 'react-native';

const Stack = createNativeStackNavigator();

const AuthNavigator: FC = () => {
  return (
    <View style={commonStyles.flex1}>
      <StatusBar barStyle={'dark-content'} backgroundColor={colors.primary} />
      <SafeAreaView style={{backgroundColor: colors.primary}} />

      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: colors.transparent,
          },
          gestureEnabled: false,
        }}>
        <Stack.Screen name={screenName.login} component={Login} />
        <Stack.Screen name={screenName.verifyOtp} component={VerifyOtp} />
        <Stack.Screen name={screenName.signUp} component={SignUp} />
      </Stack.Navigator>
    </View>
  );
};

export default AuthNavigator;
