import React, { Component } from 'react';

import {
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StatusBar,
  Keyboard,
  Dimensions,
  View 
} from 'react-native';

import { Button } from 'react-native-elements';

import Spinner from 'react-native-loading-spinner-overlay';

import Amplify, { Auth } from 'aws-amplify';
import awsConfig from '../../sensitive_info/aws-exports';

Amplify.configure({Auth: awsConfig});

export default class ForgotPasswordScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            errorMessage: '',
            email: '',
            emailTouched: false,
            resetPassword: false,
            resetCode: '',
            resetCodeTouched: false,
            isAuthenticating: false,
            newPassword: '',
            newPasswordTouched: false
        };
    }

    backButtonNavigation() {
        this.setState({
            isAuthenticating: false, 
            email: '', 
            emailTouched: false, 
            resetPassword: false, 
            newPassword: '', 
            newPasswordTouched: false, 
            resetCode: '', 
            resetCodeTouched: false,
            errorMessage: ''
          });
        this.props.navigation.navigate('login');
    }

    validateEmail = (email) => {
        if (!this.state.emailTouched) {
            return (  
                <View>
                    <TextInput
                        keyboardType={'email-address'}
                        autoCapitalize = 'none'
                        underlineColorAndroid="transparent" 
                        placeholder="Email" 
                        placeholderColor="#c4c3cb" 
                        style={styles.loginFormTextInput} 
                        onFocus = { () => this.setState({username: ""})}
                        onChangeText={(email) => this.setState({email: email, emailTouched: true})}
                        value={this.state.email}
                    />
                </View>        
            );
        } else {
            if (email.length < 5) {
                return (  
                    <View>
                        <TextInput
                            keyboardType={'email-address'}
                            autoCapitalize = 'none'
                            underlineColorAndroid="transparent" 
                            placeholder="Email" 
                            placeholderColor="#c4c3cb" 
                            style={[styles.loginFormTextInput, {borderColor: '#DD2C00'}]} 
                            onFocus = { () => this.setState({username: ""})}
                            onChangeText={(email) => this.setState({email: email, emailTouched: true})}
                            value={this.state.email}
                        />
                        <Text style={styles.errorMessage}>Email should be at least 5 characters long!</Text>
                    </View>        
                );
            } else if (email.split('').filter(x => x === '@').length !== 1) {
                return (  
                    <View>
                        <TextInput
                            keyboardType={'email-address'}
                            autoCapitalize = 'none'
                            underlineColorAndroid="transparent" 
                            placeholder="Email" 
                            placeholderColor="#c4c3cb" 
                            style={[styles.loginFormTextInput, {borderColor: '#DD2C00'}]} 
                            onFocus = { () => this.setState({username: ""})}
                            onChangeText={(email) => this.setState({email: email, emailTouched: true})}
                            value={this.state.email}
                        />
                        <Text style={styles.errorMessage}>Email should contain '@'</Text>
                    </View>        
                );
            } else if (email.indexOf('.') === -1) {
                return (  
                    <View>
                        <TextInput
                            keyboardType={'email-address'}
                            autoCapitalize = 'none'
                            underlineColorAndroid="transparent" 
                            placeholder="Email" 
                            placeholderColor="#c4c3cb" 
                            style={[styles.loginFormTextInput, {borderColor: '#DD2C00'}]} 
                            onFocus = { () => this.setState({username: ""})}
                            onChangeText={(email) => this.setState({email: email, emailTouched: true})}
                            value={this.state.email}
                        />
                        <Text style={styles.errorMessage}>Email should contain at least one dot (.)</Text>
                    </View>        
                );
            } else {
                return (  
                    <View>
                        <TextInput
                            keyboardType={'email-address'}
                            autoCapitalize = 'none'
                            underlineColorAndroid="transparent" 
                            placeholder="Email" 
                            placeholderColor="#c4c3cb" 
                            style={[styles.loginFormTextInput, {borderColor: '#1B5E20'}]} 
                            onFocus = { () => this.setState({username: ""})}
                            onChangeText={(email) => this.setState({email: email, emailTouched: true})}
                            value={this.state.email}
                        />
                    </View>        
                );
            }
        }
    }

    validateOTP = (OTP) => {
        if (!this.state.resetCodeTouched) {
          return(
            <View>
              <TextInput
                underlineColorAndroid="transparent" 
                placeholder="Reset Code" 
                placeholderColor="#c4c3cb"
                keyboardType="numeric"
                style={styles.loginFormTextInput} 
                onChangeText={(resetCode) => this.setState({ resetCode: resetCode, resetCodeTouched: true})}
                value={this.state.resetCode}
              />
            </View>
          );
        } else {
            if (OTP.length!=6) {
                return(
                <View>
                    <TextInput
                    underlineColorAndroid="transparent" 
                    placeholder="Reset Code" 
                    placeholderColor="#c4c3cb" 
                    keyboardType="numeric"
                    style={[styles.loginFormTextInput, { borderColor: '#DD2C00' }]} 
                    onChangeText={(resetCode) => this.setState({ resetCode: resetCode, resetCodeTouched: true})}
                    value={this.state.resetCode}
                    />
                    <Text style={styles.errorMessage}>Confirmation Code is 6 Digits Long!!!</Text>             
                </View>
                );
            } else {
                return(
                <View>
                    <TextInput
                    underlineColorAndroid="transparent" 
                    placeholder="Reset Code" 
                    placeholderColor="#c4c3cb" 
                    keyboardType="numeric"
                    style={[styles.loginFormTextInput, { borderColor: '#1B5E20' }]} 
                    onChangeText={(resetCode) => this.setState({ resetCode: resetCode, resetCodeTouched: true})}
                    value={this.state.resetCode}
                    />
                </View>
                );
            }
        }
    }

      validatePassword = (password) => {
        if (!this.state.newPasswordTouched) {
            return (  
                <View>
                    <TextInput
                            underlineColorAndroid="transparent" 
                            placeholder="New Password" 
                            placeholderColor="#c4c3cb" 
                            style={styles.loginFormTextInput} 
                            secureTextEntry={true}
                            onChangeText={(newPassword) => this.setState({ newPassword: newPassword, newPasswordTouched: true})}
                            value={this.state.newPassword}
                        />
                </View>        
            );
        } else { 
            if (password.length < 8) {
                return (
                    <View>
                         <TextInput
                            underlineColorAndroid="transparent" 
                            placeholder="New Password" 
                            placeholderColor="#c4c3cb" 
                            style={[styles.loginFormTextInput, {borderColor: '#DD2C00'}]} 
                            secureTextEntry={true}
                            onChangeText={(newPassword) => this.setState({ newPassword: newPassword, newPasswordTouched: true})}
                            value={this.state.newPassword}
                        />
                        <Text style={styles.errorMessage}>Password should be at least 8 characters long</Text>
                    </View>
                );
            } else {
                return (
                    <View>
                         <TextInput
                            underlineColorAndroid="transparent" 
                            placeholder="New Password" 
                            placeholderColor="#c4c3cb" 
                            style={[styles.loginFormTextInput, {borderColor: '#1B5E20'}]} 
                            secureTextEntry={true}
                            onChangeText={(newPassword) => this.setState({ newPassword: newPassword, newPasswordTouched: true})}
                            value={this.state.newPassword}
                        />
                    </View>
                );
            }
        }
    }


    renderIf = (condition, content) => {
        if (condition) {
            return content;
          } else {
            return null;
          }
    }

    resetPasswordFields = () => {
        return(
            <View>
                {this.validateOTP(this.state.resetCode)}
                {this.validatePassword(this.state.newPassword)}
            </View>
        );
    }

    onRecoverPress() {
        this.setState({ isAuthenticating: true, errorMessage: '' });
        
        if(this.state.resetPassword === true) {
            Auth.forgotPasswordSubmit(this.state.email, this.state.resetCode, this.state.newPassword)
              .then(() => {
                  this.setState({
                      isAuthenticating: false, 
                      email: '', 
                      emailTouched: false, 
                      resetPassword: false, 
                      newPassword: '', 
                      newPasswordTouched: false, 
                      resetCode: '', 
                      resetCodeTouched: false,
                      errorMessage: ''
                    });
                  this.props.navigation.navigate('login');
                })
              .catch(err => {
                  this.setState({isAuthenticating: false});
                  this.setState({ errorMessage: err.message });
                });
          } else {
            Auth.forgotPassword(this.state.email)
              .then(() => { this.setState({ resetPassword: true, isAuthenticating: false, errorMessage: '' }) })
              .catch(err => {
                  this.setState({isAuthenticating: false});
                  this.setState({ errorMessage: err.message }); 
              });
          }
    }

    showMessage= (condition) => {
        if (condition) {
            return (
                <Text style={styles.promptMessage}>Reset Code has been sent to your Registered Email ID. Kindly check your Inbox ... </Text>
            );
        }
    }

    render() {
        return(
            <KeyboardAvoidingView behavior = "padding" style = {styles.containerView}>
                <StatusBar barStyle = "dark-content" hidden = {false} translucent = {true}/>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.containerView}>

                        <View style={styles.headerIconView}>
                            <TouchableOpacity style={styles.headerBackButtonView} onPress={this.backButtonNavigation.bind(this)}>
                                <Image style={styles.backButtonIcon} source={require('../../images/black_back.png')} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.logoImageView}>
                            <Image 
                                style={styles.logoImage}
                                source={require('../../images/confused-brown-md.png')}
                            />
                        </View>

                        <View style={styles.loginFormView}>
                            <Text style={styles.logoText}>Forgot Password</Text>
                            
                            <Text style={styles.errorMessage}>
                            {this.state.errorMessage}
                            </Text>

                            {this.showMessage(this.state.resetPassword)}

                            {this.validateEmail(this.state.email)}
                            {this.renderIf(this.state.resetPassword, this.resetPasswordFields())}
                            <Spinner visible={this.state.isAuthenticating} />
                            <Button
                                buttonStyle={styles.recoverButton}
                                onPress={() => this.onRecoverPress()}
                                title="Recover"
                                ViewComponent={require('expo').LinearGradient}
                                linearGradientProps={{
                                    colors: ['#E65100', '#FF9800'],
                                    start: [1, 0],
                                    end: [0.2, 0],
                                }}
                                //disabled={this.loginButtonDisabled(this.props.email, this.props.password)}
                        />
                        </View>

                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        );
    }
}

const styles = {
    containerView: {
        flex:1
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
    loginFormView: {
        justifyContent: 'center',
        flex: 1,
    },
    logoText: {
        fontSize: 30,
        fontWeight: "700",
        marginBottom: 30,
        textAlign: 'center',
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
        marginBottom: 5,
    },
    recoverButton: {
        backgroundColor: '#FF6D00',
        borderRadius: 5,
        height: 45,
        marginTop: 10,
        marginLeft: 15,
        marginRight: 15,
    },
    logoImage: {
        marginTop: 7,
    },
    logoImageView: { 
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },

}
