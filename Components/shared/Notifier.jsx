import * as firebase from 'firebase';
import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications';
import ApiKeys from "../constants/ApiKeys";
import {useContext} from "react";
import {Context as AuthContext} from "../../Context/AuthContext";

export default async function RegisterForPushNotifications ()  {
    const {state} = useContext(AuthContext);

    if (!firebase.apps.length) {
        firebase.initializeApp(ApiKeys.firebaseConfig)
    }
    const {status} = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = status;

    if (status !== 'granted') {
        const {status} = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
    }

    //get push notification token
    let token = await Notifications.getExpoPushTokenAsync();

    console.log('User notification Token is  ', token);

    let phoneNumber = state.phoneNumber;
    // add token to firebase
    await firebase.database()
        .ref("users")
        .child(phoneNumber)
        .update({
            expoPushToken: token
        })
    console.log("User token added!")

    await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            to: token,
            sound: 'default',
            title: "Title",
            body: "Body"
        })
    });
    console.log("Successfully send notification to the user " + phoneNumber);

};
//
// const RegisterForPushNotifications = async () => {
//     const {state} = useContext(AuthContext);
//     if (!firebase.apps.length) {
//         firebase.initializeApp(ApiKeys.firebaseConfig)
//     }
//     const {status} = await Permissions.getAsync(Permissions.NOTIFICATIONS);
//     let finalStatus = status;
//
//     if (status !== 'granted') {
//         const {status} = await Permissions.askAsync(Permissions.NOTIFICATIONS);
//         finalStatus = status;
//     }
//
//     //get push notification token
//     let token = await Notifications.getExpoPushTokenAsync();
//
//     console.log('User notification Token is  ', token);
//
//     let phoneNumber = state.phoneNumber;
//     // add token to firebase
//     await firebase.database()
//         .ref("users")
//         .child(phoneNumber)
//         .update({
//             expoPushToken: token
//         })
//     console.log("User token added!")
//     await sendPushNotification(token);
// }