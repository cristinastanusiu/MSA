import React, {useEffect, useState} from 'react';
import {View,
    SafeAreaView,
    StyleSheet,
    Image,
    Dimensions,
    ScrollView,
    RefreshControl,
    TouchableOpacity} from 'react-native';
import {
    Text,
} from 'react-native-paper';
import {ActionSheet,Root}  from 'native-base';
import ImagePicker from 'react-native-image-crop-picker';

const wait = (timeout) => {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
}
const width = Dimensions.get('window').width;

export default function ProfileScreen() {
    const [refreshing, setRefreshing] = useState(false);
    const [rerun, setRerun] = useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);

        wait(2000).then(() => setRefreshing(false));
        if(rerun == false)
            setRerun(true);
        else
            setRerun(false);
    }, []);
    //
    // const [eventList, setEventList] = useState([]);
    // useEffect(() => {
    //     axios.get('http://192.168.0.175:8080/getEvents').then(res => {
    //         setEventList(res.data);
    //         console.log(res.data);
    //     });
    // },[rerun])

    const takePhotoFromCamera = () =>{
        ImagePicker.openCamera(
            {
                width:300,
                height:400,
                cropping: true
            }).then(image => {
            console.log(image);
        });
    }

    const choosePhotoFromLibrary = () =>{
        ImagePicker.openPicker(
            {
                width:300,
                height:400,
                cropping: true
            }).then(image => {
                console.log(image);
        });
    };
    const ClickAddImage = () =>{
        const BUTTONS = ['Take Photo','Choose Photo Library','Cancel'];
        ActionSheet.show(
            {options:BUTTONS,cancelButtonIndex:2,title:'Select a Photo'},
            (buttonIndex) => {
                switch (buttonIndex){
                    case 0:
                        takePhotoFromCamera();
                    case 1:
                        choosePhotoFromLibrary();
                    default:
                        break;

                }
            }
        )
    };

    const renderImage = ({item,index}) => {
        return (
            <View>
                <Image source = {item.url} style = {styles.itemImage}/>
            </View>
        )
    };

    return (
    <Root>
        <ScrollView
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>

            <View style={styles.content} >
                <Text>User profile </Text>
                <TouchableOpacity onPress={ClickAddImage} style = {styles.btnAddImage}>
                    <Text style = {styles.txtBtn}>Add Profile Image</Text>
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
        backgroundColor: "#0080ff",
        height:50,
        width: width - 60,
        alignItems:'center',
        justifyContent:'center'
        },
    txtBtn:{
        color:'#ffffff',
    },
    itemImage:{
        backgroundColor: '#2F455C',
        height: 150,
        width:width  - 60,
        borderRadius: 15,
        resizeMode:'contain'
    }
});
