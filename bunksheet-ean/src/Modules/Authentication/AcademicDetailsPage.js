
import React, { Component } from 'react'
import { ScrollView, Picker, StyleSheet, TouchableWithoutFeedback, TouchableOpacity, Platform, Text, View, Modal, Dimensions, ActivityIndicator } from 'react-native'
import { Avatar, Icon, ListItem } from 'react-native-elements'
import { Notifications } from 'expo'
import { connect } from 'react-redux'

import axios from 'axios';

import BaseIcon from '../../Styles/Icon'
import Chevron from '../../Styles/Chevron'

import Amplify, { Auth } from 'aws-amplify';
import awsConfig from '../../Sensitive_Info/aws-exports';
Amplify.configure({ Auth: awsConfig });

const ROOT_URL = 'https://bunksheet.ml/';

import { eanUserBranchSelect, eanUserYearSelect, eanUserDivisionSelect, eanUserBatchSelect } from '../../Actions/index';

class AcademicDetailsPage extends React.Component {


    static navigationOptions = (props) => {
        
        return {
            title: 'Profile Settings',
            headerTitleStyle: { color: '#000' },
            //headerStyle: { backgroundColor: '#FF6F00' },
            headerBackTitleStyle: { color: '#000' },
            style: {
                marginTop: Platform.OS === 'android' ? 24 : 0
            }
        };
    }

    constructor (props) {
        super(props);

        this.state = {
            loading: false,
            branchModalVisible: false,
            yearModalVisible: false,
            divisionModalVisible: false,
            batchModalVisible: false,
            userRegID: 'E2K1610000',
            fName: 'Param',
            lName: 'Jain',
            email: 'param@bunksheet.com',
            sub: ''
        }
    }

    componentDidMount(){
        this.CognitoLoggedCurrentUser();
    }

    CognitoLoggedCurrentUser() {
        const { pakkaEmail, pakkaPassword } = this.props;

        this.setState({ loading: true, errorMessage: '' });

        Auth.signIn(pakkaEmail, pakkaPassword)
            .then(user => {
                    console.log("ADP: User Logged In Successfully => " + user);
                    //this.setState({ loading: false });
                    //this.props.navigation.navigate('ean_home', user); 
                    Auth.currentAuthenticatedUser({
                        bypassCache: true  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
                      }).then(user => {
                        this.setState({
                          userRegID: `${user.attributes["custom:college_reg_id"]}`,
                          fName: `${user.attributes["name"]}`,
                          lName: `${user.attributes["family_name"]}`,
                          email: `${user.attributes["email"]}`,
                          sub: `${user.attributes["sub"]}`,
                          loading: false
                        });
                      console.log("ADP: EAN Academic Details User Attributes: "+user.attributes);
                      console.log("ADP: EAN Current State User Attributes: "+this.state.userRegID+ " "+ this.state.sub);
                    })
                    .catch(error => {
                        this.setState({loading: false});
                        console.log("Academic Details: Error > Unable to Fetch User Attributes => " + error)
                    });              
                })
            .catch(err => { 
                this.setState({ loading: false });
                this.setState({ errorMessage: err.message }); 
                console.log("ADP: UserName, Password => " + this.props.pakkaEmail + " " + this.props.pakkaPassword);
                console.log("ADP: Cannot Log In => " + err);
            });
    }

    async sendDetailsToBackend(token) {

      const url = ROOT_URL+`nd/addUser`;
      this.setState({ loading: true });

      const userDetails = {
        expoToken: token,
        sub: this.state.sub,
        branch: this.props.branch,
        batch: this.props.batch,
        year: this.props.year,
        division: this.props.division,
        regId: this.state.userRegID,
        fName: this.state.fName,
        lName: this.state.lName,
        email: this.state.email
      }

      const config = {
        Headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }

      await axios.post( url, userDetails, config)
      .then(res => {
        console.log("ADP: User Details sent to Backend Successfully => " + res);
        this.props.navigation.navigate('ean_home');
        this.setState({ loading: false });
      })
      .catch(error => {
        console.log("ADP: User Details NOT sent to Backend i.e. REQUEST FAILED =>" + error);
        this.props.navigation.navigate('ean_home');
        this.setState({ loading: false });
      });

    }

    async proceedToEANHome() {
      console.log('Button Click Ho Gaya Hai')
      let token = await Notifications.getExpoPushTokenAsync();
      console.log("ADP token => " + token );
      this.sendDetailsToBackend(token);
    }

