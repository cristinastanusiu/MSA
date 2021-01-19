import React, { useState, useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ContactsScreen from './Components/ContactsScreen';
import Events from './Components/EventsScreen';
import ProfileScreen from "./Components/ProfileScreen";
import * as firebase from "firebase";
import ApiKeys from "./Components/constants/ApiKeys";
import {Icon} from 'react-native-elements';
import LoginScreen from './Components/LoginScreen';
import LogoutScreen from './Components/LogoutScreen';
import RegisterScreen from './Components/RegisterScreen';
import Tab1 from './Components/Tab1';
import {Provider as AuthProvider} from './Context/AuthContext';
import {Context as AuthContext} from './Context/AuthContext';
import Toast from 'react-native-toast-message';


const AuthStack = createStackNavigator();
function authFlow() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen
        options={{headerShown: false}}
        name="Signin"
        component={LoginScreen}
      />
      <AuthStack.Screen
        options={{headerShown: false}}
        name="Register"
        component={RegisterScreen}
      />
    </AuthStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();
function homeFlow() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          switch (route.name) {
            case 'Contacts':
              iconName = focused
                ? 'people'
                : 'people-outline';
              break;
              case 'Events':
                iconName = focused
                ? 'football'
                : 'football-outline';
                break;
              case 'Profile':
                iconName = focused
                ? 'person-circle'
                : 'person-circle-outline';
                break;

          }
          return (
            <Icon name={iconName} type="ionicon" size={size} color={color} />
          );
        },
      })}
      tabBarOptions={{
        activeTintColor: '#34495E',
        inactiveTintColor: 'gray',
      }}
      initialRouteName="Events">
      <Tab.Screen name="Contacts" component={ContactsScreen} />
      <Tab.Screen name="Events" component={Events} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const Stack = createStackNavigator();
function App() {
if(!firebase.apps.length) { firebase.initializeApp(ApiKeys.firebaseConfig)}
  const {state} = React.useContext(AuthContext);

  return (
    <>
    <NavigationContainer>
      <Stack.Navigator>
        {state.token == '200' ? (
          <Stack.Screen
            options={{headerShown: false}}
            name="Home"
            component={homeFlow}
          />
        ): (
          <>
            <Stack.Screen
              options={{headerShown: false}}
              name="Auth"
              component={authFlow}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
    <Toast ref={(ref) => Toast.setRef(ref)} />
    </>
  );
}

export default () => {
  return (
    <AuthProvider>
        <App />
    </AuthProvider>
  );
};
