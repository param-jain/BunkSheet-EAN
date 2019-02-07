import React, { Component } from 'react'
import { ScrollView, Switch, StyleSheet, Text, View, Dimensions } from 'react-native'
import { Avatar, ListItem } from 'react-native-elements'
import PropTypes from 'prop-types'

import BaseIcon from '../../Styles/Icon'
import Chevron from '../../Styles/Chevron'

import Amplify, { Auth } from 'aws-amplify';
import awsConfig from '../../Sensitive_Info/aws-exports';
Amplify.configure({ Auth: awsConfig });

class User_Profile extends React.Component {

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
            data:[],
            error: '',
            bookSelected: [],
            userRegID: 'E2K1610000',
            fName: 'Param',
            lName: 'Jain',
            email: 'param@bunksheet.com'
        }
        this.arrayHolder = [];
    }

    componentDidMount(){
        Auth.currentAuthenticatedUser({
          bypassCache: true  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
        }).then(user => {
          this.setState({
            userRegID: `${user.attributes["custom:college_reg_id"]}`,
            fName: `${user.attributes["name"]}`,
            lName: `${user.attributes["family_name"]}`,
            email: `${user.attributes["email"]}`
          });
        console.log("Issuance Page User Attributes: "+user.attributes);
      });
    }

    static propTypes = {
        avatar: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        navigation: PropTypes.object.isRequired,
        email: PropTypes.string.isRequired
      }

  render() {
    const { avatar, fName, lName, email } = this.state;
    return (
        <View style={styles.container}>
            <ScrollView style={styles.scroll}>
                <View style={styles.userRow}>
                    <View style={styles.userImage}>
                        <Avatar
                        rounded
                        size="large"
                        source={{
                            uri: avatar,
                        }}
                        />
                    </View>
                    <View>
                        <View style={{flexDirection:'row'}}>
                            <Text style={{ fontSize: 16 }}>{fName} </Text>
                            <Text style={{ fontSize: 16 }}>{lName}</Text>
                        </View>
                        <Text
                        style={{
                            color: 'gray',
                            fontSize: 16,
                        }}
                        >
                        {email}
                        </Text>
                    </View>
                </View>
                
                <View style={styles.infoTextContainer}>
                    <Text style={styles.infoText}>Academic Information</Text>
                </View>

                <View>
                <ListItem
                    hideChevron
                    title="Branch"
                    rightTitle="E&TC"
                    containerStyle={styles.listItemContainer}
                    leftIcon={
                        <BaseIcon
                            containerStyle={{
                            backgroundColor: '#FFADF2',
                            }}
                            icon={{
                            type: 'material',
                            name: 'notifications',
                            }}
                        />
                    }
                    rightIcon={<Chevron />}
                />
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
});

export default (User_Profile);