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
  signupEmailChanged, 
  signupPasswordChanged,
  signupFNameChanged,
  signupLNameChanged,
  signupRegIDChanged, 
  signupCreateAccount
} from '../../Actions/index'

import  Amplify, { Auth } from 'aws-amplify';
import awsConfig from '../../Sensitive_Info/aws-exports';

Amplify.configure({ Auth: awsConfig });

const ROOT_URL = 'http://bunksheet.ml/';

class SignUpScreen_2 extends Component {

  constructor(props) {
    super(props);

    this.state = {
        errorMessage: '',
        isAuthenticating: false,
        dbStudentName: '',
        greenFlag: false 
    }
}

    backButtonNavigation() {
        this.setState({ errorMessage: '' });
        this.props.navigation.navigate('sign_up_1');
    }

    proceedToSignUp() {
        const { email, password, fName, lName, regID } = this.props;
        //this.props.signupCreateAccount(email, password, fName, lName, regID);
        this.setState({ isAuthenticating: true, errorMessage: '', greenFlag: false }); 

        const url = ROOT_URL+`nd/verifyUser`;

        const postData = {
          regId: regID
        }

        const config = {
          Headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }

        fetch(url, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              //regId: 'E2K16100000'
              regId: regID.toUpperCase()
          }),
          }).then((response) => {
            if (response.status === 404) {
              console.log(response.status);
              this.setState({errorMessage: 'Invalid Registration ID. Please go back and reinitiate the Signup Process', isAuthenticating: false, greenFlag: false});
            } else {
              this.setState({greenFlag: true});
            }
          })

          fetch(url, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                regId: regID.toUpperCase()
            }),
            })
            .then((response) => response.json())
            .then((responseJson) => {

              if (this.state.greenFlag) {
                  this.setState({ dbStudentName: JSON.stringify(responseJson[0].Name)});
                  console.log(this.state.dbStudentName);
                  if (this.state.dbStudentName.toUpperCase().includes(fName.toUpperCase())&&this.state.dbStudentName.toUpperCase().includes(lName.toUpperCase())) {
                    Auth.signUp({
                      username: email,
                      password: password,
                      attributes: {
                      email: email,
                      name: fName.toUpperCase(),
                      family_name: lName.toUpperCase(),
                      'custom:college_reg_id': regID.toUpperCase()
                    }
                  })
                    .then(data => {
                      console.log("otp required data: " + JSON.stringify(data)); 
                      this.setState({ isAuthenticating: false });
                      this.props.navigation.navigate('otp_confirmation', data);
                    })
                    .catch(err => { 
                      this.setState({ isAuthenticating: false });
                      this.setState({ errorMessage: err.message }) 
                    });
                  } else {
                    this.setState({ errorMessage: 'Entered Details does not match with your Registration ID', isAuthenticating: false})
                  }
                  //this.setState({ isAuthenticating: false });
              }
            })
            .catch(err => {
                console.log("Error SUS2 => " + err);
                console.log("Error SUS2 => " + err.status);
                this.setState({ isAuthenticating: false });
            });
    }

    onFNameChange(text) {
      text=text.trim();
      this.props.signupFNameChanged(text);
    }

    onLNameChange(text) {
      text=text.trim();
      this.props.signupLNameChanged(text);
    }

    onRegIDChange(text) {
      text=text.trim();
      this.props.signupRegIDChanged(text);
    }

    validateFName = (fName) => {
      if (!this.props.fNameTouched) {
        return(
          <View style={{flex: 1}}>
            <TextInput
                underlineColorAndroid="transparent" 
                placeholder="First Name" 
                placeholderColor="#c4c3cb" 
                autoCapitalize='words'
                style={[styles.loginFormTextInput, {marginRight: 7.5}]} 
                onChangeText={this.onFNameChange.bind(this)}
                value={this.props.fName}
            />
          </View>
        );
      } else {
        if (fName.length<1) {
          return(
            <View style={{flex: 1}}>
              <TextInput
                  underlineColorAndroid="transparent" 
                  placeholder="First Name" 
                  placeholderColor="#c4c3cb" 
                  autoCapitalize='words'
                  style={[styles.loginFormTextInput, {marginRight: 7.5, borderColor: '#DD2C00'}]} 
                  onChangeText={this.onFNameChange.bind(this)}
                  value={this.props.fName}
              />
              <Text style={styles.errorMessage}>First Name should not be Empty!!!</Text>         
            </View>
          );
        } else {
          return(
            <View style={{flex: 1}}>
              <TextInput
                  underlineColorAndroid="transparent" 
                  placeholder="First Name" 
                  placeholderColor="#c4c3cb" 
                  autoCapitalize='words'
                  style={[styles.loginFormTextInput, {marginRight: 7.5, borderColor: '#1B5E20'}]} 
                  onChangeText={this.onFNameChange.bind(this)}
                  value={this.props.fName}
              />
            </View>
          );
        }
      }
    }

    validateLName = (lName) => {
      if (!this.props.lNameTouched) {
        return(
          <View style={{flex: 1}}>
            <TextInput
                underlineColorAndroid="transparent" 
                placeholder="Last Name" 
                placeholderColor="#c4c3cb" 
                autoCapitalize='words'
                style={[styles.loginFormTextInput, {marginLeft: 7.5}]} 
                onChangeText={this.onLNameChange.bind(this)}
                value={this.props.lName}
            />
          </View>
        );
      } else {
        if (lName.length<1) {
          return(
            <View style={{flex: 1}}>
              <TextInput
                  underlineColorAndroid="transparent" 
                  placeholder="Last Name" 
                  placeholderColor="#c4c3cb" 
                  autoCapitalize='words'
                  style={[styles.loginFormTextInput, {marginRight: 7.5, borderColor: '#DD2C00'}]} 
                  onChangeText={this.onLNameChange.bind(this)}
                  value={this.props.lName}
                />
                <Text style={styles.errorMessage}>Last Name should not be Empty!!!</Text>         
            </View>
          );
        } else {
          return(
            <View style={{flex: 1}}>
              <TextInput
                underlineColorAndroid="transparent" 
                placeholder="Last Name" 
                placeholderColor="#c4c3cb"
                autoCapitalize='words'
                style={[styles.loginFormTextInput, {marginRight: 7.5, borderColor: '#1B5E20'}]} 
                onChangeText={this.onLNameChange.bind(this)}
                value={this.props.lName}
              />
            </View>
          );
        }
      }
    }

    validateRegID = (regID) => {
      if (!this.props.regIDTouched) {
        return(
          <View>
            <TextInput
              underlineColorAndroid="transparent" 
              placeholder="College Registration ID" 
              placeholderColor="#c4c3cb" 
              autoCapitalize='characters'
              style={styles.loginFormTextInput} 
              onChangeText={this.onRegIDChange.bind(this)}
              value={this.props.regID}
            />
          </View>
        );
      } else {
        if (regID.length<10) {
          return(
            <View>
              <TextInput
                underlineColorAndroid="transparent" 
                placeholder="College Registration ID" 
                placeholderColor="#c4c3cb" 
                autoCapitalize='characters'
                style={[styles.loginFormTextInput, { borderColor: '#DD2C00' }]} 
                onChangeText={this.onRegIDChange.bind(this)}
                value={this.props.regID}
              />
              <Text style={styles.errorMessage}>Registration ID should be atleast 10 Characters Long!!!</Text>             
            </View>
          );
        } else {
          return(
            <View>
              <TextInput
                underlineColorAndroid="transparent" 
                placeholder="College Registration ID" 
                placeholderColor="#c4c3cb" 
                autoCapitalize='characters'
                style={[styles.loginFormTextInput, { borderColor: '#1B5E20' }]} 
                onChangeText={this.onRegIDChange.bind(this)}
                value={this.props.regID}
              />
            </View>
          );
        }
      }
    }

    enableCheckButton = (email, password, fName, lName, regID) => {
      if (
        (regID.length<10)||
        (lName.length<1)||
        (fName.length<1)
      ) {
        return (
          <TouchableOpacity 
            style={styles.checkButton} 
            onPress={this.proceedToSignUp.bind(this)}
            disabled
          >
              <Icon
                  raised
                  name='arrow-right'
                  type='entypo'
                  color = '#777777'
                  style ={styles.checkButtonLayout} />
        </TouchableOpacity>
        );
      } else {
        return (
          <TouchableOpacity 
            style={styles.checkButton} 
            onPress={this.proceedToSignUp.bind(this)}
          >
              <Icon
                  raised
                  name='arrow-right'
                  type='entypo'
                  color = '#E65100'
                  style ={styles.checkButtonLayout} />
        </TouchableOpacity>
        );
      }
    }

    render() {

      const { email, password, fName, lName, regID } = this.props;

        return (
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                <StatusBar barStyle = "dark-content" hidden = {true} translucent = {true}/>
                <Image style={styles.bg} source={require('../../Images/orange-owl-hi-flipped.png')} />
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.container}>

                        <View style={styles.headerIconView}>
                            <TouchableOpacity style={styles.headerBackButtonView} onPress={this.backButtonNavigation.bind(this)}>
                                <Image style={styles.backButtonIcon} source={require('../../Images/black_back.png')} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.headerTitleView}>
                            <Text style={styles.titleViewText}>Just Little More About Yourself ...</Text>
                        </View>


                        <Spinner visible={this.state.isAuthenticating} />

                        <View style={styles.loginFormView}>
                          <View style={{ flexDirection: 'row' }}>
                            {this.validateFName(fName)}
                            {this.validateLName(lName)}
                          </View>
                          {this.validateRegID(regID)}
                          <Text style={styles.errorMessage}>{this.state.errorMessage}</Text>
                          {this.enableCheckButton(email, password, fName, lName, regID)}
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
        marginBottom: 5,
      
    },
    errorMessage: {
        color: 'red',
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
    email: state.sign_up.email,
    emailTouched: state.sign_up.emailTouched,
    password: state.sign_up.password,
    passwordTouched: state.sign_up.passwordTouched,
    isAuthenticating: state.sign_up.isAuthenticating,
    fName: state.sign_up.fName,
    fNameTouched: state.sign_up.fNameTouched,
    lName: state.sign_up.lName,
    lNameTouched: state.sign_up.lNameTouched,
    regID: state.sign_up.regID,
    regIDTouched: state.sign_up.regIDTouched,
    pakkaEmail: state.sign_up.pakkaEmail,
    pakkaPassword: state.sign_up.pakkaPassword
});

export default connect(mapStateToProps, { 
    signupEmailChanged, 
    signupPasswordChanged,
    signupFNameChanged,
    signupLNameChanged,
    signupRegIDChanged,
    signupCreateAccount
})(SignUpScreen_2);