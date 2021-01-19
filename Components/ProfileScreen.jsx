import React, {useContext, useEffect, useState} from 'react';
import {View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    RefreshControl,
    Alert,
    Modal,
    TouchableOpacity,
    TouchableHighlight} from 'react-native';
import {ActionSheet,Root,Container, Header, Content, Accordion}  from 'native-base';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';
import {Platform} from "react-native-web";
import * as firebase from 'firebase';
import Card from "./shared/Card";
import {Entypo,AntDesign,Ionicons,MaterialIcons} from "@expo/vector-icons";
import Toast from 'react-native-toast-message';
import axios from "axios";
import {Context as AuthContext} from "../Context/AuthContext";
import EventHistory from './EventHistory';


const wait = (timeout) => {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
}

const uploadImage = async (uri,imgName) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    let ref = firebase.storage().ref().child('images/' + imgName);
    return ref.put(blob);
}


export default function ProfileScreen() {
    const [refreshing, setRefreshing] = useState(false);
    const [rerun, setRerun] = useState(false);
    const [image, setImage] = useState(null);
    const [eventsHistory, setEventsHistory] = useState([]);
    const {state, signout} = useContext(AuthContext);
    const [expanded,setExpanded] = useState(false);
    const [participants,setParticipants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [displayParts, setdisplayParts] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [onEventHistory,setOnEventHistory] = useState();

    const phoneNumber = state.phoneNumber;

    const retrieveImage = async (imgName) => {
        const ref = await firebase.storage().ref("images/" + imgName);
        return  ref.getDownloadURL();
        }

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }

            }
            getUserEvents(phoneNumber);
            retrieveImage(phoneNumber)
                .then( url => {
                    setImage(url);
                    console.log("Profile screen1 url : " + url);
                });
        
        })();
    }, []);

    useEffect(() => {
        if(expanded){
            if(participants.length > 0) {
                setdisplayParts(true);
                // const parts = participants.map(p =>  p.firstName + " " + p.lastName)
                // console.log("Participants : " + parts) ;
                
                // Toast.show({
                //     text1: 'Your mates ' + '👇🏻',
                //     text2: parts +'🤘🏻'
                //   });
                }
            else{
                setdisplayParts(false);

                console.log("No participants!")
                    Alert.alert(
                    'Ops ' + '🤔',
                    'No participants yet' +'⏳'
                  );            
            }
    }}, [loading])

    const getParticipants = (event) => {
        const resp = axios.get('http://ec2-3-10-56-236.eu-west-2.compute.amazonaws.com:8080/getParticipants/' + event.id)
            .then((res) =>res.data );
            // console.log("Participants are");
            // console.log(resp);
            return resp;
            };

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getUserEvents(phoneNumber);
        retrieveImage(phoneNumber)
        .then( url => {
            setImage(url);
            console.log("Profile screen2 url : " + url);

        });
        wait(2000).then(() => setRefreshing(false));
        if(rerun == false)
            setRerun(true);
        else
            setRerun(false);
    }, []);

    const getUserEvents = (phoneNumber) => {
        axios.get('http://ec2-3-10-56-236.eu-west-2.compute.amazonaws.com:8080/getEvents/' + phoneNumber)
        .then(res => {
            var key_cnt = 0;
            res.data.map(e => {
              e.key = key_cnt; key_cnt = key_cnt + 1;
            })
            setEventsHistory(res.data);
            console.log("Get user events : ");
            console.log(res.data);
        });
    }
        const takePhotoFromCamera = async () => {
        let result = await ImagePicker.launchCameraAsync({
                allowsEditing: false,
                aspect: [4, 3],
                maxWidth: 150,
                maxHeight: 150,
                quality: 1,
            });
            console.log(result);
            if (!result.cancelled) {
                setImage(result.uri);
                await MediaLibrary.saveToLibraryAsync(result.uri);
            }
            await uploadImage(result.uri,phoneNumber)
                .then(()=>
            {
                Alert.alert(
                    "Done!",
                    "Your profile picture has been updated successfully");
            });
            return;
        console.log('Camera or Camera Roll perimission denied!');
    };

    const choosePhotoFromLibrary = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            maxWidth: 150,
            maxHeight: 150,
            aspect: [4, 3],
            quality: 1,
        });
        console.log(result);
        if (!result.cancelled) {
            setImage(result.uri);
            await uploadImage(result.uri,phoneNumber).then(()=>
            {
                Alert.alert(
                    "Done!",
                    "Your profile picture has been updated successfully");
            });
        }

    };

    const ClickAddImage = async () => {
        const response1 = await Permissions.askAsync(Permissions.CAMERA);
        const response2 = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        if (response1.granted & response2.granted) {

            const BUTTONS = ['Take Photo', 'Choose Photo Library', 'Cancel'];
            ActionSheet.show(
                {options: BUTTONS, cancelButtonIndex: 2, title: 'Select a Photo'},
                (buttonIndex) => {
                    switch (buttonIndex) {
                        case 0:
                            console.log("Clicked 0 on button Index" + buttonIndex);
                            takePhotoFromCamera();
                            break;
                        case 1:
                            console.log("Clicked 1  on button Index" + buttonIndex);
                            choosePhotoFromLibrary();
                            break;
                        default:
                            break;

                    }
                }
            )
        }
    };


    return (
        <Root>
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }>
                <View style={styles.content} >
                    {!image && <Image source={require('../assets/default.png')} style={styles.itemImage} />}
                    {image && <Image source={{ uri: image }} style={styles.itemImage} />}
                    <TouchableOpacity onPress={ClickAddImage} style = {styles.btnAddImage}>
                        <Text style = {styles.txtBtn}>Edit Profile Picture</Text>
                    </TouchableOpacity>
                </View>
                <View>
                </View>

                <View style={styles2.container}>
                {eventsHistory.map((item,i) => (

                    <Card  key={item.key}>
                    <Text style={styles2.title}>
                    {item.title} {item.place}
                    </Text>

                    <Text style={styles2.datetime}>{item.dateTime}</Text>
                    <Text style={styles2.available}>
                        Av: {item.currentPers}/{item.maxPers}</Text>
                
                    
                    <Entypo name="info"
                            size={30}
                            color="black"
                            style={styles.infoBtn}
                            onPress={() => {
                                setModalOpen(true); 
                                console.log(item);
                                setOnEventHistory(item);
                                console.log(onEventHistory);
                            }}
                    />

                   {onEventHistory && <Modal visible={modalOpen} animationType='fade'>
                        <View style={styles.modalContent}>
                                <Card  key={onEventHistory.key}>
                                    <Text style={styles2.title}>
                                    {onEventHistory.title} {onEventHistory.place}
                                    </Text>

                                    <Text style={styles2.datetime}>{onEventHistory.dateTime}</Text>
                                    <Text style={styles2.available}>
                                        Av: {onEventHistory.currentPers}/{onEventHistory.maxPers}</Text>

                                        {displayParts  && 
                                            <Card style={{paddingTop:20}} key={i} ><View style={{alignItems:'center',alignSelf:'center', marginTop:-20,}}>
                                                {participants.map(p => (
                                                    <Text style={styles.participant}>{p.firstName} {p.lastName} </Text>)
                                                        )
                                                        }</View></Card>}
                                
                                     <TouchableHighlight 
                                            style={styles.displayParts} 
                                            onPress={() => {
                                                getParticipants(onEventHistory).then((res) =>{
                                                    setExpanded(true);
                                                    setParticipants(res);
                                                    console.log(participants);
                                                    setLoading(!loading);
                                                    })
                                            }
                                        }
                                            underlayColor="#f1f1f1">
                                        <View >
                                            <Ionicons name="people" size={35} color="black" />
                                        </View>
                                        </TouchableHighlight>
                                        
                                        <TouchableHighlight 
                                        style={styles.deleteEvent} 
                                        onPress={() => {
                                                console.log("Event deleted!");
                                                Alert.alert(
                                                            'Really?! ' +'😳',
                                                            'Your event has been successfully deleted!' 
                                                        );      }}>
                                            <MaterialIcons name="delete" size={30} color="black" />
                                        </TouchableHighlight >
                                        </Card>

                          <MaterialIcons name="arrow-back" size={40} color="black" style={styles.backButton} 
                          onPress={() => {
                              setParticipants([]);
                              setModalOpen(false);
                              setdisplayParts(false);}}/>
                        </View>
                    </Modal> }
                            
                </Card>)
                )}
                </View>

                <TouchableOpacity onPress={signout} style={styles.logoutBtn}>
                    <AntDesign name="logout" size={30} color="black" />
                </TouchableOpacity>
                    </ScrollView>
        </Root>
);
}