    onPressBranchSelectionModal = () => {
        this.setState({branchModalVisible: true});
    }

    onBranchSelect = (text) => {
        this.props.eanUserBranchSelect(text);
    }

    onPressYearSelectionModal = () => {
      this.setState({yearModalVisible: true});
    }

    onYearSelect = (text) => {
      this.props.eanUserYearSelect(text);
    }

    onPressDivisionSelectionModal = () => {
      this.setState({divisionModalVisible: true});
    }

    onDivisionSelect = (text) => {
      this.props.eanUserDivisionSelect(text);
    }

    onPressBatchSelectionModal = () => {
      this.setState({batchModalVisible: true});
    }

    onBatchSelect = (text) => {
      this.props.eanUserBatchSelect(text);
    }

    renderBatchModal = () => {
        if (this.props.year === 'FE') {
            return(
                <Modal
                        animationType={'fade'}
                        transparent={true}
                        onRequestClose={() => this.setState({batchModalVisible: false})}
                        visible={this.state.batchModalVisible}
                    >
                        <View style={styles.popupOverlay } onPress={() => this.setState({batchModalVisible: false})}>
                            <View style={styles.popup}>
                                <View style={styles.popupContent}>
                                <TouchableOpacity style={{marginTop: 50}} onPress={() => this.setState({batchModalVisible: false})} >
                                    <Icon name='cross' type='entypo' raised color='#FF3D00'/>
                                </TouchableOpacity>
                                    <View style={{borderBottomWidth: 2, borderBottomColor:'#eeeeee', marginHorizontal:20}}>
                                        <Text style={styles.modalTitle}>Select Your Practical Batch</Text>
                                    </View>
                                    <View style={{marginLeft: 15, marginRight:15, marginTop: 7}}>
                                        <Picker
                                            selectedValue={this.props.batch}
                                            style={{height: 50, width: 2*Dimensions.get('window').width/3}}
                                            onValueChange={(itemValue) => {
                                                this.onBatchSelect(itemValue);
                                                this.setState({batchModalVisible: false});
                                            }}
                                            mode="dropdown">
                                            <Picker.Item label="" value="" />
                                            <Picker.Item label="A" value="A" />
                                            <Picker.Item label="B" value="B" />
                                            <Picker.Item label="C" value="C" />
                                            <Picker.Item label="D" value="D" />
                                        </Picker>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Modal>
            );
        } else if (this.props.year === 'SE') {
            return(
                <Modal
                        animationType={'fade'}
                        transparent={true}
                        onRequestClose={() => this.setState({batchModalVisible: false})}
                        visible={this.state.batchModalVisible}
                    >
                        <View style={styles.popupOverlay } onPress={() => this.setState({batchModalVisible: false})}>
                            <View style={styles.popup}>
                                <View style={styles.popupContent}>
                                    <TouchableOpacity style={{marginTop: 50}} onPress={() => this.setState({batchModalVisible: false})} >
                                        <Icon name='cross' type='entypo' raised color='#FF3D00'/>
                                    </TouchableOpacity>
                                    <View style={{borderBottomWidth: 2, borderBottomColor:'#eeeeee', marginHorizontal:20}}>
                                        <Text style={styles.modalTitle}>Select Your Practical Batch</Text>
                                    </View>
                                    <View style={{marginLeft: 15, marginRight:15, marginTop: 7}}>
                                        <Picker
                                            selectedValue={this.props.batch}
                                            style={{height: 50, width: 2*Dimensions.get('window').width/3}}
                                            onValueChange={(itemValue) => {
                                                this.onBatchSelect(itemValue);
                                                this.setState({batchModalVisible: false});
                                            }}
                                            mode="dropdown">
                                            <Picker.Item label="" value="" />
                                            <Picker.Item label="E" value="E" />
                                            <Picker.Item label="F" value="F" />
                                            <Picker.Item label="G" value="G" />
                                            <Picker.Item label="H" value="H" />
                                        </Picker>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Modal>
            );
        } else if (this.props.year === 'TE') {
            return(
                <Modal
                        animationType={'fade'}
                        transparent={true}
                        onRequestClose={() => this.setState({batchModalVisible: false})}
                        visible={this.state.batchModalVisible}
                    >
                        <View style={styles.popupOverlay } onPress={() => this.setState({batchModalVisible: false})}>
                            <View style={styles.popup}>
                                <View style={styles.popupContent}>
                                    <TouchableOpacity style={{marginTop: 50}} onPress={() => this.setState({batchModalVisible: false})} >
                                        <Icon name='cross' type='entypo' raised color='#FF3D00'/>
                                    </TouchableOpacity>
                                    <View style={{borderBottomWidth: 2, borderBottomColor:'#eeeeee', marginHorizontal:20}}>
                                        <Text style={styles.modalTitle}>Select Your Practical Batch</Text>
                                    </View>
                                    <View style={{marginLeft: 15, marginRight:15, marginTop: 7}}>
                                        <Picker
                                            selectedValue={this.props.batch}
                                            style={{height: 50, width: 2*Dimensions.get('window').width/3}}
                                            onValueChange={(itemValue) => {
                                                this.onBatchSelect(itemValue);
                                                this.setState({batchModalVisible: false});
                                            }}
                                            mode="dropdown">
                                            <Picker.Item label="" value="" />
                                            <Picker.Item label="K" value="K" />
                                            <Picker.Item label="L" value="L" />
                                            <Picker.Item label="M" value="M" />
                                            <Picker.Item label="N" value="N" />
                                        </Picker>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Modal>
            );
        } else if (this.props.year === 'BE') {
            return(
                <Modal
                        animationType={'fade'}
                        transparent={true}
                        onRequestClose={() => this.setState({batchModalVisible: false})}
                        visible={this.state.batchModalVisible}
                    >
                        <View style={styles.popupOverlay } onPress={() => this.setState({batchModalVisible: false})}>
                            <View style={styles.popup}>
                                <View style={styles.popupContent}>
                                    <TouchableOpacity style={{marginTop: 50}} onPress={() => this.setState({batchModalVisible: false})} >
                                        <Icon name='cross' type='entypo' raised color='#FF3D00'/>
                                    </TouchableOpacity>
                                    <View style={{borderBottomWidth: 2, borderBottomColor:'#eeeeee', marginHorizontal:20}}>
                                        <Text style={styles.modalTitle}>Select Your Practical Batch</Text>
                                    </View>
                                    <View style={{marginLeft: 15, marginRight:15, marginTop: 7}}>
                                        <Picker
                                            selectedValue={this.props.batch}
                                            style={{height: 50, width: 2*Dimensions.get('window').width/3}}
                                            onValueChange={(itemValue) => {
                                                this.onBatchSelect(itemValue);
                                                this.setState({batchModalVisible: false});
                                            }}
                                            mode="dropdown">
                                            <Picker.Item label="" value="" />
                                            <Picker.Item label="P" value="P" />
                                            <Picker.Item label="Q" value="Q" />
                                            <Picker.Item label="R" value="R" />
                                            <Picker.Item label="S" value="S" />
                                        </Picker>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Modal>
            );
        }
    }

