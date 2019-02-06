import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Keyboard, Text, View, TextInput, Alert, TouchableWithoutFeedback, Image, KeyboardAvoidingView, StatusBar, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';

import { emailChanged, passwordChanged, loginUser } from '../../actions/index';

import Amplify, { Auth } from 'aws-amplify';
import awsConfig from '../../sensitive_info/aws-exports';

Amplify.configure({ Auth: awsConfig });

class LoginScreen extends Component {

    componentDidMount() {
        Auth.currentSession()
            .then(data => this.props.navigation.navigate('all_books_list'));
    }

    constructor(props) {
        super(props);
    
        this.state = {
            errorMessage: '',
            isAuthenticating: false
        }
    }

    onEmailChange(text) {
        text=text.trim();
        this.props.emailChanged(text);
    }

    onPasswordChange(text) {
        text=text.trim();
        this.props.passwordChanged(text);
    }

    onLoginPress() {
        const { email, password } = this.props;
        this.props.loginUser({ email, password });

        this.setState({ isAuthenticating: true, errorMessage: '' });

        Auth.signIn(this.props.email, this.props.password)
            .then(user => {
                    this.setState({ isAuthenticating: false });
                    this.props.navigation.navigate('all_books_list', user); 
                })
            .catch(err => { 
                this.setState({ isAuthenticating: false });
                this.setState({ errorMessage: err.message }); 
            });

    }

    onSignUpPress() {
        this.setState({ errorMessage: '' });
        this.props.navigation.navigate('sign_up_1');
    }

    onForgotPwdPress() {
        this.setState({ errorMessage: '' });
        this.props.navigation.navigate('forgot_password');
    }

    loginButtonDisabled = (email, password) => {
        if (
                (password.length<8)||
                (email.indexOf('.') === -1)||
                (email.split('').filter(x => x === '@').length !== 1)||
                (email.length < 5)
            ) {
            return true;
        } else {
            return false;
        }
    }

    validateEmail = (email) => {
        if (!this.props.emailTouched) {
            return (  
                <View>
                    <TextInput
                        keyboardType={'email-address'}
                        autoCapitalize = 'none'
                        underlineColorAndroid="transparent" 
                        placeholder="Email" 
                        placeholderColor="#c4c3cb" 
                        style={styles.loginFormTextInput} 
                        onChangeText={this.onEmailChange.bind(this)}
                        value={this.props.email}
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
                            onChangeText={this.onEmailChange.bind(this)}
                            value={this.props.email}
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
                            onChangeText={this.onEmailChange.bind(this)}
                            value={this.props.email}
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
                            onChangeText={this.onEmailChange.bind(this)}
                            value={this.props.email}
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
                            onChangeText={this.onEmailChange.bind(this)}
                            value={this.props.email}
                        />
                    </View>        
                );
            }
        }
    }

    validatePassword = (password) => {
        if (!this.props.passwordTouched) {
            return (  
                <View>
                    <TextInput
                            underlineColorAndroid="transparent" 
                            placeholder="Password" 
                            placeholderColor="#c4c3cb" 
                            style={styles.loginFormTextInput} 
                            secureTextEntry={true}
                            onChangeText={this.onPasswordChange.bind(this)}
                            value={this.props.password}
                        />
                </View>        
            );
        } else { 
            if (password.length < 8) {
                return (
                    <View>
                         <TextInput
                            underlineColorAndroid="transparent" 
                            placeholder="Password" 
                            placeholderColor="#c4c3cb" 
                            style={[styles.loginFormTextInput, {borderColor: '#DD2C00'}]} 
                            secureTextEntry={true}
                            onChangeText={this.onPasswordChange.bind(this)}
                            value={this.props.password}
                        />
                        <Text style={styles.errorMessage}>Password should be at least 8 characters long</Text>
                    </View>
                );
            } else {
                return (
                    <View>
                         <TextInput
                            underlineColorAndroid="transparent" 
                            placeholder="Password" 
                            placeholderColor="#c4c3cb" 
                            style={[styles.loginFormTextInput, {borderColor: '#1B5E20'}]} 
                            secureTextEntry={true}
                            onChangeText={this.onPasswordChange.bind(this)}
                            value={this.props.password}
                        />
                    </View>
                );
            }
        }
    }

    render() {
        return (
          <KeyboardAvoidingView style={styles.containerView} behavior="padding">
            <StatusBar barStyle = "dark-content" hidden = {true} translucent = {true}/>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.containerView}>
                    <View style={styles.loginFormView}>
                        <View style={styles.logoImageView}>
                            <Image 
                                style={styles.logoImage}
                                source={require('../../assets/bunksheet_logos/White_Background.png')}
                            />
                        </View>
                        <Text style={styles.logoText}>BunkSheet</Text>
                        {this.validateEmail(this.props.email)}
                        {this.validatePassword(this.props.password)}
                        <Spinner visible={this.state.isAuthenticating} />
                        <Text style={styles.errorMessage}>{this.state.errorMessage}</Text>
                        <Button
                            buttonStyle={styles.loginButton}
                            onPress={() => this.onLoginPress()}
                            title="Login"
                            disabled={this.loginButtonDisabled(this.props.email, this.props.password)}
                            ViewComponent={require('expo').LinearGradient}
                            linearGradientProps={{
                                colors: ['#FF6F00', '#FFA000'],
                                start: [1, 0],
                                end: [0.2, 0],
                            }}
                        />
                        <TouchableOpacity 
                            style={{flexDirection:'row', justifyContent: 'space-around', marginTop: 10 }} 
                            onPress={() => this.onForgotPwdPress()}
                            >
                            <Text style={{color: '#424242'}} >Forgotten Password?</Text>
                        </TouchableOpacity>
                        <View style={styles.rectangle} />
                        <Button
                            buttonStyle={styles.signUpButton}
                            onPress={() => this.onSignUpPress()}
                            title="Sign Up"
                            ViewComponent={require('expo').LinearGradient}
                            linearGradientProps={{
                                colors: ['#FFA000', '#FFC110'],
                                start: [1, 0],
                                end: [0.2, 0],
                            }}
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
        flex: 1,
    },
    logoImageView: { 
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoText: {
        fontSize: 40,
        fontWeight: "800",
        marginBottom: 30,
        textAlign: 'center',
    },
    logoImage: {
        marginTop: 10,
    },
    loginFormView: {
        justifyContent: 'center',
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
        marginBottom: 5,
      
    },
    errorMessage: {
        color: 'red',
        marginLeft: 15,
        marginRight: 15,
        marginBottom: 5,
    },
    loginButton: {
        backgroundColor: '#FF6D00',
        borderRadius: 5,
        height: 45,
        marginTop: 10,
        marginLeft: 15,
        marginRight: 15
    },
    signUpButton: {
        backgroundColor: '#FFAB00',
        borderRadius: 5,
        height: 45,
        marginLeft: 15,
        marginRight: 15,
    },
    rectangle: {
        width: 'auto',
        height: 1,
        backgroundColor: 'blue',
        marginTop: 30,
        marginLeft: 120,
        marginRight: 120,
        marginBottom: 30
    }
    
  };

  const mapStateToProps = (state) => {
      return {
          email: state.auth.email,
          password: state.auth.password,
          emailTouched: state.auth.emailTouched,
          passwordTouched: state.auth.passwordTouched,
      }
  }

  export default connect(mapStateToProps, { emailChanged, passwordChanged, loginUser })(LoginScreen);
