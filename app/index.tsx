import {NavigationContainer} from '@react-navigation/native';
import React, {FC} from 'react';
import {View} from 'react-native';
import FlashMessage from 'react-native-flash-message';
import {Provider} from 'react-redux';
import {Loader} from './components';
import MainNavigator from './navigation/MainNavigator';
import {navigationRef} from './navigation/RootNavigation';
import store from './redux';
import {commonStyles} from './styles';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import NoInternetModal from './components/NoInternetModal';

const App: FC = ({}) => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Provider store={store}>
        <NavigationContainer ref={navigationRef}>
          <View style={commonStyles.mainView}>
            <MainNavigator />
            <Loader />
            <NoInternetModal />
            <FlashMessage duration={4000} color={'#ffffff'} />
          </View>
        </NavigationContainer>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
