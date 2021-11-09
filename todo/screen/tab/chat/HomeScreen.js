import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import { Divider } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from '../../../context/authcontext';
import { SELECT_FRIENDS } from '../../../sqliteConnection/userTableConnection';
import TwoButtonModal from '../../../component/TwoButtonModal';
import { LIGNT_CYAN, MIDNIGHT_BLUE, WHITE } from '../../../config/color';

export default function HomeScreen({ navigation }) {
  const [threads, setThreads] = useState([]);
  const authContext = React.useContext(AuthContext);
  const [friendsInfo, setFriendsInfo] = useState();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [addRoomConfirm, setAddRoomConfirm] = useState(false);
  const [friend, setFriend] = useState({ image: '', name: '' });

  useEffect(async () => {
    const friendsInfo = await SELECT_FRIENDS(authContext);
    setFriendsInfo(friendsInfo);
    const unsubscribe = firestore()
      .collection('ChattingRoom')
      .doc(authContext.id)
      .collection('counterpart') // .orderBy('latestMessage.createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const threads = querySnapshot.docs.map(doc => {
          return {
            _id: doc.id,
            name: '',
            ...doc.data(),
          };
        });
        setThreads(threads);
      });
    return () => {
      unsubscribe();
      setShowConfirmModal(false);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('ChattingRoom')
      .doc(authContext.id)
      .collection('counterpart')
      .doc(friend.name)
      .set({
        id: authContext.id,
        name: friend.name,
        image: friend.image,
      });
    if (addRoomConfirm == true) {
      setShowConfirmModal(false);
      setAddRoomConfirm(false);
      unsubscribe;
    } else {
    } //noting
    return unsubscribe;
  }, [addRoomConfirm]);

  const addRoom = friend => {
    setShowConfirmModal(true);
    setFriend(friend);
  };

  const separator = () => {
    return <View style={styles.separator} />;
  };

  //채팅방 View render
  const renderItem = ({ item, index }) => {
    console.log(item.image);
    if (item.id == authContext.id) {
      return (
        <TouchableOpacity
          onPress={() => navigation.navigate('Room', { thread: item })}
          style={styles.roomView}>
          <Image
            source={{
              uri: item.image,
            }}
            style={styles.roomViewProfile}
          />
          <Text style={styles.roomName}>{item.name}</Text>
        </TouchableOpacity>
      );
    } else return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.underLine} />
      <View style={styles.profileContainer}>
        <FlatList
          data={friendsInfo}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          ItemSeparatorComponent={separator}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => addRoom(item)}
              key={index}
              style={{ justifyContent: 'center' }}>
              <Image
                source={{
                  uri:
                    item.image == null ||
                    item.image == undefined ||
                    item.image == ''
                      ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/1024px-Circle-icons-profile.svg.png'
                      : item.image,
                }}
                style={styles.profileImage}
              />
              <Text style={{ fontFamily: 'BMJUA', alignSelf: 'center' }}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <View style={styles.underLine} />

      <FlatList
        data={threads}
        keyExtractor={item => item._id}
        ItemSeparatorComponent={() => <Divider />}
        renderItem={renderItem}
      />
      <TwoButtonModal
        modalOn={showConfirmModal}
        message={'채팅방을 만드시겠습니까?'}
        modalOff={() => setShowConfirmModal(false)}
        confirm={e => setAddRoomConfirm(true)}
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
  profileImage: {
    width: 100 * DP,
    height: 100 * DP,
    borderRadius: 60 * DP,
    marginHorizontal: 10 * DP,
    marginVertical: 10 * DP,
  },
  underLine: {
    width: '100%',
    height: 5 * DP,
    backgroundColor: MIDNIGHT_BLUE,
    marginVertical: 10 * DP,
  },
  profileContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 15 * DP,
    backgroundColor: LIGNT_CYAN,
  },
  roomView: {
    flexDirection: 'row',
    marginVertical: 15 * DP,
    marginLeft: 10 * DP,
  },
  roomViewProfile: {
    width: 110 * DP,
    height: 110 * DP,
    borderRadius: 50 * DP,
    borderWidth: 5 * DP,
    borderColor: MIDNIGHT_BLUE,
  },
  roomName: {
    fontFamily: 'BMJUA',
    alignSelf: 'center',
    marginLeft: 15 * DP,
  },
  separator: {
    width: 10 * DP,
    backgroundColor: WHITE,
    opacity: 0.5,
  },
});
