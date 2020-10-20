import React, {useState} from 'react';
import {StyleSheet,
        Text,
        View,
        ScrollView,
        Image} from 'react-native';


export default class Events extends React.Component{
    render(){
    const events = [
        {host:'Cristina',title:'Lunch',datetime:'today 12 AM',key:'1',place:'Sebesel',maxPers:6,actualPers:3},
        {host:'Ana',title:'Dinner',datetime:'tomorrow',key:'2',place:'Tg Jiu',maxPers:6,actualPers:6},
        {host:'Vali',title:'Movie',datetime:'tomorrow',key:'3',place:'Tg Jiu',maxPers:6,actualPers:3},
        {host:'Mama',title:'Movie',datetime:'tomorrow',key:'4',place:'Tg Jiu',maxPers:6,actualPers:2},
        {host:'Alina',title:'Movie',datetime:'tomorrow',key:'5',place:'Tg Jiu',maxPers:8,actualPers:6},
        {host:'Gosa',title:'Movie',datetime:'tomorrow',key:'6',place:'Tg Jiu',maxPers:4,actualPers:0},
        {host:'Dori',title:'Movie',datetime:'tomorrow',key:'7',place:'Tg Jiu',maxPers:4,actualPers:0},
        {host:'Mihai',title:'Movie',datetime:'tomorrow',key:'8',place:'Tg Jiu',maxPers:4,actualPers:0},
    ];
        return(
            <View style = {styles.container}>
                <ScrollView>
                {events.map(item =>  (
                    <View key={item.key} style={styles.header}>
                        <Image
                        style={styles.userImage} 
                        source={require('../assets/default.png')}
                        /> 
                       <Text style={styles.item}>
                            {item.host} {item.title} {item.datetime}
                            </Text>
                        <Text>Max no persons: {item.maxPers}</Text>
                        <Text>Max no persons: {item.actualPers}</Text>

                    </View>
                    )
                )}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#fff',
        paddingTop:40,
        paddingHorizontal:20
    },
    header:{
        marginTop:30, //space between regions
        padding:20,
        backgroundColor:'#66CCCC'
    },
    item:{
        fontSize:18,
        color:'white',
    },
    userImage:{
        width:70,
        height:70,
        borderRadius:30,
    
    }

});
