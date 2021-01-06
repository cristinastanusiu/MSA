import React, {useEffect, useState} from 'react';
import {View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    RefreshControl,
    Alert,
    TouchableOpacity} from 'react-native';
import {ActionSheet}  from 'native-base';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';
import {Platform} from "react-native-web";
import * as firebase from 'firebase';
import Card from "./shared/Card";
import {AntDesign} from "@expo/vector-icons";
import axios from "axios";
import registerForPushNotifications from './shared/Notifier';

const imgName = "Cristina"

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

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();
    }, []);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getUserEvents();
        wait(2000).then(() => setRefreshing(false));
        if(rerun == false)
            setRerun(true);
        else
            setRerun(false);
    }, []);

    const getUserEvents = () => {
        axios.get('http://ec2-18-132-199-150.eu-west-2.compute.amazonaws.com:8080/getEvents/0768824072').then(res => {
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
                quality: 3,
            });
            console.log(result);
            if (!result.cancelled) {
                setImage(result.uri);
                await MediaLibrary.saveToLibraryAsync(result.uri);
            }
            await uploadImage(result.uri,imgName)
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
            quality: 3,
        });
        console.log(result);
        if (!result.cancelled) {
            setImage(result.uri);
            await uploadImage(result.uri,imgName).then(()=>
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

                        {eventsHistory.map(item => (
                            <Card>
                                <Text style={styles.title}>
                                    {item.title} {item.place}
                                </Text>
                                <Text style={styles.datetime}>{item.datetime}</Text>
                                <Text style={styles.available}>Availability: to do/{item.maxPers}</Text>
                            </Card>)
                        )}
                    <TouchableOpacity onPress={() => console.log('Successfully LOGGED OUT!')} style={styles.logoutBtn}>
                        <AntDesign name="logout" size={30} color="black" />
                    </TouchableOpacity>
                    </ScrollView>
);
}

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


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 50,
        paddingHorizontal: 20
    },
    content: {
        flex: 1,
        alignItems:'center',
        marginTop: 60,
    },
    btnAddImage: {
        marginTop:10,
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
    title: {
        fontSize: 20,
        color: '#8C625E',
        paddingLeft: 90,
        position: 'absolute',
    },
    host: {
        fontSize: 20,
        color: '#8C625E',
        position: 'absolute',
        left: 15,
        top: -28
    },
    datetime: {
        color: '#8C625E',
        fontSize: 17,
        position: 'absolute',
        left: 90,
        top: 22
    },
    available: {
        color: '#8C625E',
        fontSize: 17,
        position: 'absolute',
        left: 90,
        top: 40
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
