import * as firebase from 'firebase';
import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications';
import ApiKeys from "../constants/ApiKeys";

export default async function RegisterForPushNotifications(phoneNumber) {
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

    // add token to firebase
    await firebase.database()
        .ref("users")
        .child(phoneNumber)
        .update({
            expoPushToken: token
        })
    console.log("User token added!")
}