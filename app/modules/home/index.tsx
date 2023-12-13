import React, {FC} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {colors} from '../../styles';
import {screenName} from '../../core';
import {TabNavigator} from '../../navigation/TabNavigator';
import {Stores} from './Stores';
import {StoreDetails} from './StoreDetails';
import {ProductDetails} from './ProductDetails';
import {Cart} from './Cart';
import {MyAddresses} from './MyAddresses';
import {AddAddress} from './AddAddress';
import {DeliverySlot} from './DeliverySlot';
import {Coupons} from './Coupons';
import {TimeToDelivery} from './TimeToDelivery';
import {Search} from './Search';
import {ProductReview} from './ProductReview';
import {BrandStoreList} from './BrandStoreList';
import {Payment} from './Payment';
import {PaymentView} from './PaymentView';
import {Help} from '../profile/Help';
import {ImageZoom} from './ImageZoom';
import {InvoiceView} from './InvoiceView';
import {EditProfile} from '../profile/EditProfile';
import {VerifyOtp} from '../auth';
import {OrderHistory} from '../profile/OrderHistory';
import {OnBoardingForm} from './OnboardingForm';

const Stack = createNativeStackNavigator();

export const HomeStack: FC = ({}) => {
  /*********** Props and data destructuring ***********/

  /*********** Hooks Functions ***********/

  /*********** Main Functions ***********/

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colors.transparent,
        },
        gestureEnabled: false,
      }}>
      <Stack.Screen name={screenName.tab} component={TabNavigator} />
      <Stack.Screen name={screenName.search} component={Search} />
      <Stack.Screen name={screenName.stores} component={Stores} />
      <Stack.Screen
        name={screenName.brandStoreList}
        component={BrandStoreList}
      />
      <Stack.Screen name={screenName.storeDetails} component={StoreDetails} />
      <Stack.Screen
        name={screenName.productDetails}
        component={ProductDetails}
      />
      <Stack.Screen name={screenName.ProductReview} component={ProductReview} />
      <Stack.Screen name={screenName.cart} component={Cart} />
      <Stack.Screen name={screenName.myAddresses} component={MyAddresses} />
      <Stack.Screen name={screenName.addAddress} component={AddAddress} />
      <Stack.Screen name={screenName.deliverySlot} component={DeliverySlot} />
      <Stack.Screen name={screenName.coupons} component={Coupons} />
      <Stack.Screen
        name={screenName.timeToDelivery}
        component={TimeToDelivery}
      />
      <Stack.Screen name={screenName.payment} component={Payment} />
      <Stack.Screen name={screenName.paymentView} component={PaymentView} />
      <Stack.Screen name={screenName.orderHistory} component={OrderHistory} />
      <Stack.Screen name={screenName.help} component={Help} />
      <Stack.Screen name={screenName.imageZoom} component={ImageZoom} />
      <Stack.Screen name={screenName.invoiceView} component={InvoiceView} />
      <Stack.Screen name={screenName.editProfile} component={EditProfile} />
      <Stack.Screen name={screenName.verifyOtp} component={VerifyOtp} />
      <Stack.Screen
        name={screenName.onBoardingForm}
        component={OnBoardingForm}
      />
    </Stack.Navigator>
  );
};
