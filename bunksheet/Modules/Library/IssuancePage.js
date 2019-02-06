import React, { Component } from 'react';
import { 
    View, 
    ScrollView, 
    ActivityIndicator, 
    ImageBackground, 
    Text, StyleSheet, 
    TouchableOpacity, 
    KeyboardAvoidingView, 
    StatusBar, 
    TouchableWithoutFeedback, 
    Keyboard, 
    FlatList,
    Dimensions,
    Modal, Image, LinearGradient,
    Alert
} from 'react-native';
import { Header, Icon, ListItem } from 'react-native-elements';

import { Auth } from 'aws-amplify';

import { connect } from 'react-redux'
import { 
  signupRegIDChanged,
} from '../../actions/index'

import openSocket from 'socket.io-client';
const  socket = openSocket('https://mighty-hollows-23016.herokuapp.com/user');

import { DangerZone } from 'expo';
const { Lottie } = DangerZone;

const bookLoading = require('../../Animations/loading_animation.json');

class Issuance extends Component {

    constructor (props) {
        super(props);

        this.state = {
            loading: false,
            data:[],
            error: '',
            modalVisible:false,
            bookSelected: [],
            animation: null,
            currentLoggedUserRegID: 'E2K1610000',
        }
        this.arrayHolder = [];
    }

    componentDidMount(){
        this._playAnimation();

        Auth.currentAuthenticatedUser({
          bypassCache: true  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
        }).then(user => {
          this.setState({
            currentLoggedUserRegID: `${user.attributes["custom:college_reg_id"]}`,
          });
        console.log("Issuance Page User Attributes: "+user.attributes);
      });


        this.makeRemoteRequest();
    }

