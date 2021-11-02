import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import { List, Divider } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from '../../../context/authcontext';
import { SELECT_FRIENDS } from '../../../sqliteConnection/userTableConnection';
import { LIGNT_CYAN, MIDNIGHT_BLUE, WHITE } from '../../../config/color';

export default function HomeScreen({ navigation }) {
  const [threads, setThreads] = useState([]);
  const authContext = React.useContext(AuthContext);
  const [friendsInfo, setFriendsInfo] = useState();

  useEffect(async () => {
    const unsubscribe = firestore()
      .collection('ChattingRoom')
      // .orderBy('latestMessage.createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const threads = querySnapshot.docs.map(documentSnapshot => {
          return {
            _id: documentSnapshot.id,
            // give defaults
            name: '',
            ...documentSnapshot.data(),
          };
        });
        setThreads(threads);
      });

    const friendsInfo = await SELECT_FRIENDS(authContext);
    setFriendsInfo(friendsInfo);
    return () => unsubscribe();
  }, []);

  const addRoom = friends => {
    firestore()
      .collection('ChattingRoom')
      .add({
        id: authContext.id,
        name: friends,
      });
  };

  const separator = () => {
    return (
      <View style={{ width: 10 * DP, backgroundColor: WHITE, opacity: 0.5 }} />
    );
  };

  const renderItem = ({ item, index }) => {
    if (item.id == authContext.id) {
      return (
        <TouchableOpacity
          onPress={() => navigation.navigate('Room', { thread: item })}
          style={{flexDirection:'row', marginVertical:15*DP, marginLeft:10*DP}}  
        >
          <Image
            source={{
              uri:
                authContext.image != null
                  ? authContext.image
                  : 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/1024px-Circle-icons-profile.svg.png',
            }}
            style={{ width: 110 * DP, height: 110 * DP }}
          />
          <Text style={{alignSelf:'center', marginLeft:15*DP,}}>{item.name}</Text>
        </TouchableOpacity>
      );
    } else return null;
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          width: '100%',
          height: 5 * DP,
          backgroundColor: MIDNIGHT_BLUE,
          marginBottom: 10 * DP,
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginHorizontal: 15 * DP,
          backgroundColor: LIGNT_CYAN,
        }}>
        <FlatList
          data={friendsInfo}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          ItemSeparatorComponent={separator}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => addRoom(item.name)}
              key={index}
              style={{ justifyContent: 'center' }}>
              <Image
                source={{
                  uri:
                    item.image == null
                      ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/1024px-Circle-icons-profile.svg.png'
                      : item.image,
                }}
                style={{
                  width: 100 * DP,
                  height: 100 * DP,
                  borderRadius: 60 * DP,
                  marginHorizontal: 10 * DP,
                  marginVertical: 10 * DP,
                }}
              />
              <Text style={{ fontFamily: 'BMJUA', alignSelf: 'center' }}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <View
        style={{
          width: '100%',
          height: 5 * DP,
          backgroundColor: MIDNIGHT_BLUE,
          marginTop: 10 * DP,
        }}
      />

      <FlatList
        data={threads}
        keyExtractor={item => item._id}
        ItemSeparatorComponent={() => <Divider />}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1,
  },
  listTitle: {
    fontSize: 22,
  },
  listDescription: {
    fontSize: 16,
  },
});
