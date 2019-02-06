import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, TouchableOpacity, Dimensions, KeyboardAvoidingView, FlatList, Image, Keyboard, TextInput, StyleSheet, StatusBar, TouchableWithoutFeedback, ActivityIndicator, Modal, Text, ScrollView } from 'react-native';
import { Header, ListItem, Icon, Button } from 'react-native-elements';
import { LinearGradient, Notifications } from 'expo';
import IconBadge from 'react-native-icon-badge';
import { DangerZone } from 'expo';
const { Lottie } = DangerZone;

const bookLoading = require('../../Animations/downloading_book.json');


class AllBooksListScreen extends Component {

  static navigationOptions = {
    title: 'All Books',
    tabBarIcon: ({ tintColor }) => {
        return <Icon name="book" type="font-awesome" size={25} color={tintColor} />;
    }
}

    constructor(props) {
        super(props);

        this.state = {
          loading: false,
          searchLoad: false,
          searchBarText: '',
          searchBarTextTouched: false,
          data:[],
          error: '',
          modalVisible:false,
          bookSelected:[],
          noticeBadgeCount: 0,
          animation: null,
        }

        this.arrayHolder = [];
    }

    componentDidMount(){
        this._playAnimation();
        this.makeRemoteRequest();
        this.loadNoticeCount();
    }

    loadNoticeCount = () => {
        const url = `https://mighty-hollows-23016.herokuapp.com/bh/getNotices`;
        this.setState({ loading: true });

      fetch(url)
        .then(res => res.json())
        .then(res => {
          this.setState({
            //data: res.results,
            noticeBadgeCount: res.activecount,
            error: res.error || null,
            loading: false,
          });
      //this.arrayHolder = res.results;
        })
      .catch(error => {
      this.setState({ error, loading: false });
      });

    };

    makeRemoteRequest = () => {
        this._playAnimation();
        const url = `https://collegebuddy.pythonanywhere.com/api/book/100`;
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

    onSearchTextChange(text) {
      //text=text.trim();
      this.setState({
        searchBarText: text,
        searchBarTextTouched: true,
        searchLoad: true
      });
      console.log("All Books Array Holder: " + this.arrayHolder);
      const newData = this.arrayHolder.filter(item => {
        const itemData = `${item.Author.toUpperCase()} ${item.Publisher.toUpperCase()} ${item.Title.toUpperCase()}`;
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      this.setState({
        data: newData,
        searchLoad: false
      });
    }

    modifySearchBar = () => {
        return (
          <TextInput
            ref="searchBarInput"
            autoCapitalize = 'none'
            underlineColorAndroid="transparent" 
            placeholder="Find me a Book ..." 
            placeholderTextColor="#616161" 
            style={styles.searchBarTextInput}
            onChangeText={(text) => this.onSearchTextChange(text)}
            value={this.state.searchBarText}
          />
        );
    }

    clearSearchText() {
      Keyboard.dismiss();
      this.setState({
        searchBarText: '',
        searchBarTextTouched: false,
        searchLoad: false
      });
      this.onSearchTextChange("");
    }

    crossIconFunctionality = () => {
      if (this.state.searchBarTextTouched) {
        return (
          <View style={{marginRight: 5, alignContent:'center'}}>
            <Icon name='cross' type='entypo' color='#FF8F00' onPress={() => this.clearSearchText() } underlayColor={'#64b5f6'}/>
          </View>
        );
      }
    }
    
    focusTextInput() {
      this.refs.searchBarInput.focus();
    }

    searchIconFunctionality = () => {
      return (
        <View style={{marginLeft: 15, marginRight: 10, alignContent:'center'}}>
          <Icon name='magnifying-glass' type='entypo' color='#FF8F00' onPress={() => this.focusTextInput()} />
        </View>
      );
    }

    bookDetailModal = (item) => {
      this.setState({bookSelected: item}, () =>{
        this.setModalVisible(true);
      });
    }

    setModalVisible(visible) {
      this.setState({modalVisible: visible});
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
              leftAvatar={{ source: { uri: "http://books.google.com/books/content?id=_ojXNuzgHRcC&printsec=frontcover&img=1&zoom=5&edge=curl&imgtk=AFLRE730gA8gykyn3eW-2UcqAait5rm7mkY0fxMIYsgNqe7rMLL1N1Lem_aEPK4CjW_o-gWHKcV2yQw6EtiyUhmZkNa2Mp4GgfRpnLNjq7lgHu_Nfwj1TaZZBkmqxR2coVrJ9BWmydUK&source=gbs_api" } }} //uri:item.image
              containerStyle={{ borderBottomWidth: 0 }}
              chevronColor='#CED0CE'
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
                        {this.state.bookSelected.AC > 0 ? <Text style={styles.available}>Can be Issued</Text>: <Text style={styles.notAvailable}>Already Issued</Text> }
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

toNotificationScreen() {
  this.props.navigation.navigate('libraryNotifications');
}

toBarCodeScannerScreen() {
  this.props.navigation.navigate('issuance');
}

renderRightComponent = () => {
  return (
    <View style={{flexDirection: 'row'}}>
        <IconBadge
          MainElement={
            <Icon name="bullhorn" type="font-awesome" color="#fff" onPress={() => this.toNotificationScreen()} size={30} underlayColor="#64b5f6"/>
          }
          BadgeElement={
            <Text style={{color:'#FFFFFF'}}>{this.state.noticeBadgeCount}</Text>
          }
          IconBadgeStyle={
            {
              position:'absolute',
              top:-5,
              right:-5,
              width:20,
              height:20,
              borderRadius:15,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#FF0000'
            }
          }
          Hidden={this.state.noticeBadgeCount==0}
          />
    </View>
   );
}

  renderHeader = () => {
    return(
      <Header
        backgroundColor="#FF6D00"
        outerContainerStyles={{borderBottomWidth: 0.5, borderColor: '#000000'}}
        centerContainerStyle={{paddingTop: 10}}
        rightContainerStyle={{paddingTop: 10}}
        leftContainerStyle={{margin: 10}}
        centerComponent={{ text: 'BunkSheet', style: { color: '#fff',fontSize: 24, fontWeight: 'bold' } }}
        rightComponent={this.renderRightComponent()}
        leftComponent={{ icon: 'barcode', type: 'font-awesome', color: '#fff', onPress: () => this.toBarCodeScannerScreen(), size: 30, underlayColor:'#64b5f6' }}
      />
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
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.container}>
                        
                        {this.renderHeader()}

                        <View style={styles.sectionStyle}>
                          {this.searchIconFunctionality()}
                          {this.modifySearchBar()}
                          {this.crossIconFunctionality()}
                        </View>

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


const styles = StyleSheet.create({
  container: {
      flexDirection: 'column',
      flex: 1,
      backgroundColor: 'transparent'
    },
    searchBarTextInput: {
      flex: 1
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
  
  //Animation Styles
  animationContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  buttonContainer: {
    paddingTop: 20,
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

});

const mapStateToProps = (state) => {
    return {
    }
}

export default connect(mapStateToProps, {})(AllBooksListScreen);