    makeRemoteRequest = () => {
        this._playAnimation();
        const url = `https://collegebuddy.pythonanywhere.com/api/FA`;
        this.setState({ loading: true });

        fetch(url)
            .then(res => res.json())
            .then(res => {
            this.setState({
                //data: res.results,
                data: res,
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

    toAllBooksListScreen() {
        this.props.navigation.navigate('all_books_list');
    }

    renderHeader = () => {
        return(
            <Header
            backgroundColor="#FFA000"
            outerContainerStyles={{borderBottomWidth: 0.5, borderColor: '#000000'}}
            centerContainerStyle={{paddingTop: 10}}
            leftContainerStyle={{margin: 10}}
            centerComponent={{ text: 'Issuance Counter', style: { color: '#fff',fontSize: 22, fontWeight: 'bold' } }}
            leftComponent={{ icon: 'arrow-left', type: 'entypo', color: '#fff', onPress: () => this.toAllBooksListScreen(), size: 30, underlayColor:'#64b5f6' }}
            />
        );
    }

    toBarCode = () => {
        this.props.navigation.navigate('barCodeScanner');
    }

    floatingButton = () => {
        return (
            <TouchableOpacity onPress={() => this.toBarCode()} style={styles.fab}>
                <Icon 
                  raised
                  name='plus'
                  type='entypo'
                  color = '#E65100'
                  style ={styles.checkButtonLayout}/>
            </TouchableOpacity>
        );
    }

    renderTitle = () => {
        return (
            <View style={{borderBottomWidth: 1, margin: 15, borderBottomColor:'#9E9E9E'}}> 
                <Text style={{fontWeight:'bold', marginLeft: 0, marginTop: 10, marginBottom:3, fontSize: 18, color: '#2196F3'}}>Issued Books List </Text>
            </View>
        );
    }

    renderSeparator = () => {
        return (
          <View
            style={{
              height: 1,
              width: '86%',
              backgroundColor: '#CED0CE',
              marginLeft: '14%',
            }}
          />
        );
      };

      bookDetailModal = (item) => {
        this.setState({bookSelected: item}, () =>{
          this.setModalVisible(true);
        });
      }

      alertConfirmationYES = (ISBN, regID) => {
          this.setModalVisible(false);
          
          socket.emit('requestReturnBook', { regID: `${regID}`, ban: `${ISBN}`});
          this.props.navigation.navigate('returnPendingToken');
          socket.on('responseReturnBook', socketStatus => {
            if (socketStatus.rcode === 501) {
              this.props.navigation.navigate('returnFailureToken');
            } else if (socketStatus.rcode === 600) {
              this.props.navigation.navigate('returnSuccessToken');
            } 
            socket.close(); 
          });
          
      }

      alertConfirmationNO = () => {
        this.setModalVisible(false);
    }

      confirmationAlert = (bookSelected) => {

        const {currentLoggedUserRegID} = this.state

        Alert.alert(
            'Confirm Return',
            `Do you really want to return this book? ISBN: ${bookSelected.ISBN} ID: ${currentLoggedUserRegID}`,
            [
              {text: 'NO', onPress: () => this.alertConfirmationNO(), style: 'cancel'},
              {text: 'YES', onPress: () => this.alertConfirmationYES(bookSelected.ISBN, currentLoggedUserRegID)},
            ],
            { cancelable: false }
          )
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
                        roundAvatar
                        title={item.Title}
                        titleStyle = {{fontWeight: "bold"}}
                        subtitle={`Author: ${item.Author}`}
                        leftAvatar={{ source: { uri: item.Image } }}
                        chevronColor="white"
                        chevron
                        containerStyle={{ borderBottomWidth: 0 }}
                        onPress={() => this.bookDetailModal(item)}
                    />
                    )}
                    keyExtractor={item => item.id.toString()}
                    ItemSeparatorComponent={this.renderSeparator}
                    //ListHeaderComponent={this.renderHeader}
                />

                <Modal
                animationType={'fade'}
                transparent={true}
                onRequestClose={() => this.setModalVisible(false)}
                visible={this.state.modalVisible}>

                    <View style={styles.popupOverlay}>
                    <View style={styles.popup}>
                        <View style={styles.popupContent}>
                        <ScrollView contentContainerStyle={styles.modalInfo}>
                            <Image style={styles.image} source={{uri: this.state.bookSelected.Image}}/>
                            <Text style={styles.name}>{this.state.bookSelected.Title}</Text> 
                            <Text style={styles.pageCount}>Return Date: Jan 8th, 2019</Text>
                            <Text style={styles.author}>Author: {this.state.bookSelected.Author}</Text>
                            <Text style={styles.publisher}>Publisher: {this.state.bookSelected.Publisher}</Text>
                            <Text style={styles.about}>"Discover the beautiful science of flowers! Through full-color photos and simple, easy-to-follow text, this nonfiction book introduces emergent readers to the basics of botany, including information on how flowers grow, along with their uses. All Pebble Plus books align with national and state standards and are designed to help new readers read independently, making them the perfect choice for every child."</Text>
                        </ScrollView>
                        </View>
                        <View style={styles.popupButtons}>
                            <TouchableOpacity style= {styles.btnClose} onPress={() => {this.confirmationAlert(this.state.bookSelected)}}>
                                <Text style={styles.txtClose}>Return</Text>
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
            this._playAnimation;
              return (
                <TouchableWithoutFeedback onPress={() => this._playAnimation()}>
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
                      speed={1.5}
                    />}
                  </View>
                </TouchableWithoutFeedback>
              );
            }

        return (
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                <StatusBar barStyle = "dark-content" hidden = {false} translucent = {true}/>
                <ImageBackground style={{width: '100%', height: '100%'}} source={require('../../images/kisspng-tawny-owl-bird-drawing-illustration-cartoon-owl-5a8ec746b54eb3.1179982415193065667426.png')} >  
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.container}>

                        {this.renderHeader()}
                        {this.renderTitle()}
                        {this.renderList()}

                        {this.floatingButton()}

                    </View>
                </TouchableWithoutFeedback>
                </ImageBackground>
            </KeyboardAvoidingView>
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
    container: {
        flexDirection: 'column',
        flex: 1,
        backgroundColor: 'transparent'
    },
    fab: { 
        position: 'absolute', 
        width: 70, 
        height: 70, 
        alignItems: 'center', 
        justifyContent: 'center', 
        right: 30, 
        bottom: 30, 
        backgroundColor: '#FFCCBC', 
        borderRadius: 40, 
        elevation: 8 
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
    backgroundColor:'#EF6C00',
    padding:10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30
  },
  modalInfo:{
    alignItems:'center',
    justifyContent:'center',
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
    marginTop: 10
  },
  pageCount: {
    marginTop:10,
    marginLeft: 10,
    flex: 1,
    color: '#311B92'
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
  }
});

const mapStateToProps = (state) => ({
  regID: state.sign_up.regID,
});

export default connect(mapStateToProps, {
  signupRegIDChanged,
})(Issuance);