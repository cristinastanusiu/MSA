import React from 'react';
import {Button, Text} from 'react-native';

const EventsFeedScreen = ({ navigation }) => {
    return (
        <>
            <Button
                title="Go to user's profile"
                onPress={() =>
                    navigation.navigate('Profile')
                }
            />
            <Button
                title="Go to your contacts list"
                onPress={() =>
                    navigation.navigate('Contacts')
                }
            />
            <Text>
            Hi, here will be the event list.
            </Text>
        </>
    );
};

export default EventsFeedScreen;