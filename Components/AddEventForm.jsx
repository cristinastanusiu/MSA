import React, { useState } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    TextInput,
    TouchableOpacity,
    Text
} from 'react-native';
import { Formik } from 'formik';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';

export default function AddEventForm({ addEvent }) {
    const [isVisible, setPickerOpen] = useState(false);
    const [chosenDate, setChosenDate] = useState('');

    return (
        <ScrollView>
            <Text style={styles.motto}>Let your friends know your plans</Text>
            <View style={StyleSheet.container}>
                <Formik
                    initialValues={{ title: '', place: '', datetime: '', maxPers: 0 }}
                    onSubmit={(values, actions) => {
                        //add functionality here
                        // actions.resetForm();
                        values.datetime = chosenDate;
                        addEvent(values);
                    }}
                >
                    {props => (
                        <View style={styles.formik}>
                            <TextInput
                                style={styles.input}
                                placeholder='Event title'
                                onChangeText={props.handleChange('title')}
                                values={props.values.title}
                            />

                            <TextInput
                                style={styles.input}
                                placeholder='Place'
                                onChangeText={props.handleChange('place')}
                                values={props.values.place}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder='Maximum Persons'
                                onChangeText={props.handleChange('maxPers')}
                                values={props.values.maxPers}
                                keyboardType='number-pad'
                            />

                            <TouchableOpacity
                                style={styles.datetimeButton}
                                onPress={() => setPickerOpen(true)} >
                                <Text style={styles.datetime}>Date & Time</Text>
                            </TouchableOpacity>

                            <DateTimePicker
                                isVisible={isVisible}
                                onConfirm={(datetime) => {
                                    setChosenDate(moment(datetime).format("HH:mm, Do MMM"));
                                    setPickerOpen(false);
                                }}
                                onCancel={() => {
                                    setPickerOpen(false);
                                }}
                                mode={'datetime'}
                                is24Hour={false}
                                onChangeText={() => props.handleChange('datetime')}
                                values={props.values.datetime}
                            />
                            <Text
                                style={styles.chosenDate}
                                placeholder='Date and Time'
                            >{chosenDate}</Text>

                            <TouchableOpacity
                                style={styles.submitButton}
                                onPress={props.handleSubmit}                                >
                                <Text style={styles.submitText}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </Formik>
            </View>
        </ScrollView>

    );
}

const styles = StyleSheet.create({
    formik: {
        marginTop: 8,
        padding: 20,

    },
    input: {
        borderWidth: 2,
        borderColor: '#D9C6BF',
        padding: 10,
        fontSize: 18,
        borderRadius: 15,
        marginTop: 15
    },
    submitButton: {
        marginTop: 20,
        marginLeft: '20%',
        width: 200,
        height: 70,
        color: '#8C625E',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 100,
        backgroundColor: '#F2E0D5',
        opacity: 1
    },
    submitText: {
        fontSize: 30,
        color: '#8C625E'
    },
    motto: {
        marginTop: 140,
        fontSize: 30,
        alignSelf: 'center',
        color: '#8C625E',
        marginHorizontal: 60,
    },
    datetimeButton: {
        marginTop: 20,
        width: '100%',
        height: 50,
        color: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 15,
        backgroundColor: '#8C625E',
        opacity: 1
    },
    datetime: {
        fontSize: 20,
        color: '#fff'
    },
    chosenDate: {
        fontSize: 20,
        color: '#CF1C1C',
        alignSelf: 'center'
    }
});


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
