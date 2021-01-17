import React, { useState, useEffect, useContext } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
    TouchableOpacity,
    Modal,
    RefreshControl
} from 'react-native';
import Card from "./shared/Card";
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import AddEventForm from './AddEventForm';
import axios from 'axios';
import {Context as AuthContext} from '../Context/AuthContext';
import Toast from 'react-native-toast-message';
import * as firebase from 'firebase';

const wait = (timeout) => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}


export default function Events() {
  const [refreshing, setRefreshing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [eventList, setEventList] = useState([]);
  const {state} = useContext(AuthContext);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
     getEvents();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const retrieveImage = async (imgName) => {
    const ref = await firebase.storage().ref("images/" + imgName);
    return  ref.getDownloadURL();
      }

  const getEvents = () => {
    axios.get('http://ec2-3-10-56-236.eu-west-2.compute.amazonaws.com:8080/getEvents').then(res => {
      var key_cnt = 0;
       res.data.map(e => {
        e.key = key_cnt; 
        key_cnt = key_cnt + 1;
         retrieveImage(e.phone)
        .then( url => {
            console.log("URL is " + url);
            e.img = url;
            setEventList(res.data);
            console.log(res.data);  

        })
        .catch(() => {
          e.img = '';
          console.log("img not found");
        });
      });
     
    })
  }

  useEffect(() => { 
        getEvents();
      },[])

  const addEvent = (myevent) => {
      axios.post('http://ec2-3-10-56-236.eu-west-2.compute.amazonaws.com:8080/addEvent/' + state.phoneNumber,
      {
        dateTime: myevent.datetime,
        // dateTime: "2021-01-03 14:42:51",
        maxPers: myevent.maxPers,
        currentPers: myevent.currentPers,
        place: myevent.place,
        title: myevent.title
      }).then(res => console.log(res));
      setModalOpen(false);
    }

  const joinEvent = async (myevent) => {
     axios.put('http://ec2-3-10-56-236.eu-west-2.compute.amazonaws.com:8080/joinEvent/'+ myevent.phone,
    {
      id: myevent.id,
      dateTime: "2021-01-03 14:42:51",
      maxPers: myevent.maxPers,
      currentPers:  myevent.currentPers + 1,
      place: myevent.place,
      title: myevent.title
    }).then(res => console.log(res));
  }


  return (
  <View style={styles.container}>
    <Entypo name="add-to-list"
            size={30}
            color="black"
            style={styles.addEventButton}
            onPress={() => setModalOpen(true)}
    />
    <Modal visible={modalOpen} animationType='slide'>
      <View style={styles.modalContent}>
        <AddEventForm addEvent={addEvent} />
        <MaterialIcons name="arrow-back" size={40} color="black" style={styles.backButton} onPress={() => setModalOpen(false)}/>
      </View>
    </Modal>
    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      {eventList.map(item => (

        <Card key={item.key}>

          <View>
              {!item.img && <Image source={require('../assets/default.png')} style={styles.userImage} />}
              {item.img && <Image source={{ uri: item.img }} style={styles.userImage} />}
          </View>
          {/* TO DO - hostName from contact list */}
          <Text style={styles.host}> {item.phone} </Text>

          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.place}>{item.place}</Text>
          <Text style={styles.datetime}>{item.dateTime}</Text>
          <Text style={styles.available}>{item.currentPers}/{item.maxPers} joined</Text>

          { item.currentPers < item.maxPers &&
          <TouchableOpacity onPress={() => {
            joinEvent(item);
            Toast.show({
            text1: 'Great!',
            text2: 'You joined the party.' +'🍷'
          });}
          } style={styles.joinButton}>
            <AntDesign name="adduser" size={30} color="black" />
          </TouchableOpacity>
        }  

       </Card>)
      )
    }
  </ScrollView>
</View>
);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 50,
        paddingHorizontal: 20
    },
    header: {
        marginTop: 30, //space between regions
        padding: 10,
        paddingLeft: 90,
        backgroundColor: '#D9C6BF'//#66CCCC'
    },
    title: {
        fontSize: 20,
        color: '#8C625E',
        paddingLeft: 80,
        position: 'absolute',
        marginTop:-35,
    },
    place: {
      fontSize: 15,
      color: '#8C625E',
      paddingLeft: 80,
      position: 'absolute',
      marginTop:-7,
  },
    userImage: {
        flex: 1,
        width: 70,
        height: 70,
        marginTop:-20,
        borderRadius:15,
    },
    host: {
        fontSize: 17,
        color: '#8C625E',
        position: 'absolute',
        left: -5,
        top: -44
    },
    datetime: {
        color: '#8C625E',
        fontSize: 12,
        paddingLeft: 80,
        position: 'absolute',
        marginTop:12,
        top:3,
    },
    available: {
        color: '#8C625E',
        fontSize: 10,
        position: 'absolute',
        paddingLeft:80,
        marginTop:10,
        top: 20
    },
    joinButton: {
        width: 70,
        height: 70,
        color: '#8C625E',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 5,
        marginTop:-24,
        marginLeft:10,
        borderRadius: 100,
        backgroundColor: '#F2E0D5',
        alignSelf: 'flex-end',
        position: 'absolute',
        opacity: 1
    },
    addEventButton: {
        borderWidth: 3,
        borderColor: "#f2f2f2",
        padding: 10,
        borderRadius: 10,
        alignSelf: 'center'
    },
    backButton: {
        borderWidth: 3,
        borderColor: "#f2f2f2",
        marginTop: 50,
        marginLeft: 10,
        borderRadius: 10,
        position: 'absolute'
    },
    modalContent: {
        flex: 1
    }

});
