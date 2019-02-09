import React from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, Image, KeyboardAvoidingView, StatusBar, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Header, Button, Icon } from 'react-native-elements';

export default class Assignments extends React.Component {
  
    static navigationOptions = (props) => {
        const { navigate } = props.navigation;
        return {
            title: 'E A N',
            tabBarIcon: ({ tintColor }) => {
              return <Icon name="assignment" type="material" size={25} color={tintColor} />; 
            }
        };
    }

    renderHeader = () => {
        return(
          <Header
            backgroundColor="#FF6D00"
            statusBarProps={{backgroundColor: "#FF6D00"}}
            outerContainerStyles={{borderBottomWidth: 0.5, borderColor: '#000000'}}
            centerComponent={{ text: 'Assignments' , style: { color: '#fff',fontSize: 18, fontWeight: 'bold' }  }}
          />
        );
      }
    
  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <StatusBar barStyle = "dark-content" hidden = {false} translucent = {true}/>
        <Image style={styles.bg} source={require('../../Images/fff806b176e96203071782d3684d2079.png')} />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                { this.renderHeader() }
            </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: 'transparent',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  bg: {
    position: 'absolute',
    resizeMode: 'center',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
});