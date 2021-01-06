import React, { useState, useEffect } from 'react';
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

const wait = (timeout) => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}


export default function Events() {
  const [refreshing, setRefreshing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [eventList, setEventList] = useState([]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getEvents();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const getEvents = () => {
    axios.get('http://192.168.0.175:8080/getEvents').then(res => {
      var key_cnt = 0;
      res.data.map(e => {e.key = key_cnt; key_cnt = key_cnt + 1;})
      setEventList(res.data);
      console.log(res.data);
    });
  }

  useEffect(() => {
        getEvents();
      },[])

  const addEvent = (myevent) => {
      axios.post('http://192.168.0.175:8080/addEvent/111',
      {
        dateTime: "2021-01-03 14:42:51",
        maxPers: myevent.maxPers,
        place: myevent.place,
        title: myevent.title
      }).then(res => console.log(res));
      setModalOpen(false);
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
        <Card>
          <Text style={styles.host}> to do </Text>
          <Image style={styles.userImage} source={require('../assets/default.png')}/>
          <Text style={styles.title}>
          {item.title} {item.place}
          </Text>
          <Text style={styles.datetime}>{item.datetime}</Text>
          <Text style={styles.available}>Availability: to do/{item.maxPers}</Text>
          <TouchableOpacity onPress={() => console.log('Successfully joined event!')} style={styles.joinButton}>
            <AntDesign name="adduser" size={30} color="black" />
          </TouchableOpacity>
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
        paddingLeft: 90,
        position: 'absolute',
    },
    userImage: {
        flex: 1,
        width: 70,
        height: 70,
        borderRadius: 30,
    },
    host: {
        fontSize: 20,
        color: '#8C625E',
        position: 'absolute',
        left: 15,
        top: -28
    },
    datetime: {
        color: '#8C625E',
        fontSize: 17,
        position: 'absolute',
        left: 90,
        top: 22
    },
    available: {
        color: '#8C625E',
        fontSize: 17,
        position: 'absolute',
        left: 90,
        top: 40
    },
    joinButton: {
        width: 70,
        height: 70,
        color: '#8C625E',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
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
