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
        borderRadius:30,
        elevation:5,
        backgroundColor:'#FEF8EF',
        shadowOffset:{width:1, height:1},
        shadowColor:"#F2E0D5",
        shadowOpacity:0.5,
        shadowRadius:8,
        marginHorizontal: 4,
        marginVertical:10,

    },
    cardContent:{
        marginHorizontal:10,
        marginVertical:30,
        marginTop:50
    }
});
