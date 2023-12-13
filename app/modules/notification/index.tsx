import React, {FC} from 'react';
import {View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {colors, commonStyles} from '../../styles';
import {screenName} from '../../core';
import {Notification} from './Notification';
import {StoreDetails} from '../home/StoreDetails';
import {TimeToDelivery} from '../home/TimeToDelivery';

const Stack = createNativeStackNavigator();

export const NotificationStack: FC = ({}) => {
  /*********** Props and data destructuring ***********/

  /*********** Hooks Functions ***********/

  /*********** Main Functions ***********/

  return (
    <View style={commonStyles.flex1}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: colors.transparent,
          },
          gestureEnabled: false,
        }}>
        <Stack.Screen name={screenName.notification} component={Notification} />
        <Stack.Screen name={screenName.storeDetails} component={StoreDetails} />
        <Stack.Screen
          name={screenName.timeToDelivery}
          component={TimeToDelivery}
        />
      </Stack.Navigator>
    </View>
  );
};
