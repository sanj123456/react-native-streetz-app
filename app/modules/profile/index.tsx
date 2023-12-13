import React, {FC} from 'react';
import {View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {colors, commonStyles} from '../../styles';
import {screenName} from '../../core';
import {MyProfile} from './MyProfile';
import {MyAddresses} from '../home/MyAddresses';
import {EditProfile} from './EditProfile';
import {OrderHistory} from './OrderHistory';
import {VerifyOtp} from '../auth/VerifyOtp';
import {AddAddress} from '../home/AddAddress';
import {TimeToDelivery} from '../home/TimeToDelivery';
import {Help} from './Help';

const Stack = createNativeStackNavigator();

export const ProfileStack: FC = ({}) => {
  /*********** Props and data destructuring ***********/

  /*********** Hooks Functions ***********/

  /*********** Main Functions ***********/

  return (
    <View style={commonStyles.flex1}>
      <Stack.Navigator
        initialRouteName={screenName.myProfile}
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: colors.transparent,
          },
          gestureEnabled: false,
        }}>
        <Stack.Screen name={screenName.myProfile} component={MyProfile} />
        <Stack.Screen name={screenName.myAddresses} component={MyAddresses} />
        <Stack.Screen name={screenName.addAddress} component={AddAddress} />
        <Stack.Screen name={screenName.editProfile} component={EditProfile} />
        <Stack.Screen name={screenName.verifyOtp} component={VerifyOtp} />
        <Stack.Screen name={screenName.orderHistory} component={OrderHistory} />
        <Stack.Screen
          name={screenName.timeToDelivery}
          component={TimeToDelivery}
        />
        <Stack.Screen name={screenName.help} component={Help} />
      </Stack.Navigator>
    </View>
  );
};
