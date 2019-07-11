import React from 'react'
import {View, Text, StyleSheet, Image} from 'react-native'

export default Member = (props) => {
    console.log(props.item.imgUri)

    return (
        <View style={styles.container}>
            <Image source={require('../../src/Images/Team/image1.jpg')} style={styles.image}/>
            <View style={styles.details}>
                <Text style={styles.name}> {props.item.name} </Text>
                <Text> {props.item.email} </Text>
            </View>
            
        </View>
    )
}


const styles = StyleSheet.create({
    container:{
        flexDirection: 'row',
        marginBottom:8,
        width: '100%',
        borderWidth: 1,
        borderColor: '#f0f0f0',
        elevation: 1.5,
    },

    image: {
        width: 60,
        height:60,
    },

    details: {
        justifyContent: 'space-around'
    },

    name:{
        fontWeight: 'bold'
    }
})


const styles1 = StyleSheet.create({
    container:{
        flex:1,
        alignItems: 'center',
        marginBottom:12,
        borderWidth: 1,
        borderColor: '#f0f0f0',
        elevation: 2,
        width: '100%',

    },

    image: {
        width: '100%',
        height: 300,
    },
    
    details: {
        width: '100%',
        justifyContent: 'space-between',
        marginBottom: 4,
        marginTop: 4,
        flexDirection: 'row'
    },

    name:{
        fontWeight: 'bold',
        fontSize: 16,
    },
})