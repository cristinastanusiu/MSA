import React, {useState} from 'react';
import {StyleSheet,
        Text,
        View,
        ScrollView,
        Image,
        TouchableOpacity,
        Modal} from 'react-native';
import Card from "./shared/Card";
import { AntDesign } from '@expo/vector-icons'; 
import { Entypo } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons'; 
import AddEventForm from './AddEventForm'; 


export default function Events(){ 

    const [modalOpen,setModalOpen] = useState(false);    
    const [events,setEvents] = useState([
        {host:'Cristina',title:'Lunch',datetime:'today 12 AM',key:'1',place:'Sebesel',maxPers:6,actualPers:3},
        {host:'Ana',title:'Dinner',datetime:'tomorrow',key:'2',place:'Tg Jiu',maxPers:6,actualPers:6},
        {host:'Vali',title:'Movie',datetime:'tomorrow',key:'3',place:'Tg Jiu',maxPers:6,actualPers:3},
        {host:'Mama',title:'Movie',datetime:'tomorrow',key:'4',place:'Tg Jiu',maxPers:6,actualPers:2},
        {host:'Alina',title:'Movie',datetime:'tomorrow',key:'5',place:'Tg Jiu',maxPers:8,actualPers:6},
        {host:'Gosa',title:'Movie',datetime:'tomorrow',key:'6',place:'Tg Jiu',maxPers:4,actualPers:0},
        {host:'Dori',title:'Movie',datetime:'tomorrow',key:'7',place:'Tg Jiu',maxPers:4,actualPers:0},
        {host:'Mihai',title:'Movie',datetime:'tomorrow',key:'8',place:'Tg Jiu',maxPers:4,actualPers:0},
    ]);

    const addEvent = (myevent) => {
        myevent.key = events.length + 1;//create key
        setEvents((currentEvents) => {
            return [myevent, ...currentEvents]
        });
        setModalOpen(false);
    }
        return(
            <View style = {styles.container}>
                <Entypo name="add-to-list"
                        size={30}
                        color="black"
                        style={styles.addEventButton}
                        onPress={() => setModalOpen(true)}
                        />
                
                <Modal visible={modalOpen} animationType='slide'>
                    <View style={styles.modalContent}>
                        <AddEventForm addEvent={addEvent}/>
                        <MaterialIcons name="arrow-back"
                                        size={40} 
                                        color="black"
                                        style={styles.backButton}
                                        onPress={() => setModalOpen(false)}
                                        />
                    </View>
                </Modal>
                <ScrollView>
                {events.map(item =>  (
                    <Card key={item.key}>
                    <Text style={styles.host}>{item.host}</Text>
                        <Image
                        style={styles.userImage} 
                        source={require('../assets/default.png')}
                        /> 
                       <Text style={styles.title}>
                        {item.title} {item.place}
                            </Text>
                        <Text style={styles.datetime}>{item.datetime}</Text>
                        <Text style={styles.available}>Availability: {item.actualPers}/{item.maxPers}</Text>
                        <TouchableOpacity 
                            key = {item.key}
                            onPress={() => console.log('Successfully join to %s event!', item.host)}
                            style={styles.joinButton}>
                            <AntDesign name="adduser" size={30} color="black" />
                        </TouchableOpacity>
                    </Card>
                    )
                )}
                </ScrollView>
            </View>
        );
    }

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#fff',
        paddingTop:50,
        paddingHorizontal:20

    },
    header:{
        marginTop:30, //space between regions
        padding:10,
        paddingLeft:90,
        backgroundColor: '#D9C6BF'//#66CCCC'
    },
    title:{
        fontSize:20,
        color:'#8C625E',
        paddingLeft:90,
        position:'absolute',
    },
    userImage:{
        flex:1,
        // position:'absolute',
        width:70,
        height:70,
        borderRadius:30,
    },
    host:{
        fontSize:20,
        // textAlign: 'center',
        color:'#8C625E',
        position:'absolute',
        // alignContent:'center',
        left:15,
        top:-28
    },
    datetime:{
        color:'#8C625E',
        fontSize:17,
        position:'absolute',
        left:90,
        top:22
    },
    available:{
        color:'#8C625E',
        fontSize:17,
        position:'absolute',
        left:90,
        top:40
    },
    joinButton:{
        width: 70,
        height: 70,
        color:'#8C625E',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 100,
        backgroundColor: '#F2E0D5',
        alignSelf: 'flex-end',
        position:'absolute',      
        opacity:1  
    },
    addEventButton:{
        borderWidth:3,
        borderColor:"#f2f2f2",
        padding:10,
        borderRadius:10,
        alignSelf:'center'
    },
    backButton:{
        borderWidth:3,
        borderColor:"#f2f2f2",
        marginTop:50,
        marginLeft:10,
        borderRadius:10,
        position:'absolute'
    },
    modalContent:{
        flex:1
    }

});
