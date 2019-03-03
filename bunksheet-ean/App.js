import React from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { Icon } from 'react-native-elements';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import { createBottomTabNavigator, createStackNavigator, createMaterialTopTabNavigator } from 'react-navigation';
import { Notifications } from 'expo';

import LoginScreen from './src/Modules/Authentication/LoginScreen';
import SignUpScreen_1 from './src/Modules/Authentication/SignUpScreen_1';
import SignUpScreen_2 from './src/Modules/Authentication/SignUpScreen_2';
import ConfirmationScreen from './src/Modules/Authentication/ConfirmationScreen'
import ForgotPasswordScreen from './src/Modules/Authentication/ForgotPasswordScreen';

import Reducers from './src/Reducers';
import Notices from './src/Modules/EAN/Notices';
import User_Profile from './src/Modules/EAN/User_Profile';
import Assignments from './src/Modules/EAN/Assignments';
import Exams from './src/Modules/EAN/Exams';
import AcademicDetailsPage from './src/Modules/Authentication/AcademicDetailsPage';

export default class App extends React.Component {

  render() {
    const MainNavigator = createBottomTabNavigator({

      //academic_details: { screen: AcademicDetailsPage },
      login: { screen: LoginScreen },
      forgot_password: { screen: ForgotPasswordScreen },
      academic_details: { screen: AcademicDetailsPage },
      sign_up: { 
        screen: createBottomTabNavigator({
          sign_up_1: { screen: SignUpScreen_1 },
          sign_up_2: { screen: SignUpScreen_2 },
          otp_confirmation: { screen: ConfirmationScreen },
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
            screen: createMaterialTopTabNavigator({
              assignments: { screen: Assignments },
              ean_home: {
                screen: createStackNavigator({
                  notices: { screen: Notices },     
                  profile: { screen: User_Profile, navigationOptions: { tabBarVisible: false } } 
                }),
                navigationOptions: {
                  title: "Notices",
                  tabBarVisible: true, //=> Remove comment in V2 of EAN Module
                  tabBarIcon:({ tintColor }) => {
                    return <Icon name="bullhorn" type="font-awesome" size={22} color={tintColor} />;
                  },
                }, 
              },
              exams: { screen: Exams },
            }, {
              tabBarPosition: 'bottom',
              swipeEnabled: true,
              tabBarOptions: { 
                showIcon: true, 
                showLabel: false, 
                style: {
                backgroundColor: '#F9A825',
              }
            },
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
 