const styles = StyleSheet.create({
    modalContent: {
        flex: 1,
        marginTop:150,
    },
    participant:{
        fontSize: 15,
        color: '#8C625E',
        paddingLeft: 20,
    },
    content: {
        flex: 1,
        alignItems:'center',
        marginTop: 60,
    },
    expandIcon:{
        height: 20,
        width: 20 ,
        padding:20,
        borderRadius:50,
    },
    btnAddImage: {
        marginTop:5,
        marginBottom:10,
        backgroundColor: "#8C625E",
        height:50,
        width: 180,
        borderRadius: 15,
        alignItems:'center',
        justifyContent:'center'
        },
    txtBtn:{
        color:'#ffffff',
    },
    itemImage:{
        height: 150,
        width: 150 ,
        borderRadius: 60,
        marginTop: 0,
        resizeMode:'contain'
    },
    logoutBtn: {
        width: 80,
        height: 80,
        color: '#8C625E',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 100,
        backgroundColor: '#F2E0D5',
        alignSelf: 'flex-end',
        position: 'absolute',
        opacity: 1
    },
    infoBtn: {
        backgroundColor: '#F2E0D5',
        borderRadius: 100,
        width:60,
        height:60,
        padding: 5,
        alignSelf: 'flex-end',
        position: 'absolute',
        paddingLeft:13,
        paddingTop:10,
    }, 
    displayParts: {
        width: 50,
        height: 50,
        color: '#8C625E',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 1,
        borderRadius: 100,
        backgroundColor: '#F2E0D5',
        alignSelf: 'flex-end',
        position: 'absolute',
        opacity: 1,
        marginLeft:13,
        marginTop:-35,
    },
    deleteEvent:{
        width: 50,
        height: 50,
        color: '#8C625E',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 1,
        borderRadius: 100,
        backgroundColor: '#F2E0D5',
        alignSelf: 'flex-end',
        position: 'absolute',
        opacity: 1,
        marginLeft:13,
        marginTop:20,
    }
});



