import React, {useContext, useEffect, useState} from 'react';
import {View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    RefreshControl,
    Alert,
    TouchableOpacity} from 'react-native';
import {ActionSheet,Root}  from 'native-base';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';
import {Platform} from "react-native-web";
import * as firebase from 'firebase';
import { Ionicons } from '@expo/vector-icons';
import Card from "./shared/Card";
import {AntDesign} from "@expo/vector-icons";
import axios from "axios";
import {Context as AuthContext} from "../Context/AuthContext";
import Toast from 'react-native-toast-message';

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
        axios.get('http://ec2-3-10-56-236.eu-west-2.compute.amazonaws.com:8080/getEvents/' + phoneNumber).then(res => {
            var key_cnt = 0;
            res.data.map(e => {e.key = key_cnt; key_cnt = key_cnt + 1;})
            setEventsHistory(res.data);
            console.log("Get user events : "+res.data);
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
                
                {eventsHistory.map(item => (
                        <Card  key={item.key}>
                            <Text style={styles2.title}>
                                {item.title} {item.place}
                            </Text>

                            <Text style={styles2.datetime}>{item.dateTime}</Text>
                            <Text style={styles2.available}>
                                Av: {item.currentPers}/{item.maxPers}</Text>
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
    content: {
        flex: 1,
        alignItems:'center',
        marginTop: 60,
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
        width: 70,
        height: 70,
        color: '#8C625E',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 100,
        backgroundColor: '#F2E0D5',
        alignSelf: 'flex-end',
        position: 'absolute',
        opacity: 1

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
    joinButton: {
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
        opacity: 1
    },
    addEventButton: {
        borderWidth: 3,
        borderColor: "#f2f2f2",
        padding: 10,
        borderRadius: 10,
        alignSelf: 'center'
    }
});


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
