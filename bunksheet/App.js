import React from 'react';
import { StyleSheet, View, Alert, Icon } from 'react-native';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import { createBottomTabNavigator } from 'react-navigation';
import { Notifications } from 'expo';

import LoginScreen from './Modules/Authentication/LoginScreen';
import SignUpScreen_1 from './Modules/Authentication/SignUpScreen_1';
import SignUpScreen_2 from './Modules/Authentication/SignUpScreen_2';
import ConfirmationScreen from './Modules/Authentication/ConfirmationScreen'
import ForgotPasswordScreen from './Modules/Authentication/ForgotPasswordScreen';
import LibraryNotificationScreen from './Modules/Library/LibraryNotificationScreen';
import BarCodeScannerScreen from './Modules/Library/BarCodeScanner'
import FreshArrivalsList from './Modules/Library/FreshArrivalsList';
import AllBooksListScreen from './Modules/Library/AllBooksListScreen';

import registerForNotifications from './Modules/Services/push_notifications_service'
import Issuance from './Modules/Library/IssuancePage';
import ReturnSuccessToken from './Modules/Library/ReturnSuccessToken';
import ReturnFailureToken from './Modules/Library/ReturnFailureToken';
import ReturnPendingToken from './Modules/Library/ReturnApprovalPending';
import IssueSuccessToken from './Modules/Library/IssueSuccessToken';
import IssueFailureToken from './Modules/Library/IssueFailureToken';
import IssuePendingToken from './Modules/Library/IssuePendingToken';

import reducers from './reducers';

import axios from 'axios';
const BUNKSHEET_TOKEN_STORAGE = "https://mighty-hollows-23016.herokuapp.com/cc/addExpoToken";


export default class App extends React.Component {

  async componentDidMount() {
    registerForNotifications();

    let token = await Notifications.getExpoPushTokenAsync();
        await axios.post(BUNKSHEET_TOKEN_STORAGE, { expoToken: token })
          .then(console.log('Current Token Stored in BS Database: ' + token));

    Notifications.addListener((notification) => {
        console.log("Notification: " +JSON.stringify(notification));
        Alert.alert(
          'New Notice',
          'Check your Library Notifications Page',
          [{ text: 'Ok.' }]
        );
    });  
  }

  render() {
    const MainNavigator = createBottomTabNavigator({

      login: { screen: LoginScreen },
        library: {
          screen: createBottomTabNavigator({
            all_books_list: { screen: AllBooksListScreen },
            freshArrivals: { screen: FreshArrivalsList },
            //returnPendingToken: { screen: ReturnPendingToken },
            //issuePendingToken: { screen: IssuePendingToken },
           })
         },
       barCodeScanner: { screen: BarCodeScannerScreen },
       issuance: { screen: Issuance },
       libraryNotifications: { screen: LibraryNotificationScreen},
       returnSuccessToken: { screen: ReturnSuccessToken },
       returnFailureToken: { screen: ReturnFailureToken },
       returnPendingToken: { screen: ReturnPendingToken },
       issueSuccessToken: { screen: IssueSuccessToken },
       issueFailureToken: { screen: IssueFailureToken },
       issuePendingToken: { screen: IssuePendingToken },

       //login: { screen: LoginScreen },
        forgot_password: { screen: ForgotPasswordScreen },

        sign_up: { 
          screen: createBottomTabNavigator({
            sign_up_1: { screen: SignUpScreen_1 },
            sign_up_2: { screen: SignUpScreen_2 },
            otp_confirmation: { screen: ConfirmationScreen }
          }, {
            navigationOptions: {
              tabBarVisible: false
            }
          })
        }
      }, {
        navigationOptions: {
          tabBarVisible: false
        }, lazy: true
    });

    const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));

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
 