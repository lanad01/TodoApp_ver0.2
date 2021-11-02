import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { IconButton } from 'react-native-paper';
import HomeScreen from './HomeScreen';
import firestore from '@react-native-firebase/firestore';

// Add this
import RoomScreen from './RoomScreen';
import { TextInput } from 'react-native';
import { View } from 'react-native';
import { AuthContext } from '../../../context/authcontext';

const ChatAppStack = createStackNavigator();

export default function Chat() {
  const [roomName, setRoomName] = React.useState({
    name: 1,
    id: 'KAlimdor',
  });
  const addRoom = () => {
    firestore().collection('chatRoom').doc(Date.now().toString()).set(roomName);
  };
  return (
    <ChatAppStack.Navigator
      screenOptions={{headerShown:false}}>
      <ChatAppStack.Screen
        name="Home"
        component={HomeScreen}
        // options={({ navigation }) => ({
        //   headerRight: () => (
        //     <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        //       <TextInput
        //         style={{ width: 100, height: 40, backgroundColor: 'white' }}
        //         onChangeText={text => {
        //           setRoomName({ name: 2, id: text });
        //         }}
        //       />
        //       <IconButton
        //         icon="message-plus"
        //         size={28}
        //         color="#ffffff"
        //         onPress={addRoom}
        //       />
        //     </View>
        //   ),
        // })}
      />
      <ChatAppStack.Screen
        name="Room"
        component={RoomScreen}
        options={{headerShown:false}}
      />
    </ChatAppStack.Navigator>
  );
}
