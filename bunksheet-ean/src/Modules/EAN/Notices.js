import React from 'react';
import { StyleSheet, View, Text, Dimensions, ActivityIndicator, TouchableOpacity, Image, KeyboardAvoidingView, StatusBar, TouchableWithoutFeedback, Keyboard, ScrollView, FlatList } from 'react-native';
import { Header, Button, Icon, Card } from 'react-native-elements';
import { connect } from 'react-redux';
import ActionButton from 'react-native-action-button';
import axios from 'axios';

const ROOT_URL = 'https://serene-reef-66358.herokuapp.com/';

class Notices extends React.Component {
  
  static navigationOptions = (props) => {
    const { navigate } = props.navigation;
    return {
        title: 'BunkSheet - Notices',
        headerTitleStyle: { color: '#fff' },
        headerStyle: { backgroundColor: '#FD6D00' },
        headerRight: (
            <View style={{marginLeft: 10, marginRight: 10}}>
              <TouchableOpacity onPress={() => navigate('profile')} >
                <Icon name='user' type='font-awesome' color = '#fff'/>
              </TouchableOpacity>
            </View>
        ),
        style: {
            marginTop: Platform.OS === 'android' ? 24 : 0
        }
    };
  }

  constructor (props) {
    super(props);

    this.state = {
        loading: false,
        error: '',
      }

    this.arrayHolder = [];
  }

  componentDidMount() {
    //this.makeRemoteRequest();
  }

  onDataLoaded = (data) => {
    this.props.eanLoadAllData(data);
  }

  makeRemoteRequest = () => {
    //const url = ROOT_URL+`bh/getnotices`;
    /*this.setState({ loading: true });

    
    const postData = {
      branch: "COMPUTER",
    }

    axios.get( `https://serene-reef-66358.herokuapp.com/bh/getnotices`, { postData })
      //.then(res => res.json())
      .then(res => {
        this.onDataLoaded(res);
        console.log(res.data);
        this.setState({
          error: res.error || null,
          loading: false,
        });
        this.arrayHolder = res;
      })
      .catch(error => {
        this.setState({ error, loading: false });
        console.log(error);
      });

   /* fetch(url)
      .then(res => res.json())
      .then(res => {
        this.onDataLoaded(res);
        console.log(res);
        this.setState({
          error: res.error || null,
          loading: false,
        });
        this.arrayHolder = res;
      })
      .catch(error => {
        this.setState({ error, loading: false });
      });*/
  };

  renderCollapsibleList = () => {
    return(
      <View>
        <FlatList
          data={this.props.data}
          renderItem={this.renderItem}
          keyExtractor={library => library.id.toString()}
      />
      </View>
    );
  }

  renderActionButton = () => {
    return (
      <View style={{flex:1}}>
        {/* Rest of the app comes ABOVE the action button component !*/}
        <ActionButton buttonColor="#F9A825" buttonText="Refine" buttonTextStyle={{fontSize: 12}} size={64}>
          <Icon name="format-italic" type="material" style={styles.actionButtonIcon} />
          <ActionButton.Item buttonColor='#FAD291' title="Year - Wise" onPress={() => console.log("notes tapped!")}>
            <Icon name="format-italic" type="material" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#FFADF2' title="Branch - Wise" onPress={() => {}}>
            <Icon name="call-split" type="material" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#A4C8F0' title="Division - Wise" onPress={() => {}}>
            <Icon name="columns" type="font-awesome" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#FEA8A1' title="Batch - Wise" onPress={() => {}}>
            <Icon name="sitemap" type="font-awesome" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>
      </View>
    );
  }

  render() {
    
    if (this.state.loading) {
      return (
        <View style={{flex:1, justifyContent: 'center' }}>
          <ActivityIndicator animating={this.state.loading} size="large" />
        </View>
      );
    }

    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <StatusBar barStyle = "dark-content" hidden = {false} translucent = {true}/>
        <Image style={styles.bg} source={require('../../Images/fff806b176e96203071782d3684d2079.png')} />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>         
          <View style={styles.container}>
            {this.renderCollapsibleList()}

            {this.renderActionButton()}
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
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});

const mapStateToProps = (state) => {
  return {

  }
}

export default connect(mapStateToProps, { })(Notices);