  render() {
    if (this.state.loading) {
      return (
        <View style={{flex:1, justifyContent: 'center' }}>
          <ActivityIndicator animating={this.state.loading} size="large" />
        </View>
      );
    }

    const { avatar, fName, lName, email } = this.state;
    return (
        <View style={styles.container}>
            <ScrollView style={styles.scroll}>
              <View style={styles.userRow}>
                <View style={styles.headerTitleView}>
                    <Text style={styles.titleViewText}>Just Little More About Yourself ...</Text>
                </View>
              </View>

              <View style={{flex:1, justifyContent: 'center' }}>
                <ActivityIndicator animating={this.state.loading} size="large" />
            </View>
                
            <View style={styles.infoTextContainer}>
                <Text style={styles.infoText}>Academic Information</Text>
            </View>

            <View>
                <ListItem
                    hideChevron
                    title="Branch"
                    rightTitle={`${this.props.branch}`}
                    rightTitleStyle={{ fontSize: 15 }}
                    onPress={() => this.onPressBranchSelectionModal()}
                    containerStyle={styles.listItemContainer}
                    leftIcon={
                        <BaseIcon
                            containerStyle={{
                            backgroundColor: '#FFADF2',
                            }}
                            icon={{
                            type: 'material',
                            name: 'call-split',
                            }}
                        />
                    }
                    rightIcon={<Chevron />}
                />
                
                <Modal
                    animationType={'fade'}
                    transparent={true}
                    onRequestClose={() => this.setState({branchModalVisible: false})}
                    visible={this.state.branchModalVisible}
                >
                    <View style={styles.popupOverlay }>
                        <View style={styles.popup}>
                            <View style={styles.popupContent}>
                            <TouchableOpacity style={{marginTop: 50}} onPress={() => this.setState({branchModalVisible: false})} >
                                <Icon name='cross' type='entypo' raised color='#FF3D00'/>
                            </TouchableOpacity>
                            <View style={{borderBottomWidth: 2, borderBottomColor:'#eeeeee', marginHorizontal:20}}>
                                <Text style={styles.modalTitle}>Select Your Branch</Text>
                            </View>
                            <View style={{marginLeft: 15, marginRight:15, marginTop: 7}}>
                                <Picker
                                    selectedValue={this.props.branch}
                                    style={{height: 50, width: 2*Dimensions.get('window').width/3}}
                                    onValueChange={(itemValue) => {
                                        this.onBranchSelect(itemValue);
                                        this.setState({branchModalVisible: false});
                                    }}
                                    mode="dropdown">
                                    <Picker.Item label="" value="" />
                                    <Picker.Item label="Computer" value="Computer" />
                                    <Picker.Item label="IT" value="IT" />
                                    <Picker.Item label="E&TC" value="E&TC" />
                                </Picker>
                            </View>
                            </View>
                        </View>
                    </View>
                </Modal>

                <ListItem
                    hideChevron
                    title="Year"
                    rightTitle={`${this.props.year}`}
                    rightTitleStyle={{ fontSize: 15 }}
                    onPress={() => this.onPressYearSelectionModal()}
                    containerStyle={styles.listItemContainer}
                    leftIcon={
                        <BaseIcon
                            containerStyle={{
                            backgroundColor: '#FAD291',
                            }}
                            icon={{
                            type: 'material',
                            name: 'format-italic',
                            }}
                        />
                    }
                    rightIcon={<Chevron />}
                />

                <Modal
                    animationType={'fade'}
                    transparent={true}
                    onRequestClose={() => this.setState({yearModalVisible: false})}
                    visible={this.state.yearModalVisible}
                >
                    <View style={styles.popupOverlay } onPress={() => this.setState({yearModalVisible: false})}>
                        <View style={styles.popup}>
                            <View style={styles.popupContent}>
                            <TouchableOpacity style={{marginTop: 50}} onPress={() => this.setState({yearModalVisible: false})} >
                                <Icon name='cross' type='entypo' raised color='#FF3D00'/>
                            </TouchableOpacity>
                            <View style={{borderBottomWidth: 2, borderBottomColor:'#eeeeee', marginHorizontal:20}}>
                                <Text style={styles.modalTitle}>Select Academic Year</Text>
                            </View>
                            <View style={{marginLeft: 15, marginRight:15, marginTop: 7}}>
                                <Picker
                                    selectedValue={this.props.year}
                                    style={{height: 50, width: 2*Dimensions.get('window').width/3}}
                                    onValueChange={(itemValue) => {
                                        this.onYearSelect(itemValue);
                                        this.setState({yearModalVisible: false});
                                    }}
                                    mode="dropdown">
                                    <Picker.Item label="" value="" />
                                    <Picker.Item label="I Year" value="FE" />
                                    <Picker.Item label="II Year" value="SE" />
                                    <Picker.Item label="III Year" value="TE" />
                                    <Picker.Item label="IV Year" value="BE" />
                                </Picker>
                            </View>
                            </View>
                        </View>
                    </View>
                </Modal>

                <ListItem
                    hideChevron
                    title="Division"
                    rightTitle={`${this.props.division}`}
                    rightTitleStyle={{ fontSize: 15 }}
                    onPress={() => this.onPressDivisionSelectionModal()}
                    containerStyle={styles.listItemContainer}
                    leftIcon={
                        <BaseIcon
                            containerStyle={{
                            backgroundColor: '#A4C8F0',
                            }}
                            icon={{
                            type: 'font-awesome',
                            name: 'columns',
                            }}
                        />
                    }
                    rightIcon={<Chevron />}
                />

                <Modal
                    animationType={'fade'}
                    transparent={true}
                    onRequestClose={() => this.setState({divisionModalVisible: false})}
                    visible={this.state.divisionModalVisible}
                >
                    <View style={styles.popupOverlay } onPress={() => this.setState({divisionModalVisible: false})}>
                        <View style={styles.popup}>
                            <View style={styles.popupContent}>
                            <TouchableOpacity style={{marginTop: 50}} onPress={() => this.setState({divisionModalVisible: false})} >
                                <Icon name='cross' type='entypo' raised color='#FF3D00'/>
                            </TouchableOpacity>
                            <View style={{borderBottomWidth: 2, borderBottomColor:'#eeeeee', marginHorizontal:20}}>
                                <Text style={styles.modalTitle}>Select Your Division</Text>
                            </View>
                            <View style={{marginLeft: 15, marginRight:15, marginTop: 7}}>
                                <Picker
                                    selectedValue={this.props.division}
                                    style={{height: 50, width: 2*Dimensions.get('window').width/3}}
                                    onValueChange={(itemValue) => {
                                        this.onDivisionSelect(itemValue);
                                        this.setState({divisionModalVisible: false});
                                    }}
                                    mode="dropdown">
                                    <Picker.Item label="" value="" />
                                    <Picker.Item label="1" value="1" />
                                    <Picker.Item label="2" value="2" />
                                    <Picker.Item label="3" value="3" />
                                    <Picker.Item label="4" value="4" />
                                    <Picker.Item label="5" value="5" />
                                    <Picker.Item label="6" value="6" />
                                    <Picker.Item label="7" value="7" />
                                    <Picker.Item label="8" value="8" />
                                    <Picker.Item label="9" value="9" />
                                    <Picker.Item label="10" value="10" />
                                    <Picker.Item label="11" value="11" />
                                </Picker>
                            </View>
                            </View>
                        </View>
                    </View>
                </Modal>

                <ListItem
                    hideChevron
                    title="Batch"
                    rightTitle={`${this.props.batch}`}
                    rightTitleStyle={{ fontSize: 15 }}
                    onPress={() => this.onPressBatchSelectionModal()}
                    containerStyle={styles.listItemContainer}
                    leftIcon={
                        <BaseIcon
                            containerStyle={{
                            backgroundColor: '#FEA8A1',
                            }}
                            icon={{
                            type: 'font-awesome',
                            name: 'sitemap',
                            }}
                        />
                    }
                    rightIcon={<Chevron />}
                />
                
                {this.renderBatchModal()}

                <TouchableOpacity 
                  style={styles.checkButton} 
                  onPress={this.proceedToEANHome.bind(this)}
                >
                    <Icon
                        raised
                        name='arrow-right'
                        type='entypo'
                        color = '#E65100'
                        style ={styles.checkButtonLayout} />
              </TouchableOpacity>                

            </View>
          </ScrollView>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    marginTop: 4,
    backgroundColor: 'transparent',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  scroll: {
    backgroundColor: 'white',
  },
  userRow: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 8,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 6,
  },
  userImage: {
    marginRight: 12,
  },
  listItemContainer: {
    height: 55,
    borderWidth: 0.5,
    borderColor: '#ECECEC',
  },
  infoText: {
    fontSize: 16,
    marginLeft: 20,
    color: 'gray',
    fontWeight: '500',
  },
  infoTextContainer: {
    marginTop: 2,
    paddingTop: 20,
    paddingBottom: 12,
    backgroundColor: '#F4F5F4',
  },
  popup: {
    backgroundColor: 'white',
    marginTop: 80,
    marginHorizontal: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#666'
  },
  popupOverlay: {
    backgroundColor: "#00000057",
    flex: 1,
    marginTop: 30,
    borderWidth: 1,
    borderColor: '#666'
  },
  popupContent: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
    height:"80%",
  },
  modalTitle:{
    fontSize:22,
    marginBottom: 4,
    alignSelf:'center',
    textAlign: 'center',
    justifyContent: 'center',
    color:"#FF3D00",
    fontWeight:'bold',
    paddingTop: 50,
  },
  checkButtonLayout: {
    marginTop: 50,
},
checkButton: {
  flexDirection: 'row', 
  justifyContent: 'space-around',
  marginTop: 30
},
headerTitleView: {
  backgroundColor: 'transparent',
  paddingLeft: 25,
  marginBottom:0,
  marginTop: 30
},
titleViewText: {
  fontSize: 30,
  fontWeight: 'bold',
  color: '#EF6C00',
  marginTop: 20,
  marginBottom: 10,
},
});

const mapStateToProps = (state) => ({
    branch: state.ean.branch,
    year: state.ean.year,
    division: state.ean.division,
    batch: state.ean.batch,
    pakkaEmail: state.sign_up.pakkaEmail,
    pakkaPassword: state.sign_up.pakkaPassword,
});

export default connect(mapStateToProps, {eanUserBranchSelect, eanUserYearSelect, eanUserDivisionSelect, eanUserBatchSelect})(AcademicDetailsPage);