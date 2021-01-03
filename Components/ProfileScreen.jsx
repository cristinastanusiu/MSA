import React, {useEffect, useState} from 'react';
import {View,
    SafeAreaView,
    StyleSheet,
    Image,
    Dimensions,
    ScrollView,
    RefreshControl,
    CameraRoll,
    TouchableOpacity} from 'react-native';
import {
    Text,
} from 'react-native-paper';
import {ActionSheet,Root}  from 'native-base';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';


const wait = (timeout) => {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
}
const width = Dimensions.get('window').width;

export default function ProfileScreen() {
    const [refreshing, setRefreshing] = useState(false);
    const [rerun, setRerun] = useState(false);

    const [image, setImage] = useState(null);


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

        wait(2000).then(() => setRefreshing(false));
        if(rerun == false)
            setRerun(true);
        else
            setRerun(false);
    }, []);

    const takePhotoFromCamera = async () => {
        const response1 = await Permissions.askAsync(Permissions.CAMERA);
        const response2 = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        if (response1.granted & response2.granted) {
            let result = await ImagePicker.launchCameraAsync({
                allowsEditing: false,
                aspect: [4, 3],
                quality: 1,
            });
            console.log(result);
            if (!result.cancelled) {
                setImage(result.uri);
                await MediaLibrary.saveToLibraryAsync(result.uri);
            }
            return;
        }
        console.log('Camera or Camera Roll perimission denied!');
    };

    const choosePhotoFromLibrary = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        console.log(result);
        if (!result.cancelled) {
            setImage(result.uri);
        }
    };

    const ClickAddImage = () =>{
        const BUTTONS = ['Take Photo','Choose Photo Library','Cancel'];
        ActionSheet.show(
            {options:BUTTONS,cancelButtonIndex:2,title:'Select a Photo'},
            (buttonIndex) => {
                switch (buttonIndex){
                    case 0:
                        console.log("Clicked 0 on button Index"+ buttonIndex);
                        takePhotoFromCamera();
                        break;
                    case 1:
                        console.log("Clicked 1  on button Index"+ buttonIndex);
                        choosePhotoFromLibrary();
                        break;
                    default:
                        break;

                }
            }
        )
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
    }
});
