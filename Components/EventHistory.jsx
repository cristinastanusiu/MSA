import React, { useState } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    TextInput,
    TouchableOpacity,
    Text
} from 'react-native';
import Card from "./shared/Card";



export default function EventHistory({ item }) {

    const [event,setEvent] = useState(item);
    console.log(event);
    return (
       <ScrollView>
           <Card  key={event.key}>
                    <Text style={styles.title}>
                    {event.title} {event.place}
                    </Text>

                    <Text style={styles.datetime}>{event.dateTime}</Text>
                    <Text style={styles.available}>
                        Av: {event.currentPers}/{event.maxPers}</Text>
                </Card>
        </ScrollView>

    );
}


const styles = StyleSheet.create({
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


// const styles = StyleSheet.create({
//     formik: {
//         marginTop: 8,
//         padding: 20,

//     },
//     input: {
//         borderWidth: 2,
//         borderColor: '#D9C6BF',
//         padding: 10,
//         fontSize: 18,
//         borderRadius: 15,
//         marginTop: 15
//     },
//     submitButton: {
//         marginTop: 20,
//         marginLeft: '20%',
//         width: 200,
//         height: 70,
//         color: '#8C625E',
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: 10,
//         borderRadius: 100,
//         backgroundColor: '#F2E0D5',
//         opacity: 1
//     },
//     submitText: {
//         fontSize: 30,
//         color: '#8C625E'
//     },
//     motto: {
//         marginTop: 140,
//         fontSize: 30,
//         alignSelf: 'center',
//         color: '#8C625E',
//         marginHorizontal: 60,
//     },
//     datetimeButton: {
//         marginTop: 20,
//         width: '100%',
//         height: 50,
//         color: '#fff',
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: 10,
//         borderRadius: 15,
//         backgroundColor: '#8C625E',
//         opacity: 1
//     },
//     datetime: {
//         fontSize: 20,
//         color: '#fff'
//     },
//     chosenDate: {
//         fontSize: 20,
//         color: '#CF1C1C',
//         alignSelf: 'center'
//     }
// });


        // <View style={{
        //     flexDirection:'row',
        //     alignItems:'center',
        //     marginHorizontal:40,
        //     borderWidth:2,
        //     marginTop:'50%',
        //     paddingHorizontal:10,
        //     borderColor:'#D9C6BF',
        //     borderRadius:20,
        //     paddingVertical:15
        // }}>
        //     <Text style={{top:-40,left:0,fontSize:18}}>Event name</Text>
        //     <TextInput style={{paddingHorizontal:10}}></TextInput>

        // </View>



        // <TextInput
        // style={styles.input}
        // placeholder='Date'
        // onChangeText={props.handleChange('date')}
        // values={props.values.date}
        // />

        // <TextInput
        // style={styles.input}
        // placeholder='Time'
        // onChangeText={props.handleChange('time')}
        // values={props.values.time}
        // />
