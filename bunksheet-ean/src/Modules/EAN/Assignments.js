import React from 'react';
import { StyleSheet, ActivityIndicator, View, Text, Linking, RefreshControl, Dimensions, ScrollView, TouchableOpacity, Image, KeyboardAvoidingView, StatusBar, TouchableWithoutFeedback, Keyboard, FlatList } from 'react-native';
import { Header, Button, Icon, Card } from 'react-native-elements';
import { connect } from 'react-redux';
import axios from 'axios';

const ROOT_URL = 'https://damp-fjord-36039.herokuapp.com/';

class Assignments extends React.Component {
  
    static navigationOptions = (props) => {
        const { navigate } = props.navigation;
        return {
            title: 'E A N',
            tabBarIcon: ({ tintColor }) => {
              return <Icon name="assignment" type="material" size={25} color={tintColor} />; 
            }
        };
    }

    constructor (props) {
      super(props);
      this.state = {
          loading: false,
          error: '',
          data: [],
          originalData:[],
          refreshing: false
        }
  
      this.arrayHolder = [];
    }
  
    async componentDidMount() {
     await this.makeRemoteRequest();
    }
  
    makeRemoteRequest = () => {
      const url = ROOT_URL+`bh/getassignments`;
      this.setState({ loading: true });
  
      
      const postData = {
        batch: this.props.batchAlphabet+this.props.division,
        category: 'assignment'
      }
  
      const config = {
        Headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
  
      axios.post( url, postData, config)
        .then(res => {
          this.setState({
            error: res.error || null,
            loading: false,
            data: res.data,
            originalData:res.data,
            refreshing: false,
          });
          this.arrayHolder = res;
        })
        .catch(error => {
          this.setState({ error, loading: false });
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
                size={22}/>
          </TouchableOpacity>
      );
  }
  
  filterOptions = () => {
    return(
      <View horizontal style={{flexDirection: 'row', marginVertical: 10, justifyContent: 'center', alignContent: 'center'}}>
        <ScrollView horizontal={true} style={{padding: 5}} showsHorizontalScrollIndicator={false}>
          <View style={{justifyContent: 'center', alignContent:'center', flex: 1}}>
            <Icon name="filter" type="font-awesome" color="#FF9800"/>
          </View>
          <TouchableOpacity style={{justifyContent: 'center', alignContent:'center', flex: 1}} onPress={() => this.yearWiseSort()}>
            <Text style={{ borderWidth: 2, marginLeft: 10, margin: 2.5, padding: 5, backgroundColor:'#BCAAA4', borderColor:'#FA9800', color:'#eee'}}>Year Wise</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{justifyContent: 'center', alignContent:'center', flex: 1}} onPress={() => this.branchWiseSort()}>
            <Text style={{ borderWidth: 2, marginLeft: 10, margin: 2.5, padding: 5, backgroundColor:'#FFADF2', borderColor:'#FA9800', color:'#eee'}}>Branch Wise</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{justifyContent: 'center', alignContent:'center', flex: 1}} onPress={() => this.makeRemoteRequest()}>
            <Text style={{ borderWidth: 2, marginLeft: 10, margin: 2.5, padding: 5, backgroundColor:'#A4C8F0', borderColor:'#FA9800', color:'#eee'}}>General</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{justifyContent: 'center', alignContent:'center', flex: 1}} onPress={() => this.divisionWiseSort()}>
            <Text style={{ borderWidth: 2, marginLeft: 10, margin: 2.5, padding: 5, backgroundColor:'#FEA8A1', borderColor:'#FA9800', color:'#eee'}}>Division Wise</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{justifyContent: 'center', alignContent:'center', flex: 1}} onPress={() => this.batchWiseSort()}>
            <Text style={{ borderWidth: 2, marginRight: 10, margin: 2.5, padding: 5, backgroundColor:'#B39DDB', borderColor:'#FA9800', color:'#eee'}}>Batch Wise</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
  
  yearWiseSort = () => {
    this.setState({loading: true});
    const newData = [];
    for(let i=0; i<this.state.originalData.length; i++) {
      if (this.state.originalData[i].scope === 'year')
        newData.push(this.state.originalData[i]);
    }
    this.setState({
      data: newData,
      loading: false
    });
  }

  branchWiseSort = () => {
    this.setState({loading: true});
    const newData = [];
    for(let i=0; i<this.state.originalData.length; i++) {
      if (this.state.originalData[i].scope === 'branch')
        newData.push(this.state.originalData[i]);
    }
    this.setState({
      data: newData,
      loading: false
    });
  }

  divisionWiseSort = () => {
    this.setState({loading: true});
    const newData = [];
    for(let i=0; i<this.state.originalData.length; i++) {
      if (this.state.originalData[i].scope === 'division')
        newData.push(this.state.originalData[i]);
    }
    this.setState({
      data: newData,
      loading: false
    });
  }

  batchWiseSort = () => {
    this.setState({loading: true});
    const newData = [];
    for(let i=0; i<this.state.originalData.length; i++) {
      if (this.state.originalData[i].scope === 'batch')
        newData.push(this.state.originalData[i]);
    }
    this.setState({
      data: newData,
      loading: false
    });
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

    if (this.state.loading) {
      return (
        <View style={styles.container}>
          { this.renderHeader() }
          <View style={{flex:1, justifyContent: 'center' }}>
            <ActivityIndicator animating={this.state.loading} size="large" />
          </View>
        </View>
      );
    }

    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <StatusBar barStyle = "dark-content" hidden = {false} translucent = {true}/>
        <Image style={styles.bg} source={require('../../Images/fff806b176e96203071782d3684d2079.png')} />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                { this.renderHeader() }
                { this.filterOptions() }
                { this.renderCollapsibleList() }
                { this.floatingButton() }
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
    width: 60, 
    height: 60, 
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

export default connect(mapStateToProps, {})(Assignments);