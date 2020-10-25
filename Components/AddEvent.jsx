import React, {useState} from 'react';
import {StyleSheet,
        Text,
        View,
        TextInput,
        Button} from 'react-native';
import {Formik} from 'formik';

export default function AddEvent(){

    return(
        <View style={StyleSheet.container}>
            <Text style={{top:100,left:50}}>Here is the AddEvent Form</Text>
        </View>
    );
}