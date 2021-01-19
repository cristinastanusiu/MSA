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
import * as Permissions from 'expo-permissions';
import * as Contacts from 'expo-contacts';
// import {Context as ContactsContext} from '../Context/ContactsContext';
// import { Context } from "../Context/Context"


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
  // const {state: cstate, updateState} = useContext(ContactsContext);
  // const [context, setContext] = useContext(Context);
  const [contacts, setContacts] = useState([]);
  // const [agenda, setAgenda] = useState([]);

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
          console.log("found");
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
          <Text style={styles.hostnr}> {item.phone} </Text>
          <Text style={styles.hostname}> {item.contactName} </Text>
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
            <AntDesign name="adduser" size={30} color="#5E8C7F" />
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
        backgroundColor: '#FFFBFA',
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
