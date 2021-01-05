import React from 'react';
//import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ContactsScreen from './Components/ContactsScreen';
import Events from './Components/EventsScreen';
import {Icon} from 'react-native-elements';
import LoginScreen from './Components/LoginScreen';
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
            case 'Tab1':
              iconName = focused
                ? 'ios-checkbox'
                : 'ios-checkbox-outline';
              break;
          }

          // You can return any component that you like here!
          return (
            <Icon name={iconName} type="ionicon" size={size} color={color} />
          );
        },
      })}
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
      }}>
      <Tab.Screen name="Tab1" component={Tab1} />
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

// const App = () => {
//   const Tab = createMaterialTopTabNavigator();
//   return (
//     // <Events></Events>
//     <NavigationContainer>
//       <Tab.Navigator initialRouteName="Events">
// //          <Tab.Screen name="Profile" component={ProfileScreen} />
//           <Tab.Screen name="Events" component={Events} />
//
//           <Tab.Screen name="Contacts" component={ContactsScreen} />
//       </Tab.Navigator>
//     </NavigationContainer>
//   );
// }

// export default App;
