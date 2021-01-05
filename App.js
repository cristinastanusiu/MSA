import React from 'react';
//import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ContactsScreen from './Components/ContactsScreen';
import Events from './Components/EventsScreen';
import {Icon} from 'react-native-elements';
import LoginScreen from './Components/LoginScreen';
import LogoutScreen from './Components/LogoutScreen';
import Tab1 from './Components/Tab1';
import {Provider as AuthProvider} from './Context/AuthContext.js';
import {Context as AuthContext} from './Context/AuthContext.js';
// import ProfileScreen from "./Components/ProfileScreen";
//
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
        name="Signup"
        component={LoginScreen}
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
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
      }}
      initialRouteName="Events">
      <Tab.Screen name="Contacts" component={ContactsScreen} />
      <Tab.Screen name="Events" component={LogoutScreen} />
      <Tab.Screen name="Profile" component={LogoutScreen} />
    </Tab.Navigator>
  );
}

const Stack = createStackNavigator();
function App() {
  const {state} = React.useContext(AuthContext);
  console.log(state);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {state.token === null ? (
          <>
            <Stack.Screen
              options={{headerShown: false}}
              name="Auth"
              component={authFlow}
            />
          </>
        ) : (
          <Stack.Screen
            options={{headerShown: false}}
            name="Home"
            component={homeFlow}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default () => {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
};
