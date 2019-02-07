import React from 'react';
import { StyleSheet, View, Text, Dimensions, Image } from 'react-native';

export default class EAN_Home extends React.Component {
  state = {
    animation: null,
  };

  componentWillMount() {
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <Image style={styles.bg} source={require('../../Images/fff806b176e96203071782d3684d2079.png')} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bg: {
    position: 'absolute',
    resizeMode: 'center',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
});