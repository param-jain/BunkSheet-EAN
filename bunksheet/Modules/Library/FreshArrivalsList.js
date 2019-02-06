import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, Modal, ScrollView, Image, Keyboard, ActivityIndicator, StatusBar, KeyboardAvoidingView, TouchableWithoutFeedback, FlatList } from 'react-native';
import { Header, ListItem, Icon } from 'react-native-elements';
import { LinearGradient } from 'expo';
import { DangerZone } from 'expo';
const { Lottie } = DangerZone;

import Amplify, { Auth } from 'aws-amplify';
import awsConfig from '../../sensitive_info/aws-exports';

Amplify.configure({ Auth: awsConfig });

const bookLoading = require('../../Animations/downloading_book.json');


class FreshArrivalsList extends Component {

    static navigationOptions = {
      title: 'Fresh Arrivals',
      tabBarIcon: ({ tintColor }) => {
          return <Icon name="new" type="entypo" size={25} color={tintColor} />;
      }
  }

    constructor(props) {
        super(props);

        this.state = {
          loading: false,
          data:[],
          error: '',
          modalVisible:false,
          bookSelected:[],
          animation: null,
        }

        this.arrayHolder = [];
    }

    componentDidMount(){
        this._playAnimation();
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

    LogOut() {
      Auth.signOut()
        .then(data => this.props.navigation.navigate('login'))
        .catch(err => console.log("Fresh Arrivals LogOut Error: " + err));
    }
      
    renderHeader = () => {
        return(
            <Header
            backgroundColor="#FFC110"
            outerContainerStyles={{borderBottomWidth: 0.5, borderColor: '#000000'}}
            centerContainerStyle={{paddingTop: 10}}
            rightContainerStyle={{paddingTop: 10}}
            leftContainerStyle={{margin: 10}}
            centerComponent={{ text: 'Fresh Arrivals', style: { color: '#fff',fontSize: 22, fontWeight: 'bold' } }}
            leftComponent={{ icon: 'arrow-left', type: 'entypo', color: '#fff', onPress: () => this.toAllBooksListScreen(), size: 30, underlayColor:'#64b5f6' }}
            rightComponent={{ icon: 'sign-out', type: 'font-awesome', color: '#fff', onPress: () => this.LogOut(), size: 27, underlayColor:'#64b5f6' }}
            />
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
                    subtitle={`A: ${item.Author}  P: ${item.Publisher}`}
                    leftAvatar={{ source: { uri: item.Image } }}
                    containerStyle={{ borderBottomWidth: 0 }}
                    chevronColor="white"
                    chevron
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
                            <Text style={styles.author}>Author: {this.state.bookSelected.Author}</Text>
                            <Text style={styles.publisher}>Publisher: {this.state.bookSelected.Publisher}</Text>
                            <Text style={styles.about}>"Discover the beautiful science of flowers! Through full-color photos and simple, easy-to-follow text, this nonfiction book introduces emergent readers to the basics of botany, including information on how flowers grow, along with their uses. All Pebble Plus books align with national and state standards and are designed to help new readers read independently, making them the perfect choice for every child."</Text>
                            <View style={{flexDirection: "row"}}>
                                <Text style={styles.pageCount}>Page Count: {this.state.bookSelected.pc}</Text>
                                {this.state.bookSelected.AC > 0 ? <Text style={styles.available}>Available</Text>: <Text style={styles.notAvailable}>Not Available</Text> }
                            </View>
                        </ScrollView>
                        </View>
                        <View style={styles.popupButtons}>
                        <LinearGradient
                        colors={['#FF9800', '#FB8C00', '#EF6C00']}
                        style={styles.btnClose}
                        >
                            <TouchableOpacity onPress={() => {this.setModalVisible(false) }}>
                            <Text style={styles.txtClose}>Close</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                        </View>
                    </View>
                    </View>
                </Modal>

            </ScrollView>
        );
    }

    toBookDetail() {
        this.props.navigation.navigate('bookDetailPage');
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
        return(
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                <StatusBar barStyle = "dark-content" hidden = {false} translucent = {true}/>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.container}>
                        
                        {this.renderHeader()}
                        {this.renderList()}

                    </View>
                </TouchableWithoutFeedback>
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
    backgroundColor:'#EF6C00',
    padding: 10,
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
    marginTop:20,
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
}

export default FreshArrivalsList;
