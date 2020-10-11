import 'react-native-gesture-handler';
import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import ContactsScreen from './Components/ContactsScreen'
import UserProfileScreen from './Components/UserProfileScreen';
import EventsFeedScreen from './Components/EventsFeedScreen';

const App = () => {
  const Tab = createMaterialTopTabNavigator();
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="Events">
        <Tab.Screen name="Profile" component={UserProfileScreen} />
        <Tab.Screen name="Events" component={EventsFeedScreen} />
        <Tab.Screen name="Contacts" component={ContactsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;