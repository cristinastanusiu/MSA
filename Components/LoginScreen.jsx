import React, {useState, useContext} from 'react';
import {Icon} from 'react-native-elements';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Input, Button} from 'react-native-elements';
import {Context as AuthContext} from '../Context/AuthContext';

const LoginScreen = ({navigation}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const {state, signin} = useContext(AuthContext);

  return (
    <View style={styles.master}>
      <Text style={styles.header}>Eventsy | Login</Text>
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
        title="Login"
        type="clear"
        onPress={() => {
          signin({phoneNumber, password});
        }}
      />
      <View style={styles.link}>
        <Text style={styles.text}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => {navigation.navigate('Register')}}>
          <Text style={styles.text}>Sign up here.</Text>
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

export default LoginScreen;
