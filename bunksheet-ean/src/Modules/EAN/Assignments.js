import React from 'react';
import { StyleSheet, ActivityIndicator, View, Text, Linking, RefreshControl, Dimensions, ScrollView, TouchableOpacity, Image, KeyboardAvoidingView, StatusBar, TouchableWithoutFeedback, Keyboard, FlatList } from 'react-native';
import { Header, Button, Icon, Card } from 'react-native-elements';
import { connect } from 'react-redux';
import axios from 'axios';
import NoticeDetail from '../../Components/NoticeDetail';

import Amplify, { Auth } from 'aws-amplify';
import awsConfig from '../../Sensitive_Info/aws-exports';
Amplify.configure({ Auth: awsConfig });

const ROOT_URL = 'https://damp-fjord-36039.herokuapp.com/';

import { eanUserBranchSelect, eanUserYearSelect, eanUserDivisionSelect, eanUserBatchSelect } from '../../Actions/index';

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
          refreshing: false,
          yearSortFlag: false,
          branchSortFlag: false,
          generalSortFlag: true,
          batchSortFlag: false,
          divisionSortFlag: false
        }
  
      this.arrayHolder = [];
    }
  
    async componentDidMount() {
      await Auth.currentAuthenticatedUser({
        bypassCache: true  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
      }).then(user => {
        this.setState({
          userRegID: `${user.attributes["custom:college_reg_id"]}`,
          fName: `${user.attributes["name"]}`,
          lName: `${user.attributes["family_name"]}`,
          email: `${user.attributes["email"]}`,
          sub: `${user.attributes["sub"]}`
        });
      console.log("EAN User Attributes: " + user.attributes["sub"]);
      this.getDataFromBackend();
    })
    .catch(error => (console.log("User Profile Auth Error: "+ error)));
    }
    
    async getDataFromBackend() {
      const url = ROOT_URL+`nd/getDetails`;
      this.setState({ loading: true, yearSortFlag: false, branchSortFlag: false, generalSortFlag: true, divisionSortFlag: false, batchSortFlag: false});
    
      fetch(url, {
          method: 'POST',
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              //sub: '70730da8-374f-4199-b252-573718f26949'
              sub: this.state.sub
          }),
          })
          .then((response) => response.json())
          .then((responseJson) => {
            console.log(responseJson.year);
              this.onYearSelect(responseJson.year);
              this.onBranchSelect(responseJson.branch);
              this.onDivisionSelect(responseJson.division);
              this.onBatchSelect(responseJson.batch);
              this.makeRemoteRequest();
          })
          .catch(err => console.log("Notices Page: Backend Data Fetch => " + err));
      }
    
    onBranchSelect = (text) => {
        this.props.eanUserBranchSelect(text);
    }
    
    onYearSelect = (text) => {
      this.props.eanUserYearSelect(text);
    }
    
    onDivisionSelect = (text) => {
      this.props.eanUserDivisionSelect(text);
    }
    onBatchSelect = (text) => {
      this.props.eanUserBatchSelect(text);
    }
  
    makeRemoteRequest = () => {
      const url = ROOT_URL+`bh/getassignments`;
      this.setState({ loading: true, yearSortFlag: false, branchSortFlag: false, generalSortFlag: true, divisionSortFlag: false, batchSortFlag: false});

      
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
  
    renderNotices() {
      return this.state.data.map(notice => 
          <NoticeDetail key={notice._id.toString()} notice={notice} /> 
      );
  }
  
    renderCollapsibleList = () => {
      return(
        <ScrollView>
          {this.renderNotices()}
        </ScrollView>
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
    if (this.state.yearSortFlag === true) {
      return(
        <View horizontal style={{flexDirection: 'row', marginVertical: 2, justifyContent: 'center', alignContent: 'center', borderBottomWidth: 2, borderColor: '#E0E0E0', marginHorizontal: 8}}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <View style={{justifyContent: 'center', alignContent:'center', flex: 1}}>
              <Icon raised name="filter" size={20} type="font-awesome" color="#FF9800"/>
            </View>
            <TouchableOpacity activeOpacity={0} style={{justifyContent: 'center', alignContent:'center', flex: 1, borderRadius: 15}} onPress={() => this.yearWiseSort()}>
              <Text style={{ borderWidth: 2, marginLeft: 10, margin: 2.5, padding: 7, backgroundColor:'#FF5722', borderColor:'#FF5722', color:'#fff', borderRadius: 15}}>Year Wise</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{justifyContent: 'center', alignContent:'center', flex: 1}} onPress={() => this.branchWiseSort()}>
              <Text style={{ borderWidth: 2, marginLeft: 10, margin: 2.5, padding: 7, backgroundColor:'transparent', borderColor:'#FA9800', color:'#666', borderRadius: 15}}>Branch Wise</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{justifyContent: 'center', alignContent:'center', flex: 1}} onPress={() => this.makeRemoteRequest()}>
              <Text style={{ borderWidth: 2, marginLeft: 10, margin: 2.5, padding: 7, backgroundColor:'transparent', borderColor:'#FA9800', color:'#666', borderRadius: 15}}>General</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{justifyContent: 'center', alignContent:'center', flex: 1}} onPress={() => this.divisionWiseSort()}>
              <Text style={{ borderWidth: 2, marginLeft: 10, margin: 2.5, padding: 7, backgroundColor:'transparent', borderColor:'#FA9800', color:'#666', borderRadius: 15}}>Division Wise</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{justifyContent: 'center', alignContent:'center', flex: 1}} onPress={() => this.batchWiseSort()}>
              <Text style={{ borderWidth: 2, marginRight: 10, margin: 2.5, padding: 7, backgroundColor:'transparent', borderColor:'#FA9800', color:'#666', borderRadius: 15}}>Batch Wise</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      );
    } else if (this.state.generalSortFlag === true) {
      return(
        <View horizontal style={{flexDirection: 'row', marginVertical: 2, justifyContent: 'center', alignContent: 'center', borderBottomWidth: 2, borderColor: '#E0E0E0', marginHorizontal: 10}}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <View style={{justifyContent: 'center', alignContent:'center', flex: 1}}>
              <Icon raised name="filter" size={20} type="font-awesome" color="#FF9800"/>
            </View>
            <TouchableOpacity activeOpacity={0} style={{justifyContent: 'center', alignContent:'center', flex: 1, borderRadius: 15}} onPress={() => this.yearWiseSort()}>
              <Text style={{ borderWidth: 2, marginLeft: 10, margin: 2.5, padding: 7, backgroundColor:'transparent', borderColor:'#FA9800', color:'#666', borderRadius: 15}}>Year Wise</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{justifyContent: 'center', alignContent:'center', flex: 1}} onPress={() => this.branchWiseSort()}>
              <Text style={{ borderWidth: 2, marginLeft: 10, margin: 2.5, padding: 7, backgroundColor:'transparent', borderColor:'#FA9800', color:'#666', borderRadius: 15}}>Branch Wise</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{justifyContent: 'center', alignContent:'center', flex: 1}} onPress={() => this.makeRemoteRequest()}>
              <Text style={{ borderWidth: 2, marginLeft: 10, margin: 2.5, padding: 7, backgroundColor:'#FF5722', borderColor:'#FF5722', color:'#fff', borderRadius: 15}}>General</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{justifyContent: 'center', alignContent:'center', flex: 1}} onPress={() => this.divisionWiseSort()}>
              <Text style={{ borderWidth: 2, marginLeft: 10, margin: 2.5, padding: 7, backgroundColor:'transparent', borderColor:'#FA9800', color:'#666', borderRadius: 15}}>Division Wise</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{justifyContent: 'center', alignContent:'center', flex: 1}} onPress={() => this.batchWiseSort()}>
              <Text style={{ borderWidth: 2, marginRight: 10, margin: 2.5, padding: 7, backgroundColor:'transparent', borderColor:'#FA9800', color:'#666', borderRadius: 15}}>Batch Wise</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      );
    } else if (this.state.divisionSortFlag === true) {
      return(
        <View horizontal style={{flexDirection: 'row', marginVertical: 2, justifyContent: 'center', alignContent: 'center', borderBottomWidth: 2, borderColor: '#E0E0E0', marginHorizontal: 10}}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <View style={{justifyContent: 'center', alignContent:'center', flex: 1}}>
              <Icon raised name="filter" size={20} type="font-awesome" color="#FF9800"/>
            </View>
            <TouchableOpacity activeOpacity={0} style={{justifyContent: 'center', alignContent:'center', flex: 1, borderRadius: 15}} onPress={() => this.yearWiseSort()}>
              <Text style={{ borderWidth: 2, marginLeft: 10, margin: 2.5, padding: 7, backgroundColor:'transparent', borderColor:'#FA9800', color:'#666', borderRadius: 15}}>Year Wise</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{justifyContent: 'center', alignContent:'center', flex: 1}} onPress={() => this.branchWiseSort()}>
              <Text style={{ borderWidth: 2, marginLeft: 10, margin: 2.5, padding: 7, backgroundColor:'transparent', borderColor:'#FA9800', color:'#666', borderRadius: 15}}>Branch Wise</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{justifyContent: 'center', alignContent:'center', flex: 1}} onPress={() => this.makeRemoteRequest()}>
              <Text style={{ borderWidth: 2, marginLeft: 10, margin: 2.5, padding: 7, backgroundColor:'transparent', borderColor:'#FA9800', color:'#666', borderRadius: 15}}>General</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{justifyContent: 'center', alignContent:'center', flex: 1}} onPress={() => this.divisionWiseSort()}>
              <Text style={{ borderWidth: 2, marginLeft: 10, margin: 2.5, padding: 7, backgroundColor:'#FF5722', borderColor:'#FF5722', color:'#fff', borderRadius: 15}}>Division Wise</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{justifyContent: 'center', alignContent:'center', flex: 1}} onPress={() => this.batchWiseSort()}>
              <Text style={{ borderWidth: 2, marginRight: 10, margin: 2.5, padding: 7, backgroundColor:'transparent', borderColor:'#FA9800', color:'#666', borderRadius: 15}}>Batch Wise</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      );
    }
    else if (this.state.branchSortFlag === true) {
      return(
        <View horizontal style={{flexDirection: 'row', marginVertical: 2, justifyContent: 'center', alignContent: 'center', borderBottomWidth: 2, borderColor: '#E0E0E0', marginHorizontal: 10}}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <View style={{justifyContent: 'center', alignContent:'center', flex: 1}}>
              <Icon raised name="filter" size={20} type="font-awesome" color="#FF9800"/>
            </View>
            <TouchableOpacity activeOpacity={0} style={{justifyContent: 'center', alignContent:'center', flex: 1, borderRadius: 15}} onPress={() => this.yearWiseSort()}>
              <Text style={{ borderWidth: 2, marginLeft: 10, margin: 2.5, padding: 7, backgroundColor:'transparent', borderColor:'#FA9800', color:'#666', borderRadius: 15}}>Year Wise</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{justifyContent: 'center', alignContent:'center', flex: 1}} onPress={() => this.branchWiseSort()}>
              <Text style={{ borderWidth: 2, marginLeft: 10, margin: 2.5, padding: 7, backgroundColor:'#FF5722', borderColor:'#FF5722', color:'#fff', borderRadius: 15}}>Branch Wise</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{justifyContent: 'center', alignContent:'center', flex: 1}} onPress={() => this.makeRemoteRequest()}>
              <Text style={{ borderWidth: 2, marginLeft: 10, margin: 2.5, padding: 7, backgroundColor:'transparent', borderColor:'#FA9800', color:'#666', borderRadius: 15}}>General</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{justifyContent: 'center', alignContent:'center', flex: 1}} onPress={() => this.divisionWiseSort()}>
              <Text style={{ borderWidth: 2, marginLeft: 10, margin: 2.5, padding: 7, backgroundColor:'transparent', borderColor:'#FA9800', color:'#666', borderRadius: 15}}>Division Wise</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{justifyContent: 'center', alignContent:'center', flex: 1}} onPress={() => this.batchWiseSort()}>
              <Text style={{ borderWidth: 2, marginRight: 10, margin: 2.5, padding: 7, backgroundColor:'transparent', borderColor:'#FA9800', color:'#666', borderRadius: 15}}>Batch Wise</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      );
    } else if (this.state.batchSortFlag === true) {
      return(
        <View horizontal style={{flexDirection: 'row', marginVertical: 2, justifyContent: 'center', alignContent: 'center', borderBottomWidth: 2, borderColor: '#E0E0E0', marginHorizontal: 10}}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <View style={{justifyContent: 'center', alignContent:'center', flex: 1}}>
              <Icon raised name="filter" size={20} type="font-awesome" color="#FF9800"/>
            </View>
            <TouchableOpacity activeOpacity={0} style={{justifyContent: 'center', alignContent:'center', flex: 1, borderRadius: 15}} onPress={() => this.yearWiseSort()}>
              <Text style={{ borderWidth: 2, marginLeft: 10, margin: 2.5, padding: 7, backgroundColor:'transparent', borderColor:'#FA9800', color:'#666', borderRadius: 15}}>Year Wise</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{justifyContent: 'center', alignContent:'center', flex: 1}} onPress={() => this.branchWiseSort()}>
              <Text style={{ borderWidth: 2, marginLeft: 10, margin: 2.5, padding: 7, backgroundColor:'transparent', borderColor:'#FA9800', color:'#666', borderRadius: 15}}>Branch Wise</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{justifyContent: 'center', alignContent:'center', flex: 1}} onPress={() => this.makeRemoteRequest()}>
              <Text style={{ borderWidth: 2, marginLeft: 10, margin: 2.5, padding: 7, backgroundColor:'transparent', borderColor:'#FA9800', color:'#666', borderRadius: 15}}>General</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{justifyContent: 'center', alignContent:'center', flex: 1}} onPress={() => this.divisionWiseSort()}>
              <Text style={{ borderWidth: 2, marginLeft: 10, margin: 2.5, padding: 7, backgroundColor:'transparent', borderColor:'#FA9800', color:'#666', borderRadius: 15}}>Division Wise</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{justifyContent: 'center', alignContent:'center', flex: 1}} onPress={() => this.batchWiseSort()}>
              <Text style={{ borderWidth: 2, marginLeft: 10, margin: 2.5, padding: 7, backgroundColor:'#FF5722', borderColor:'#FF5722', color:'#fff', borderRadius: 15}}>Batch Wise</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      );
    }
  }
  
  yearWiseSort = () => {
    this.setState({loading: true, yearSortFlag: true, branchSortFlag: false, generalSortFlag: false, divisionSortFlag: false, batchSortFlag: false});
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
    this.setState({loading: true, yearSortFlag: false, branchSortFlag: true, generalSortFlag: false, divisionSortFlag: false, batchSortFlag: false});
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
    this.setState({loading: true, yearSortFlag: false, branchSortFlag: false, generalSortFlag: false, divisionSortFlag: true, batchSortFlag: false});
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
    this.setState({loading: true, yearSortFlag: false, branchSortFlag: false, generalSortFlag: false, divisionSortFlag: false, batchSortFlag: true});
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
      <View style={styles.container}>
          { this.renderHeader() }
          { this.filterOptions() }
          { this.renderCollapsibleList() }
          { this.floatingButton() }
      </View>
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

export default connect(mapStateToProps, {eanUserBranchSelect, eanUserYearSelect, eanUserDivisionSelect, eanUserBatchSelect})(Assignments);