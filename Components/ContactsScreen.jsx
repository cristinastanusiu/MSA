import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  FlatList,
  ActivityIndicator
} from 'react-native';
import * as Permissions from 'expo-permissions';
import * as Contacts from 'expo-contacts';

export default function ContactsScreen () {
  const [isLoading, setIsLoading] = useState(false);
  const [contacts, setContacts] = useState([]);

  const loadContacts = async () => {
    setIsLoading(true);
    const permisson = await Permissions.askAsync(
      Permissions.CONTACTS
    );
    if(permisson.status !== 'granted')
    {
      return;
    }

    const {data} = await Contacts.getContactsAsync({
      fields:[Contacts.Fields.PhoneNumbers,
        Contacts.Fields.Emails ]
    });
    setIsLoading(false);
    setContacts(data);
  };

  useEffect(()=>{
    loadContacts()
  },[]);

  const renderItem = ({item}) => (
    <View style={{minHeight:20,padding:5}}>
        <Text style={{color:'#3C3C3A',fontWeight:'bold',fontSize:20}}>
          {item.firstName+" "}{item.lastName}
        </Text>
        <Text style={{color:'white',fontWeight:'bold'}}>
          {item.phoneNumbers && item.phoneNumbers[0] && item.phoneNumbers[0].digits ?
          (item.phoneNumbers[0].digits):null
          }
        </Text>
    </View>
  );

  return (
    <View style={{flex:1}}>
    <View style={{flex:1,marginTop:20,backgroundColor:'#FFFBFA'}}>
      {isLoading ? (
      <View style={{...StyleSheet.absoluteFill,
            alignItems:'center',
            justifyContent:'center'}}>
              <ActivityIndicator size="large" color='#2f363c'/>
        </View>) : null }
        <FlatList data={contacts}
                  keyExtractor={(item,index) => index.toString()}
                  renderItem={renderItem}
                  ListEmptyComponent={() => (
                    <View style={{flex:1,alignItems:'center',justifyContent:'center',marginTop:50}}>
                    <Text style={{color:'#888'}}>No Contacts Found</Text>
                    </View>
                  )}
                  />
    </View>
  </View>
  );
}
