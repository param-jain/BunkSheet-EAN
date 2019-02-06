import React from 'react';
import { Dimensions, StyleSheet, Text, View, Image, Alert, ActivityIndicator } from 'react-native';
import { BarCodeScanner, Permissions } from 'expo';
import { Button } from 'react-native-elements';
//import Spinner from 'react-native-loading-spinner-overlay';

import { Auth } from 'aws-amplify';

import openSocket from 'socket.io-client';
const  socket = openSocket('https://mighty-hollows-23016.herokuapp.com/user');

const { width } = Dimensions.get('window');

export default class App extends React.Component {

  state = {
    hasCameraPermission: false,
    currentLoggedUserRegID: 'E2K16100000',
  }

componentDidMount() {
  this.getCameraPermissions();
    
  Auth.currentAuthenticatedUser({
      bypassCache: true  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    }).then(user => {
      this.setState({
        currentLoggedUserRegID: `${user.attributes["custom:college_reg_id"]}`,
      });
    console.log("Barcode Scanner: "+user.attributes);
  });
}

  getCameraPermissions = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  permissionDenied() {
    this.setState({
      hasCameraPermission: false
    });
    this.getCameraPermissions();
    //this.props.navigation.navigate('library');
  }

  alertConfirmation = (accessionNo) => {

    const {currentLoggedUserRegID} = this.state

    Alert.alert(
      'Confirm Issue',
      `Do you really want to issue this book with Accession Number: ${accessionNo}?`,
      [
        {text: 'NO', onPress: () => this.alertConfirmationNO(), style: 'cancel'},
        {text: 'YES', onPress: () => this.alertConfirmationYES(accessionNo, currentLoggedUserRegID)},
      ],
      { cancelable: false }
    )
  }

  alertConfirmationYES = (ban, regID) => {

    socket.emit('requestIssueBook', { regID: `${regID}`, ban: `${ban}`});
          this.props.navigation.navigate('issuePendingToken');
          socket.on('responseIssueBook', socketStatus => {
            if (socketStatus.rcode === 501) {
              this.props.navigation.navigate('issueFailureToken');
            } else if (socketStatus.rcode === 600) {
              this.props.navigation.navigate('issueSuccessToken');
            } 
            socket.close(); 
          });
  }

alertConfirmationNO = () => {
  this.props.navigation.navigate('issuance');
}

  render() {

    const { hasCameraPermission } = this.state;

    if (hasCameraPermission === null) {
      return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={styles.permissionText}>Checking for the Permissions</Text>
            <ActivityIndicator size='large' color='#FFAB40' style={{marginTop: 30}}/>
          </View>
      );  
    }
    if (hasCameraPermission === false) {
      return(
       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View style={styles.logoImageView}>
            <Image 
                style={styles.logoImage}
                source={require('../../images/angry-orange-brown-md.png')}
            />
        </View>
        <Text style={styles.permissionText}>Camera Permission Denied</Text>
        <Button 
          onPress = {() => this.permissionDenied()}
          title = 'Allow it Now!'
          buttonStyle={styles.Ok}
          />
       </View>
      );
    }
    return (
      <View style={{ flex: 1 }}>
        <BarCodeScanner
          onBarCodeRead={(accession) => this.alertConfirmation(accession.data)}
          //onBarCodeRead={(accession) => console.log(accession)}
          style={[StyleSheet.absoluteFill, styles.container]}
        >
          <View style={styles.layerTop}>
            <Text style={styles.description}>Scan the Book!</Text>
          </View>
          <View style={styles.layerCenter}>
            <View style={styles.layerLeft} />
            <View style={styles.focused} />
            <View style={styles.layerRight} />
          </View>
          <View style={styles.layerBottom}>
            <Text
            onPress={() => this.props.navigation.navigate('library')}
            style={styles.cancel}
            >
            Cancel
            </Text>
          </View>
        </BarCodeScanner>
      </View>
    );
  }
}

const opacity = 'rgba(0, 0, 0, .6)';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  layerTop: {
    flex: 2,
    backgroundColor: opacity,
  },
  layerCenter: {
    flex: 1,
    flexDirection: 'row',
    borderColor: '#ffffff',
    borderWidth: 2,
  },
  layerLeft: {
    flex: 1,
    backgroundColor: opacity,
  },
  focused: {
    flex: 10
  },
  layerRight: {
    flex: 1,
    backgroundColor: opacity,
  },
  layerBottom: {
    flex: 2,
    backgroundColor: opacity,
  },
  Ok: {
    backgroundColor: '#FFAB00',
    borderRadius: 5,
    height: 45,
    marginTop: 10,
  },
   permissionText: {
      fontSize: 16,
      marginLeft: 15,
      marginRight: 15,
      marginTop: 5,
      marginBottom: 5,
      color:'#FF6D00'

   },
   description: {
    fontSize: width * 0.09,
    fontWeight: "600",
    marginBottom: 10,
    marginTop: '30%',
    textAlign: 'center',
    color: 'white',
  },
  cancel: {
    fontSize: width * 0.05,
    textAlign: 'center',
    color: 'white',
    marginTop: '20%'
  },
  logoImage: {
    marginTop: 7,
  },
  logoImageView: { 
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
},
});