import React from 'react';
import { View, Linking, Text, TouchableOpacity } from 'react-native';
import { Card, Icon } from 'react-native-elements';

const ROOT_URL = 'https://damp-fjord-36039.herokuapp.com/';

export default NoticeDetail = ({ notice }) => {
    const { title, nbody, timestamp, tname, filelink } = notice;

    return (
        <Card title={title} containerStyle={{borderRadius: 15, backgroundColor: '#eee'}} dividerStyle={{borderColor: '#FF5722'}}>
            <View style={{flexDirection:'row', justifyContent:'center', alignContent: 'center'}}>
                <Text style={{flex:1, borderWidth: 1, borderColor: '#eee', borderRadius: 10, marginHorizontal: 2, padding: 15}}>{nbody}</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent:'center', alignContent: 'center', marginTop: 7}}>
                <Text style={{flex: 4, borderWidth: 1, borderColor: '#eee', borderRadius: 10, marginHorizontal: 2, padding: 15, color: '#666'}}>{timestamp}</Text>
                <TouchableOpacity style={{flex:1, borderWidth: 1, borderColor: '#666', borderColor:'#FF5722', borderRadius: 30, marginHorizontal: 2, padding: 15, justifyContent: 'center', alignContent: 'center'}} onPress={()=>{ Linking.openURL(ROOT_URL+filelink)}} >
                <Icon name='file-download' size={24} type='material' color = '#FF9800'/>
                </TouchableOpacity>
                <Text style={{flex: 4, borderWidth: 1, borderColor: '#eee', borderRadius: 10, marginHorizontal: 2, padding: 15, color: '#666'}}>{tname}</Text>
            </View>
        </Card>
    );
};