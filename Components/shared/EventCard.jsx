import React, { useState, useEffect, useContext } from 'react';
import {StyleSheet,View, Image, Text, TouchableOpacity} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import axios from 'axios';



export default function EventCard(props){
  const [joined,setJoined] = useState(false)
  const [currentPers, setCurrentPers] = useState(props.item.currentPers)

  const getParticipants = (event) => {
    const exist = false;
      const resp = axios.get('http://ec2-3-10-56-236.eu-west-2.compute.amazonaws.com:8080/getParticipants/' + event.id)
          .then((res) => setJoined(res.data.some(user => user.phoneNumber === event.phone)));
  };

  useEffect(() => {
        getParticipants(props.item);
      },[])

    return (<>
      <View>
          {!props.item.img && <Image source={require('../../assets/default.png')} style={styles.userImage} />}
          {props.item.img && <Image source={{ uri: props.item.img }} style={styles.userImage} />}
      </View>
      <Text style={styles.hostnr}> {props.item.phone} </Text>
      <Text style={styles.hostname}> {props.item.contactName} </Text>
      <Text style={styles.title}>{props.item.title}</Text>
      <Text style={styles.place}>{props.item.place}</Text>
      <Text style={styles.datetime}>{props.item.dateTime}</Text>
      <Text style={styles.available}>{currentPers}/{props.item.maxPers} joined</Text>

      { currentPers < props.item.maxPers && !joined &&
      <TouchableOpacity onPress={() => {
        setCurrentPers(currentPers+1)
        props.joinEvent(props.item);
        setJoined(true)
        Toast.show({
        text1: 'Great!',
        text2: 'You joined the party.' +'🍷'
      });}
      } style={styles.joinButton}>
        <AntDesign name="adduser" size={30} color="#5E8C7F" />
      </TouchableOpacity>
    }</>
    )
}

const styles = StyleSheet.create({
  title: {
      fontSize: 18,
      color: '#618777',
      paddingLeft: 90,
      position: 'absolute',
      marginTop:-45,
  },
  place: {
    fontSize: 12,
    color: '#8C625E',
    paddingLeft: 90,
    position: 'absolute',
    marginTop:20,
},
  userImage: {
      flex: 1,
      width: 80,
      height: 80,
      marginTop:-20,
      borderRadius:50,
  },
  hostnr: {
      marginTop: 5,
      fontSize: 12,
      color: '#618777',
      position: 'absolute',
      paddingLeft: 87,
  },
  hostname: {
      marginTop: -20,
      fontSize: 18,
      color: '#618777',
      position: 'absolute',
      paddingLeft: 87,
  },
  datetime: {
      color: '#8C625E',
      fontSize: 12,
      paddingLeft: 90,
      position: 'absolute',
      marginTop:35,
  },
  available: {
      color: '#8C625E',
      fontSize: 12,
      position: 'absolute',
      paddingLeft:90,
      marginTop:50,
  },
  joinButton: {
      width: 70,
      height: 70,
      color: '#8C625E',
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 5,
      marginTop:-14,
      marginLeft:10,
      borderRadius: 100,
      backgroundColor: '#FDEFDA',
      alignSelf: 'flex-end',
      position: 'absolute',
      opacity: 1
  }
});