const styles2 = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 30,
        paddingHorizontal: 20
    },
    header: {
        marginTop: 30, //space between regions
        padding: 10,
        paddingLeft: 90,
        backgroundColor: '#D9C6BF'//#66CCCC'
    },
    title: {
        fontSize: 20,
        color: '#8C625E',
        paddingLeft: 20,
        marginTop:-30,
    },
    datetime: {
        color: '#8C625E',
        fontSize: 17,
        left: 20,
    },
    available: {
        color: '#8C625E',
        fontSize: 17,
        left: 20,
        marginTop:0,
    },
   
    addEventButton: {
        borderWidth: 3,
        borderColor: "#f2f2f2",
        padding: 10,
        borderRadius: 10,
        alignSelf: 'center'
    }
});


{/* 
                    {displayParts  && <View>
                                {participants.map(p => (
                                     <Text style={styles.participant}>{p.firstName} {p.lastName}</Text>                        )
                                                 )
                                        }</View> } */}
                          {/* <TouchableHighlight 
                                style={styles.displayParts} 
                                onPress={() => {
                                    getParticipants(item).then((res) =>{
                                        setExpanded(true);
                                        setParticipants(res);
                                        console.log(participants);
                                        setLoading(!loading);
                                        })
                                }
                            }
                                underlayColor="#f1f1f1">
                            <View >
                                <Image source={ require('../assets/participants.png') } style={styles.expandIcon}></Image>
                            </View>
                            </TouchableHighlight> */}
                            


//get image from firebase

// const retrieveImage = async (imgName) => {
//     const ref = firebase.storage().ref("images/" + imgName);
//     return ref.getDownloadURL();
// }
// const [retrImage, setRetrImage] = useState(null);
//
// retrieveImage(imgName)
//     .then(url => {
//         console.log("URL is " + url);
//         setRetrImage(url);
//     })
//     .catch((err) => {
//         console.log("File" +imgName+ " not found in firebase " +err );
//     });


    // {eventsHistory.map(item => (

    //     <Card  key={item.key}>
    //      <Text style={styles2.title}>
    //      {item.title} {item.place}
    //      </Text>

    //         <Text style={styles2.datetime}>{item.dateTime}</Text>
    //         <Text style={styles2.available}>
    //             Av: {item.currentPers}/{item.maxPers}</Text>

    //             {expanded  && <FlatList data={getParticipants(item).then((res)=>{
                                    // return res;
    //                        })}} }


    //             <TouchableHighlight 
    //                     style={styles.displayParts} 
    //                     onPress={() => {
    //                         getParticipants(item).then((res)=>{
    //                             console.log(res);
    //                             setParticipants(res);
    //                             setExpanded(!expanded);
    //                        })}
    //                      }
    //                     underlayColor="#f1f1f1">
    //                 <View >
    //                     {expanded && <Image source={icons['up']} style={styles.expandIcon2}></Image>}
    //                     {!expanded && <Image source={icons['down']} style={styles.expandIcon}></Image> }
    //                 </View>
    //                 </TouchableHighlight>
    //     </Card>)
    //     )}
    // </View>

    
    //             {expanded  && <View>
    //                 {participants.map(p => (
    //                         <Text style={styles.participant}>{p.firstName} {p.lastName}</Text>                        )
    //                                 )
    //                     }</View> }
    //             <TouchableHighlight 
    //                     style={styles.displayParts} 
    //                     onPress={() => {
    //                         getParticipants(item).then((res)=>{
    //                             console.log(res);
    //                             setParticipants(res);
    //                             setExpanded(!expanded);
    //                        })}
    //                      }
    //                     underlayColor="#f1f1f1">
    //                 <View >
    //                     {expanded && <Image source={icons['up']} style={styles.expandIcon2}></Image>}
    //                     {!expanded && <Image source={icons['down']} style={styles.expandIcon}></Image> }
    //                 </View>
    //                 </TouchableHighlight>
    //     </Card>)
    //     )}
    // </View>

    // <FlatList
    // data={getParticipants(item).then((res) => {res.data})}
    // keyExtractor={(item,index) => index.toString()}
    // renderItem={renderItem}
    // />}