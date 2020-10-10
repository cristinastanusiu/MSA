import React from 'react';
import { 
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import * as Permissions from 'expo-permissions';
import * as Contacts from 'expo-contacts';

export default class App extends React.Component {
  constructor(){
    super()
    this.state={
      isLoading:false,
      contacts:[]
    };
  }

  loadContacts = async () => {
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
    console.log(data);
    this.setState({contacts:data,inMemoryContacts:data,isLoading:false});

  };

  componentDidMount(){
    this.setState({isLoading:true});
    this.loadContacts();
  }
  
  renderItem = ({item}) => (
    <View style={{minHeight:70,padding:5}}>
        <Text style={{color:'#888',fontWeight:'bold',fontSize:26}}>
          {item.firstName+" "}{item.lastName}
        </Text>
        <Text style={{color:'white',fontWeight:'bold'}}>
          {item.phoneNumbers && item.phoneNumbers[0] && item.phoneNumbers[0].digits ?
          (item.phoneNumbers[0].digits):null
          }
        </Text>
    </View>
  );

  searchContacts = value => {
    const filteredContacts = this.state.inMemoryContacts.filter(
      contact => {
        let contactLowerCase = (contact.firstName +" " +contact.lastName).toLowerCase();
        let searchTermCase = value.toLowerCase();
        return contactLowerCase.indexOf(searchTermCase) > -1;
      }
    );
      this.setState({contacts : filteredContacts});
  };

  render(){
  return (
    <View style={{flex:1}}>
      <SafeAreaView style={{backgroundColor:'#2f363c'}} />
        <TextInput placeholder="Search" placeholderTextColor='#dddddd' 
              style={{backgroundColor:'#2f363c',
              height :50,
              fontSize:36,
              padding:10,
              color:'white',
              borderBottomWidth:0.5,
              borderBottomColor:'#7d90a0'
              }}
              onChangeText={(value) => this.searchContacts(value)}/>
    <View style={{flex:1,backgroundColor:'#2f363c'}}>
      {this.state.isLoading ? (
      <View style={{...StyleSheet.absoluteFill,
            alignItems:'center',
            justifyContent:'center'}}>
              <ActivityIndicator size="large" color='#2f363c'/>
        </View>) : null }
        <FlatList data={this.state.contacts}
                  keyExtractor={(item,index) => index.toString()}
                  renderItem={this.renderItem}
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
