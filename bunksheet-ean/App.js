import React from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { Icon } from 'react-native-elements';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import { Notifications } from 'expo';

import LoginScreen from './src/Modules/Authentication/LoginScreen';
import SignUpScreen_1 from './src/Modules/Authentication/SignUpScreen_1';
import SignUpScreen_2 from './src/Modules/Authentication/SignUpScreen_2';
import ConfirmationScreen from './src/Modules/Authentication/ConfirmationScreen'
import ForgotPasswordScreen from './src/Modules/Authentication/ForgotPasswordScreen';

import Reducers from './src/Reducers';
import EAN_Home from './src/Modules/EAN/EAN_Home';
import User_Profile from './src/Modules/EAN/User_Profile';

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
      main: {
        screen: createBottomTabNavigator({
          ean: {
            screen: createStackNavigator({
              ean_home: { screen: EAN_Home },     
              profile: { screen: User_Profile } 
            }), 
            navigationOptions: {
              title: "E A N",
              tabBarIcon: ({ tintColor }) => {
                return <Icon name="paper-plane" type="font-awesome" size={22} color={tintColor} />;
              },
            }
          }
        }, {
          tabBarPosition: 'bottom',
          tabBarOptions: {
            labelStyle: { fontSize: 12 }
          }
        })
      }
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
 