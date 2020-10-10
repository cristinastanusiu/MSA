import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import * as Contacts from 'expo-contacts';
import {useState }from "react";
import {  FlatList } from 'react-native';
import RNSimData from 'react-native-sim-data'

export default function App() {
  const [data, setData] = useState([]);
  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync();
        if (data.length > 0) {
          setData(data);
          //console.log(ata);
          console.log(JSON.stringify(RNSimData.getSimInfo()));
        }
      }
    })();
  }, []);

  return (
    <View style={{ flex: 1, padding: 24 }}>
        <FlatList
          data={data}
          keyExtractor={({ id }, index) => id}
          renderItem={({ item }) => (
            <Text>{item.name} [{item.phoneNumbers[0].number}]</Text>
          )}
        />
    </View>
  );
}
