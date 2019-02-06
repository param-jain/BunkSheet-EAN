
import React, { Component } from 'react';
import { View, Text, Modal, ImageBackground, Dimensions, TouchableOpacity, Image, LinearGradient, Keyboard, ActivityIndicator, KeyboardAvoidingView, TouchableWithoutFeedback, StatusBar, ScrollView, FlatList } from 'react-native';
import { Header, ListItem } from 'react-native-elements';

import { connect } from 'react-redux'
import { libraryNoticeCount } from '../../actions/index'

const ROOT_URL = 'https://mighty-hollows-23016.herokuapp.com/';


class LibraryNotificationScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data:[],
      error: '',
      modalVisible:false,
      noticeSelected:[]
    }

    this.arrayHolder = [];
}

componentDidMount(){
  this.makeRemoteRequest();
}

makeRemoteRequest = () => {
  const url = `https://mighty-hollows-23016.herokuapp.com/bh/getNotices`;
  this.setState({ loading: true });

  fetch(url)
      .then(res => res.json())
      .then(res => {
      this.setState({
          //data: res.results,
          data: res.notices,
          error: res.error || null,
          loading: false,
      });
      this.arrayHolder = res;
      //this.arrayHolder = res.results;
      })
      .catch(error => {
      this.setState({ error, loading: false });
      });
};

  backButtonNavigation() {
      this.setState({ errorMessage: '' });
      this.props.navigation.navigate('all_books_list');
  }

  renderHeader = () => {
    return(
        <Header
        backgroundColor="#FFA000"
        outerContainerStyles={{borderBottomWidth: 0.5, borderColor: '#000000'}}
        centerContainerStyle={{paddingTop: 10}}
        rightContainerStyle={{paddingTop: 10}}
        leftContainerStyle={{margin: 10}}
        centerComponent={{ text: 'Notice Board', style: { color: '#fff',fontSize: 22, fontWeight: 'bold' } }}
        leftComponent={{ icon: 'arrow-left', type: 'entypo', color: '#fff', onPress: () => this.backButtonNavigation(), size: 30, underlayColor:'#64b5f6' }}
        />
    );
}

renderSeparator = () => {
  return (
    <View
      style={{
        height: 1,
        width: '100%',
        backgroundColor: '#CED0CE',
        marginLeft: '0%',
      }}
    />
  );
};

noticeDetailModal = (item) => {
  this.setState({noticeSelected: item}, () =>{
    this.setModalVisible(true);
  });
}

setModalVisible(visible) {
  this.setState({modalVisible: visible});
}  

renderList = () => {
  return (
      <ScrollView>

          <FlatList
              keyboardShouldPersistTaps='always'
              data={this.state.data}
              renderItem={({ item }) => (
              <ListItem
              title={item.title}
              titleStyle = {{fontWeight: "bold"}}
              subtitle={item.timestamp}
              containerStyle={{ borderBottomWidth: 0 }}
              chevronColor="white"
              chevron
              onPress={() => this.noticeDetailModal(item)}
              />
              )}
              keyExtractor={item => item._id.toString()}
              ItemSeparatorComponent={this.renderSeparator}
              //ListHeaderComponent={this.renderHeader}
          />

          <Modal
            animationType={"fade"}
            transparent={true}
            onRequestClose={() => this.setModalVisible(false)}
            visible={this.state.modalVisible}>

              
              <View style={styles.popupOverlay}>
                <View style={styles.popup}>
                  <View style={styles.popupContent}>
                    <ScrollView contentContainerStyle={styles.modalInfo}>
                    
                      <Text style={styles.name}>{this.state.noticeSelected.title}</Text>
                      <Text style={styles.about}>{this.state.noticeSelected.nbody}</Text>
                      <Text style={{ fontWeight: 'bold', alignSelf: 'flex-end', marginRight: 20, marginTop: 20}}>{this.state.noticeSelected.timestamp}</Text>

                      <Image style= {{ height: 300, width: 300, borderRadius: 10, marginTop: 20}} source={{uri: ROOT_URL+this.state.noticeSelected.noticeimage}}/>
              
                    </ScrollView>
                  </View>
                    <View style={styles.popupButtons}>
                    <TouchableOpacity style={styles.btnClose} onPress={() => {this.setModalVisible(false) }}>
                      <Text style={styles.txtClose}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

          </Modal>
                
      </ScrollView>
  );
}

  render() {
    if (this.state.loading) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" animating={this.state.loading} />
        </View>
      );
    }
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
          <StatusBar barStyle = "dark-content" hidden = {false} translucent = {true}/>
          <ImageBackground style={{width: '100%', height: '100%'}} source={require('../../images/eef45d75157408bdffd8c22c358d00fd.png')} >  
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.container}>
                  
                {this.renderHeader()}
                {this.renderList()}

              </View>          
          </TouchableWithoutFeedback>
          </ImageBackground>
          </KeyboardAvoidingView>
    );
  }
}

styles={
  container: {
      flexDirection: 'column',
      flex: 1,
      backgroundColor: 'transparent'
    },
  sectionStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#F57C00',
    height: 35,
    borderRadius: 15,
    margin: 5
  },

  //Modals Styles
  popup: {
    backgroundColor: 'white',
    marginTop: 80,
    marginHorizontal: 20,
    borderRadius: 15,
  },
  popupOverlay: {
    backgroundColor: "#00000057",
    flex: 1,
    marginTop: 30
  },
  popupContent: {
    //alignItems: 'center',
    margin: 5,
    height:"80%",
  },
  popupHeader: {
    marginBottom: 45
  },
  popupButtons: {
    marginTop: 15,
    flexDirection: 'row',
    //borderTopWidth: 1,
    //borderBottomWidth: 1,
    borderColor: "#eee",
    justifyContent:'center'
  },
  popupButton: {
    flex: 1,
    marginVertical: 16
  },
  btnClose:{
    flex: 0.5,
    backgroundColor:'#FFB700',
    padding:10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30
  },
  modalInfo:{
    alignItems:'center',
    justifyContent:'center',
    top: 10,
  },
  image:{
    width:120,
    height:120,
    borderRadius:40,
    marginTop: 10
  },
  name:{
    fontSize:22,
    flex:1,
    alignSelf:'center',
    textAlign: 'center',
    justifyContent: 'center',
    color:"#FF3D00",
    fontWeight:'bold',
    marginTop: 10,
  },
  author:{
    fontSize:16,
    flex:1,
    alignSelf:'center',
    color:"#696969",
    marginTop: 5
  },
  publisher:{
    fontSize:16,
    flex:1,
    alignSelf:'center',
    color:"#696969",
  },
  about:{
    marginHorizontal:10,
    marginTop: 10,
  },
  notAvailable: {
    marginTop:20,
    marginRight: 20,
    color: 'red',
    flex: 1,
    textAlign: 'right'
  },
  available: {
    marginTop:20,
    marginRight: 20,
    color: 'green',
    flex: 1,
    textAlign: 'right'
  },
  txtClose: {
    alignContent: 'center',
    justifyContent:'center',
    color: '#FFFFFF',
    fontSize: 18,
    padding: 0
  },
}

const mapStateToProps = (state) => ({
  noticeCount: state.library.noticeCount,
});

export default connect (mapStateToProps, {
  libraryNoticeCount
})(LibraryNotificationScreen);