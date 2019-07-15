import React, { Component } from 'react'
import {Text, Linking, View, FlatList, StyleSheet, TouchableOpacity, Dimensions,Image, StatusBar} from 'react-native'
import { Icon } from 'react-native-elements';

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

const imagePath = '../../Images/Team/'

export default class Team extends Component {

    state = {
        members: [
            { 
                key:'0',
                name: 'Param Jain',
                email: 'param_jain@icloud.com',
                phone: '8668462386',
                imgUri: require('../../Images/Team/image0-min.jpeg')
            },
            { 
                key:'1',
                name: 'Amey Deshpande',
                email: 'ameyd30@gmail.com',
                phone: '7588758032',
                imgUri: require('../../Images/Team/image1-min.jpg')
            },
            { 
                key:'2',
                name: 'Yakshit Jain',
                email: 'jainyakshittwo@gmail.com',
                phone: '8087550042',
                imgUri: require('../../Images/Team/image2-min.jpg')
            },
            { 
                key:'3',
                name: 'Nitin Dhevar',
                email: 'nitin.dhanabalan@gmail.com',
                phone: '8983569006',
                imgUri: require('../../Images/Team/image3-min.jpeg')
            },
            { 
                key:'4',
                name: 'Ayush Gupta',
                email: 'ayuwork4@gmail.com',
                phone: '9028600226',
                imgUri: require('../../Images/Team/image4-min.jpeg')
            },
            { 
                key:'5',
                name: 'Parth Shah',
                email: 'parthsshah.97@gmail.com',
                phone: '8149245395',
                imgUri: require('../../Images/Team/image5-min.jpg')
            },
            { 
                key:'6',
                name: 'Tanmay Nale',
                email: 'tvnale@gmail.com',
                phone: '9969108722',
                imgUri: require('../../Images/Team/image6-min.jpeg')
            },
            { 
                key:'7',
                name: 'Ajay Kadam',
                email: 'ajaydkadam@gmail.com',
                phone: '8669286645',
                imgUri: require('../../Images/Team/image7-min.jpeg')
            },
            { 
                key:'8',
                name: 'Saumitra Kulkarni',
                email: 'kulkarnisaumitra98@gmail.com',
                phone: '7774979035',
                imgUri: require('../../Images/Team/image8-min.jpeg')
            },
        ],
    }


    renderItem = ({item}) => ( 
        <View style={styles.container1}>
        <Image source={item.imgUri} style={styles.image}/>
        <View style={styles.details}>
            <Text style={[styles.name, {marginLeft: 10}]}> {item.name} </Text>
            <View style={{flexDirection: 'row', marginLeft: 10, marginTop: 2}}>
                <Icon name='envelope-o' type='font-awesome' size={18}/>
                <TouchableOpacity onPress={() => Linking.openURL('mailto:'+item.email+'?subject=Hi There!')}>
                    <Text style={{marginLeft: 5, color:'blue'}}> {item.email} </Text>
                </TouchableOpacity>
            </View>
            <View style={{flexDirection: 'row', marginLeft: 10, marginTop: 2}}>
                <Icon name='phone' type='font-awesome' size={18}/>
                <TouchableOpacity onPress={() => {Linking.openURL(`tel:${item.phone}`)}}>
                    <Text style={{marginLeft: 5, color:'#03A9F4'}}> +91 {item.phone} </Text>
                </TouchableOpacity>
            </View>
        </View>
        
    </View>  
    )

    render() {
        return (
            <View style={styles.container}>
            <StatusBar barStyle = "dark-content" backgroundColor='#fff' hidden = {false} translucent = {true}/>
            <View style={styles.header}>
                <Icon name='arrow-left' type='font-awesome' size={22} containerStyle={{padding: 5}} onPress={() => this.props.navigation.navigate('ean_home')} />
                <Image source={require('../../../assets/icon.png')} style={styles.logo} />
                <Text style={styles.title}> TEAM BUNKSHEET</Text>
                
            </View>
            <View style={styles.list}> 
                <FlatList
                    data={this.state.members}
                    renderItem={this.renderItem}
                    keyExtractor={(item) => item.key}
                    style={{width: '96%'}}
                />
            </View>
         </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        width: width,
        alignItems: 'center',
        borderWidth: 0,
        borderColor: '#000',
        marginTop: 35,
    },

    container1:{
        flexDirection: 'row',
        marginBottom:8,
        width: '100%',
        borderWidth: 1,
        borderColor: '#f0f0f0',
        elevation: 1.5,
        padding: 10
    },

    image: {
        width: 60,
        height:60,
        marginLeft: 10
    },

    details: {
        //justifyContent: 'space-around'
    },

    name:{
        fontWeight: 'bold',
        fontSize: 16
    },

    header: {
        flexDirection: 'row',
        width: "100%",
        height: 60,
        backgroundColor: '#fff',
        marginBottom: 8,
        alignItems: 'center',
        elevation: 3,
        padding: 10
    },

    title: {
        fontWeight: 'bold',
        fontSize: 24,
        marginLeft: 5,
        color: '#FF9800'
    },

    logo: {
        width: 60,
        height: 60,
    },

    list: {
        flex:1,
        alignItems: 'center',
        // justifyContent: 'center',
        width: '100%',
        borderWidth: 0,
        borderColor: '#000',

    }
})