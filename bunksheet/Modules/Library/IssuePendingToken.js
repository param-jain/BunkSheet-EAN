import React from 'react';
import { Text, StyleSheet, View, Dimensions, TouchableOpacity, Image } from 'react-native';
import { DangerZone } from 'expo';
const { Lottie } = DangerZone;

const bookLoading = require('../../Animations/hourglass.json'); 

export default class IssuePendingToken extends React.Component {
  state = {
    animation: null,
  };

  componentWillMount() {
    this._playAnimation();
  }

  render() {
    return (
        <View>
            <View style={styles.animationContainer}>
            {this.state.animation &&
                <Lottie
                    ref={animation => {
                    this.animation = animation;
                    }}
                    style={{
                    width: 400,
                    height: 400,
                    backgroundColor: '#eee',
                    }}
                    source={this.state.animation}
                />}
            </View>
            <View style={styles.containerView}>
                    <View style={styles.successTextView}>
                        <Text style={styles.successText}>ISSUE APPROVAL PENDING!</Text>
                    </View>
                    <View style={styles.bodyView}>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={styles.bodyBlue}>Due Date                   :  </Text>
                            <Text style={styles.body}>January 8th, 2019</Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={styles.bodyBlue}>Return Date              :  </Text>
                            <Text style={styles.body}>January 10th, 2019</Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={styles.bodyBlue}>Book Title                 :   </Text>
                            <Text style={styles.body}>The Lean Startup</Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={styles.bodyBlue}>Author/s                    :   </Text>
                            <Text style={styles.body}>Eric Ries</Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={styles.bodyBlue}>Accession Number  :   </Text>
                            <Text style={styles.body}>9780670921607</Text>
                        </View>
                    </View>
                    <View style={[styles.bodyView, {borderBottomWidth: 0}]}>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={styles.bodyOrange}>Student's Name       :   </Text>
                            <Text style={styles.body}>Param Jhade</Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={styles.bodyOrange}>Registeration ID       :   </Text>
                            <Text style={styles.body}>E2K16102832</Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={styles.bodyOrange}>Contact Number      :  </Text>
                            <Text style={styles.body}>+91 8668462386</Text>
                        </View>
                    </View>
            </View>
            <TouchableOpacity onPress = {() => this.props.navigation.navigate('issuance')}>
                <Text style={{fontSize: 12, alignSelf: 'center', color:'#757575'}}>Back</Text>
            </TouchableOpacity>
            <Text style={{fontSize: 12, alignSelf: 'center', color:'#9e9e9e'}}>BunkSheet</Text>
        </View>
    );
  }

  _playAnimation = () => {
    if (!this.state.animation) {
      this.setState({
        animation: bookLoading
      }, this._playAnimation);
    } else {
      this.animation.reset();
      this.animation.play();
    }
  };
}

const styles = StyleSheet.create({
  animationContainer: {
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    paddingTop: 20,
  },
  containerView: {
    justifyContent: 'center',
    alignContent: 'center',
    margin: 10,
  },
  successText: {
      alignSelf: 'center',
      fontSize: 22,
      fontWeight: 'bold',
      color: '#6A1B98',
      marginBottom: 20,
  },
  successTextView: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  bodyView: {
      margin: 10,
      marginBottom: 0,
      justifyContent: 'center',
      alignContent: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
      padding: 10
  },
  bodyBlue: {
     fontSize: 16,
     alignSelf: 'center',
     color: '#2196F3'
  },
  bodyOrange: {
    fontSize: 16,
    alignSelf: 'center',
    color: '#03A9F4'
 },
  body: {
    fontSize: 16,
    alignSelf: 'center',
    color: '#424242'
 },
 image:{
    width:120,
    height:120,
    borderRadius:40,
    marginTop: 10
  },
});
