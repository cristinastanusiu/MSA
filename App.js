import 'react-native-gesture-handler';
import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import ContactsScreen from './Components/ContactsScreen';
import Events from './Components/EventsScreen';
import ProfileScreen from "./Components/ProfileScreen";

const App = () => {
  const Tab = createMaterialTopTabNavigator();
  return (
    // <Events></Events>
    <NavigationContainer>
      <Tab.Navigator initialRouteName="Events">
          <Tab.Screen name="Profile" component={ProfileScreen} />
          <Tab.Screen name="Events" component={Events} />
          <Tab.Screen name="Contacts" component={ContactsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
