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
import EventCard from "./shared/EventCard";
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import AddEventForm from './AddEventForm';
import axios from 'axios';
import {Context as AuthContext} from '../Context/AuthContext';
import * as firebase from 'firebase';
import * as Permissions from 'expo-permissions';
import * as Contacts from 'expo-contacts';


const wait = (timeout) => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

var agenda = []

export default function Events() {
  const [refreshing, setRefreshing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [eventList, setEventList] = useState([]);
  const {state} = useContext(AuthContext);
  const [contacts, setContacts] = useState([]);
  const [joined, setJoined] = useState(false)

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
     getEvents();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const retrieveImage = async (imgName) => {
    const ref = await firebase.storage().ref("images/" + imgName);
    return  ref.getDownloadURL();
      }


      const loadContacts =  async() => {

        const permisson = await Permissions.askAsync(
          Permissions.CONTACTS
        );
        if(permisson.status !== 'granted')
        {
          return;
        }

        const {data} = await Contacts.getContactsAsync({
          fields:[Contacts.Fields.PhoneNumbers]
        });

        setContacts(data);

        const agendaa = data.map(contact => ({
          phone: contact.phoneNumbers[0].number,
          name: contact.name}))

        agenda = agendaa;
      };

    const isMyContact = (e) => {
      for(var i=0; i<agenda.length; i++){
        if(agenda[i].phone === e.phone){
          e.contactName=agenda[i].name;
          return true;
        }
      }
      return false;
    }



  const getEvents = async () => {
    await loadContacts();
    axios.get('http://ec2-3-10-56-236.eu-west-2.compute.amazonaws.com:8080/getEvents').then(res => {
      var key_cnt = 0;
      const filteredEvents = [];
       res.data
       .filter(isMyContact)
       .map(e => {
        e.key = key_cnt;
        key_cnt = key_cnt + 1;
         retrieveImage(e.phone)
        .then( url => {
            e.img = url;
            filteredEvents.push(e);
            setEventList(filteredEvents);
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
        maxPers: myevent.maxPers,
        currentPers: myevent.currentPers,
        place: myevent.place,
        title: myevent.title
      }).then(res => console.log(res));
      setModalOpen(false);
    }

  const joinEvent = async (myevent) => {
     axios.put('http://ec2-3-10-56-236.eu-west-2.compute.amazonaws.com:8080/joinEvent/'+ myevent.phone + '?participantPhoneNumber=' + state.phoneNumber,
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
    <TouchableOpacity onPress={() => setModalOpen(true)} style={styles.addEventButton}>
      <AntDesign name="plus" size={20} style={{marginTop:-5}} color="#EBEDEF" />
    </TouchableOpacity>
    <Modal visible={modalOpen} animationType='slide'>
      <View style={styles.modalContent}>
        <AddEventForm addEvent={addEvent} />
        <MaterialIcons name="arrow-back" size={40} color="black" style={styles.backButton} onPress={() => setModalOpen(false)}/>
      </View>
    </Modal>
    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      {eventList.map(item => (
        <Card key={item.key}>
          <EventCard joinEvent={joinEvent} item={item}>
          </EventCard>
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
        backgroundColor: '#F2F4F4',
        paddingTop: 50,
        paddingHorizontal: 20
    },
    header: {
        marginTop: 30, //space between regions
        padding: 10,
        paddingLeft: 90,
        backgroundColor: '#D9C6BF'//#66CCCC'
    },
    addEventButton: {
      width: 50,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 5,
      marginTop:620,
      marginLeft: 300,
      borderRadius: 50,
      backgroundColor: '#1B2631',
      // alignSelf: 'center',
      position: 'absolute',
      opacity: .7,
      zIndex: 2,
      borderColor: 'transparent'
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
