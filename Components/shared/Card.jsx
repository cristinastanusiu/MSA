import React from 'react';
import {StyleSheet,View} from 'react-native';

export default function Card(props){
    return (
        <View style={styles.card}>
            <View style={styles.cardContent}>
                {props.children}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card:{
        borderRadius:6,
        elevation:5,
        backgroundColor:'#D9C6BF',
        shadowOffset:{width:1, height:1},
        shadowColor:"#F2E0D5",
        shadowOpacity:0.5,
        shadowRadius:8,
        marginHorizontal: 4,
        marginVertical:10,

    },
    cardContent:{
        marginHorizontal:10,
        marginVertical:10,
        marginTop:40
    }
});