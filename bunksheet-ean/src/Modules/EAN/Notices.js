import React from 'react';
import { StyleSheet, View, Text, Dimensions, Platform, RefreshControl, Linking, ActivityIndicator, TouchableOpacity, Image, KeyboardAvoidingView, StatusBar, TouchableWithoutFeedback, Keyboard, ScrollView, FlatList } from 'react-native';
import { Header, Button, Icon, Card, ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import axios from 'axios';
import { FloatingAction } from 'react-native-floating-action';
import { Constants } from 'expo';
import {eanUserBatchSelect, eanUserDivisionSelect} from '../../Actions/index'

const ROOT_URL = 'https://serene-reef-66358.herokuapp.com/';

const actions = [{
  text: 'Year - Wise',
  icon: <Icon name="format-italic" type="material" color="#fff"/>,
  name: 'bt_year_wise',
  position: 1,
  color:'#FAD291',
  textBackground: '#FAD291',
  textColor: '#fff',
}, {
  text: 'Branch - Wise',
  icon: <Icon name="call-split" type="material" color="#fff"/>,
  name: 'bt_branch_wise',
  position: 2,
  color:'#FFADF2',
  textBackground: '#FFADF2',
  textColor: '#fff',
}, {
  text: 'Division - Wise',
  icon: <Icon name="columns" type="font-awesome" color="#fff"/>,
  name: 'bt_division_wise',
  position: 3,
  color:'#A4C8F0',
  textBackground: '#A4C8F0',
  textColor: '#fff',
}, {
  text: 'Batch - Wise',
  icon: <Icon name="sitemap" type="font-awesome" color="#fff"/>,
  name: 'bt_batch_wise',
  position: 4,
  color:'#FEA8A1',
  textBackground: '#FEA8A1',
  textColor: '#fff',
}];

class Notices extends React.Component {
  
  static navigationOptions = (props) => {
    const { navigate } = props.navigation;
    return {
        title: 'BunkSheet - Notices',
        headerTitleStyle: { color: '#fff' },
        headerStyle: { backgroundColor: '#FD6D00' },
        headerRight: (
            <View style={{marginLeft: 10, marginRight: 10, flexDirection:'row-reverse'}}>
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
        data: [],
        refreshing: false
      }

    this.arrayHolder = [];
  }

  async componentWillMount() {
   await this.makeRemoteRequest();
  }

  makeRemoteRequest = () => {
    const url = ROOT_URL+`bh/getnotices`;
    this.setState({ loading: true });

    
    const postData = {
      batch: this.props.batchAlphabet+this.props.division,
      category: 'notice'
    }

    const config = {
      Headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }

    axios.post( url, postData, config)
      .then(res => {
        //console.log(res.data);
        this.setState({
          error: res.error || null,
          loading: false,
          data: res.data,
          refreshing: false
        });
        this.arrayHolder = res;
      })
      .catch(error => {
        this.setState({ error, loading: false });
        console.log(error);
      });
  };

  static async _handleRefresh() {
    this.setState({refreshing: true});
    await this.makeRemoteRequest();
    this.setState({refreshing: false});
  };


  renderCollapsibleList = () => {
    return(
      <View>
      <ScrollView refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._handleRefresh}
          />
        }>
        <FlatList
          keyboardShouldPersistTaps='always'
            data={this.state.data}
            renderItem={({ item }) => (
              /*<ListItem
              roundAvatar
              title={item.title}
              titleStyle = {{fontWeight: "bold"}}
              subtitle={item.nbody}
              containerStyle={{ borderBottomWidth: 0 }}
              chevronColor='#CED0CE'
              chevron
              //onPress={() => this.bookDetailModal(item)}
              />*/
              <Card title={item.title} containerStyle={{borderRadius: 15}} dividerStyle={{borderColor: '#FF5722'}}>
                <View style={{flexDirection:'row', justifyContent:'center', alignContent: 'center'}}>
                  <Text style={{flex:1, borderWidth: 2, borderColor: '#FF9E80', borderRadius: 10, marginHorizontal: 2, padding: 15}}>{item.nbody}</Text>
                </View>
                <View style={{flexDirection: 'row', justifyContent:'center', alignContent: 'center', marginTop: 7}}>
                  <Text style={{flex: 4, borderWidth: 2, borderColor: '#eee', borderRadius: 10, marginHorizontal: 2, padding: 15, color: '#FF5722'}}>{item.timestamp}</Text>
                  <TouchableOpacity style={{flex:1, borderWidth: 2, borderColor: '#eee', borderRadius: 10, marginHorizontal: 2, padding: 15, justifyContent: 'center', alignContent: 'center'}} onPress={()=>{ Linking.openURL(ROOT_URL+item.filelink)}} >
                    <Icon name='file-download' size={24} type='material' color = '#FF9E80'/>
                  </TouchableOpacity>
                  <Text style={{flex: 4, borderWidth: 2, borderColor: '#eee', borderRadius: 10, marginHorizontal: 2, padding: 15, color: '#FF5722'}}>{item.tname}</Text>
                </View>
              </Card>
            )}
      keyExtractor={item => item._id.toString()}
      ItemSeparatorComponent={this.renderSeparator}
      />
      </ScrollView>
      </View>
    );
  }

  floatingButton = () => {
    return (
        <TouchableOpacity onPress={() => this.makeRemoteRequest()} style={styles.fab}>
            <Icon 
              raised
              name='refresh'
              type='material'
              color = '#E65100'
              style ={styles.checkButtonLayout}/>
        </TouchableOpacity>
    );
}

filterOptions = () => {
  return(
    <View horizontal style={{flexDirection: 'row', marginVertical: 10, justifyContent: 'center', alignContent: 'center'}}>
      <ScrollView horizontal={true} style={{padding: 5}} showsHorizontalScrollIndicator={false}>
        <TouchableOpacity style={{justifyContent: 'center', alignContent:'center', flex: 1}}>
          <Text style={{ borderWidth: 2, marginLeft: 10, margin: 2.5, padding: 5, backgroundColor:'#BCAAA4', borderColor:'#FA9800', color:'#eee'}}>Year Wise</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{justifyContent: 'center', alignContent:'center', flex: 1}}>
          <Text style={{ borderWidth: 2, marginLeft: 10, margin: 2.5, padding: 5, backgroundColor:'#FFADF2', borderColor:'#FA9800', color:'#eee'}}>Branch Wise</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{justifyContent: 'center', alignContent:'center', flex: 1}}>
          <Text style={{ borderWidth: 2, marginLeft: 10, margin: 2.5, padding: 5, backgroundColor:'#A4C8F0', borderColor:'#FA9800', color:'#eee'}}>General</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{justifyContent: 'center', alignContent:'center', flex: 1}}>
          <Text style={{ borderWidth: 2, marginLeft: 10, margin: 2.5, padding: 5, backgroundColor:'#FEA8A1', borderColor:'#FA9800', color:'#eee'}}>Division Wise</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{justifyContent: 'center', alignContent:'center', flex: 1}}>
          <Text style={{ borderWidth: 2, marginRight: 10, margin: 2.5, padding: 5, backgroundColor:'#B39DDB', borderColor:'#FA9800', color:'#eee'}}>Batch Wise</Text>
        </TouchableOpacity>
      </ScrollView>
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
              {this.filterOptions()}
              {this.renderCollapsibleList()}
              {console.log(this.state.data)}
              {/*{this.renderActionButton()}*/}
              {this.floatingButton()}
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
  fab: { 
    position: 'absolute', 
    width: 70, 
    height: 70, 
    alignItems: 'center', 
    justifyContent: 'center', 
    right: 20, 
    bottom: 20, 
    backgroundColor: '#F9A825', 
    borderRadius: 40, 
    elevation: 8 
},
});

const mapStateToProps = (state) => {
  return {
    batchAlphabet: state.ean.batch,
    division: state.ean.division
  }
}

export default connect(mapStateToProps, {})(Notices);