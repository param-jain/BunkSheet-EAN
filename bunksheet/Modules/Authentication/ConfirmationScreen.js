import React, { Component } from 'react';

import {
    StyleSheet,
    View,
    Text,
    TextInput,
    Image,
    Dimensions,
    Keyboard,
    TouchableOpacity,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    StatusBar
  } from 'react-native'

import { Button, Icon } from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from 'react-redux'

import { 
  signupOTPChanged,
  signupEmailChanged
} from '../../actions/index'

import  Amplify, { Auth } from 'aws-amplify';
import awsConfig from '../../sensitive_info/aws-exports';

Amplify.configure({ Auth: awsConfig });



class ConfirmationScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
        errorMessage: '',
        isAuthenticating: false,
        username: this.props.navigation.state.params.user.username,
    }
}

    backButtonNavigation() {

        this.setState({ errorMessage: '' });
        this.props.navigation.navigate('sign_up_2');
    }

    confirmOTP() {
        const { OTP, email } = this.props;

        this.setState({ isAuthenticating: true, errorMessage: '' });

       Auth.confirmSignUp(this.state.username, OTP)
          .then(data => { 
                this.setState({ isAuthenticating: false });
              this.props.navigation.navigate('all_books_list');
            })
          .catch(err => { 
            this.setState({ isAuthenticating: false });
              this.setState({ errorMessage: err.message }); 
            });
    }

    onOTPChange(text) {
      text=text.trim();
      this.props.signupOTPChanged(text);
    }

    validateOTP = (OTP) => {
        if (!this.props.OTPTouched) {
          return(
            <View>
              <TextInput
                underlineColorAndroid="transparent" 
                placeholder="Confirmation Code" 
                placeholderColor="#c4c3cb"
                keyboardType="numeric"
                style={styles.loginFormTextInput} 
                onChangeText={this.onOTPChange.bind(this)}
                value={this.props.OTP}
              />
            </View>
          );
        } else {
          if (OTP.length!=6) {
            return(
              <View>
                <TextInput
                  underlineColorAndroid="transparent" 
                  placeholder="Confirmation Code" 
                  placeholderColor="#c4c3cb" 
                  keyboardType="numeric"
                  style={[styles.loginFormTextInput, { borderColor: '#DD2C00' }]} 
                  onChangeText={this.onOTPChange.bind(this)}
                  value={this.props.OTP}
                />
                <Text style={styles.errorMessage}>Confirmation Code is 6 Digits Long!!!</Text>             
              </View>
            );
          } else {
            return(
              <View>
                <TextInput
                  underlineColorAndroid="transparent" 
                  placeholder="Confirmation Code" 
                  placeholderColor="#c4c3cb" 
                  keyboardType="numeric"
                  style={[styles.loginFormTextInput, { borderColor: '#1B5E20' }]} 
                  onChangeText={this.onOTPChange.bind(this)}
                  value={this.props.OTP}
                />
              </View>
            );
          }
        }
      }

    enableCheckButton = (OTP) => {
        if(OTP.length!=6) {
          return (
            <TouchableOpacity 
              style={styles.checkButton} 
              onPress={this.confirmOTP.bind(this)}
              disabled
            >
                <Icon
                    raised
                    name = 'cross'
                    type = 'entypo'
                    color = '#777777'
                    style ={styles.checkButtonLayout} />
          </TouchableOpacity>
          );
        } else {
          return (
            <TouchableOpacity 
              style={styles.checkButton} 
              onPress={this.confirmOTP.bind(this)}
            >
                <Icon
                    raised
                    name = 'check'
                    type = 'fontawesome'
                    color = '#1B5E20'
                    style ={styles.checkButtonLayout} />
          </TouchableOpacity>
          );
        }
      }

    render() {

      const { OTP } = this.props;

        return (
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                <StatusBar barStyle = "dark-content" hidden = {true} translucent = {true}/>
                <Image style={styles.bg} source={require('../../images/orange-owl-hi-flipped.png')} />
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.container}>

                        <View style={styles.headerIconView}>
                            <TouchableOpacity style={styles.headerBackButtonView} onPress={this.backButtonNavigation.bind(this)} disabled>
                                <Image style={styles.backButtonIcon} source={require('../../images/black_back.png')} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.headerTitleView}>
                            <Text style={styles.titleViewText}>Confirmation Code ...</Text>
                        </View>


                        <Spinner visible={this.state.isAuthenticating} />

                        <View style={styles.loginFormView}>
                        <Text style={styles.promptMessage}>Confirmation Code has been sent to your Registered Email ID. Kindly check your Inbox ... </Text>
                          {this.validateOTP(OTP)}
                          <Text style={styles.errorMessage}>{this.state.errorMessage}</Text>
                          {this.enableCheckButton(OTP)}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        );
    }
}

let styles = StyleSheet.create({
    container: {
      flexDirection: 'column',
      flex: 1,
      backgroundColor: 'transparent'
    },
    bg: {
      position: 'absolute',
      left: 25,
      top: 100,
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height
    },
    headerIconView: {
      flex: 0.15,
      backgroundColor: 'transparent'
    },
    headerBackButtonView: {
      width: 35,
      height: 35,
      position: 'absolute',
      top: 35,
      left: 15,
      marginBottom: 10
    },
    backButtonIcon: {
      resizeMode: 'contain',
      width: 35,
      height: 25
    },
    headerTitleView: {
      backgroundColor: 'transparent',
      paddingLeft: 25,
      marginBottom:0,
      marginTop: 0
    },
    titleViewText: {
      fontSize: 30,
      fontWeight: 'bold',
      color: '#EF6C00',
      marginTop: 20,
      marginBottom: 10,
    },
    loginFormView: {
        marginTop: 40,
        flex: 1,
    },
    loginFormTextInput: {
        height: 43,
        fontSize: 14,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#777777',
        backgroundColor: '#fafafa',
        paddingLeft: 10,
        marginLeft: 15,
        marginRight: 15,
        marginTop: 5,
        marginBottom: 10,
      
    },
    errorMessage: {
        color: 'red',
        marginLeft: 15,
        marginRight: 15,
        marginBottom: 5,
    },
    promptMessage: {
        color: '#444444',
        marginLeft: 15,
        marginRight: 15,
        marginBottom: 5,
    },
    checkButtonLayout: {
        marginTop: 50,

    },
    checkButton: {
      flexDirection: 'row', 
      justifyContent: 'space-around',
      marginTop: 30
    },
  });

const mapStateToProps = (state) => ({
    OTP: state.sign_up.OTP,
    OTPTouched: state.sign_up.OTPTouched,
    email: state.sign_up.email
});

export default connect(mapStateToProps, {
    signupOTPChanged,
    signupEmailChanged
})(ConfirmationScreen);
