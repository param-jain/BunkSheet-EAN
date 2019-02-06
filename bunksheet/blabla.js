import React from 'react';
import { Button, StyleSheet, View, Dimensions } from 'react-native';
import { DangerZone } from 'expo';
const { Lottie } = DangerZone;

const bookLoading = require('./Animations/downloading_book.json'); 

export default class TEST extends React.Component {
  state = {
    animation: null,
  };

  componentWillMount() {
    this._playAnimation();
  }

  render() {
    return (
      <View style={styles.animationContainer}>
        {this.state.animation &&
          <Lottie
            ref={animation => {
              this.animation = animation;
            }}
            style={{
              width: 400,
              height: Dimensions.get('window').height,
              backgroundColor: '#FA9800',
            }}
            source={this.state.animation}
          />}
        <View style={styles.buttonContainer}>
          <Button title="Restart Animation" onPress={this._playAnimation} />
        </View>
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  buttonContainer: {
    paddingTop: 20,
  },
});
