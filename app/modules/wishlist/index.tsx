import React, {FC} from 'react';
import {View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {colors, commonStyles} from '../../styles';
import {screenName} from '../../core';
import {WishList} from './WishList';
import {ProductDetails} from '../home/ProductDetails';

const Stack = createNativeStackNavigator();

export const WishlistStack: FC = ({}) => {
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
        <Stack.Screen name={screenName.wishList} component={WishList} />
        <Stack.Screen
          name={screenName.productDetails}
          component={ProductDetails}
        />
      </Stack.Navigator>
    </View>
  );
};
