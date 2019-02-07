import React from 'react';
import { StyleSheet, View, Alert, Icon } from 'react-native';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import { createBottomTabNavigator } from 'react-navigation';
import { Notifications } from 'expo';

import LoginScreen from './src/Modules/Authentication/LoginScreen';
import SignUpScreen_1 from './src/Modules/Authentication/SignUpScreen_1';
import SignUpScreen_2 from './src/Modules/Authentication/SignUpScreen_2';
import ConfirmationScreen from './src/Modules/Authentication/ConfirmationScreen'
import ForgotPasswordScreen from './src/Modules/Authentication/ForgotPasswordScreen';

import Reducers from './src/Reducers';
import EAN_Home from './src/Modules/EAN/EAN_Home';

export default class App extends React.Component {

  render() {
    const MainNavigator = createBottomTabNavigator({

      login: { screen: LoginScreen },
      forgot_password: { screen: ForgotPasswordScreen },
      sign_up: { 
        screen: createBottomTabNavigator({
          sign_up_1: { screen: SignUpScreen_1 },
          sign_up_2: { screen: SignUpScreen_2 },
          otp_confirmation: { screen: ConfirmationScreen }
        }, 
        {
          navigationOptions: {
            tabBarVisible: false
          }
        })
      },
      ean_home: { screen: EAN_Home },
    }, {
      navigationOptions: {
        tabBarVisible: false
      }, lazy: true
    });

    const store = createStore(Reducers, {}, applyMiddleware(ReduxThunk));

    return (
      <Provider store={store}>
        <View style={styles.container}>
          <MainNavigator />
      </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
});
 