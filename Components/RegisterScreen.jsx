import React, {useState, useContext} from 'react';
import {Icon} from 'react-native-elements';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Input, Button} from 'react-native-elements';
import {Context as AuthContext} from '../Context/AuthContext';

const RegisterScreen = ({navigation}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const {state, signup} = useContext(AuthContext);

  return (
    <View style={styles.master}>
      <Text style={styles.header}>Eventsy | Register</Text>
      <Input
        placeholder="First Name"
        onChangeText={setFirstName}
        value={firstName}
        leftIcon={<Icon name="user" type="font-awesome" size={24} />}
      />
      <Input
        placeholder="Last Name"
        onChangeText={setLastName}
        value={lastName}
        leftIcon={<Icon name="users" type="font-awesome" size={24} />}
      />
      <Input
        placeholder="Phone Number"
        onChangeText={setPhoneNumber}
        value={phoneNumber}
        leftIcon={<Icon name="phone" type="font-awesome" size={24} />}
      />
      <Input
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        leftIcon={<Icon name="key" type="font-awesome" size={24} />}
        secureTextEntry
      />
      <Button
        title="Signup"
        type="clear"
        onPress={() => {
          signup({phoneNumber, password, firstName, lastName});
        }}
      />
      <View style={styles.link}>
        <Text style={styles.text}>Already have an account? </Text>
        <TouchableOpacity onPress={() => {navigation.navigate('Signin')}}>
          <Text style={styles.text}>Login here.</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  master: {
    padding: 16,
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  header: {
    fontSize: 32,
    marginBottom: 18,
    alignSelf: 'center',
  },
  text: {
    fontSize: 16,
    marginTop: 16,
  },
  link: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default RegisterScreen;
