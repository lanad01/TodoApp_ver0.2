import React, { useState } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { AuthContext } from '../../../context/authcontext';
import firestore from '@react-native-firebase/firestore';
import { Image, View, Text, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import moment from 'moment';
import { GRAY30, MIDNIGHT_BLUE, WHITE } from '../../../config/color';

const RoomScreen = ({ route }) => {
  const navigation = useNavigation();
  const authContext = React.useContext(AuthContext);
  // console.log('props' + JSON.stringify(route.params.thread.id)); //방이름
  // console.log('props' + JSON.stringify(route.params.thread._id)); //
  // console.log('props' + JSON.stringify(route.params.thread.name));

  const [messages, setMessages] = useState([
    {
      _id: '',
      text: 'Loading',
      createdAt: new Date(),
      user: {
        _id: '',
        avatar: '',
      },
    },
  ]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener(
      'blur',
      firestore()
        .collection(route.params.thread.name)
        .orderBy('createdAt', 'desc')
        .onSnapshot(snapshot =>
          setMessages(
            snapshot.docs.map(doc => ({
              _id: doc.data()._id,
              createdAt: doc.data().createdAt.toDate(),
              text: doc.data().text,
              user: doc.data().user,
            })),
          ),
        ),
    );
    return unsubscribe;
  }, []);


  function handleSend(newMessage = []) {
    setMessages(GiftedChat.append(messages, newMessage));
    firestore()
      .collection(route.params.thread.name)
      .doc(Date.now().toString())
      .set(newMessage[0]);
  }

  const renderAvatar = props => {
    if(props.currentMessage.text == 'Loading'){
      return ( <View></View>
      )
    }
    return (
      <View>
        {props.currentMessage.user.name == authContext.name ? null : (
          <Image
            source={{
              uri:
                props.currentMessage.user.avatar == null ||
                props.currentMessage.user.avatar == '' ||
                props.currentMessage.user.avatar == undefined
                  ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/1024px-Circle-icons-profile.svg.png'
                  : props.currentMessage.user.avatar,
            }}
            style={{ width: 100 * DP, height: 100 * DP, borderRadius: 50, borderWidth:3, borderColor:WHITE }}
          />
        )}
      </View>
    );
  };

  const renderBubble = props => {
    const textedTime = props.currentMessage.createdAt;
    const getTimeOfTexted = textedTime.getTime();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const timeText = moment(getTimeOfTexted).format('HH:mm');
    const getBorderRadius = () => {
      if (props.currentMessage.user.name == authContext.name) {
        return {
          borderTopLeftRadius: 15 * DP,
          borderBottomLeftRadius: 15 * DP,
        };
      } else {
        return {
          borderTopRightRadius: 15 * DP,
          borderBottomRightRadius: 15 * DP,
        };
      }
    };
    if(props.currentMessage.text == 'Loading'){
      return (
        <View style={{width:330, height:300, }}>
          <ActivityIndicator animating={true} color={'blue'} size={'large'} />
        </View>
      )
    }
    return (
      <View>
        <Text
          style={{
            textAlign:
              props.currentMessage.user.name == authContext.name
                ? 'right'
                : 'left',
            fontSize: 24 * DP,
            fontFamily: 'BMJUA',
          }}>
          {props.currentMessage.user.name == authContext.name
            ? null
            : props.currentMessage.user.name}
        </Text>

        <View
          style={[
            getBorderRadius(),
            {
              backgroundColor:
                props.currentMessage.user.name == authContext.name
                  ? 'yellow'
                  : WHITE,
              paddingVertical: 5 * DP,
              paddingHorizontal: 10 * DP,
              marginVertical: 5,
              marginHorizontal: 10 * DP,
              minWidth: 150 * DP,
              minHeight: 70 * DP,
              maxWidth: 600 * DP,
            },
          ]}>
          <Text
            style={{
              fontFamily: 'Roboto-MediumItalic',
              fontSize: 30 * DP,
              marginHorizontal: 5 * DP,
            }}>
            {props.currentMessage.text}
          </Text>
          <Text
            style={{
              fontFamily: 'BMJUA',
              fontSize: 22 * DP,
              color: MIDNIGHT_BLUE,
              textAlign: 'right',
            }}>
            {timeText}
          </Text>
        </View>
        {props.currentMessage.user.name == authContext.name ? (
          <View
            style={{
              position: 'absolute',
              width: 0,
              height: 0,
              backgroundColor: 'transparent',
              borderStyle: 'solid',
              borderRightWidth: 20,
              borderTopWidth: 20,
              borderRightColor: 'transparent',
              borderTopColor: 'yellow',
              right: -10,
              top: 43 * DP,
            }}></View>
        ) : (
          <View
            style={{
              position: 'absolute',
              width: 0,
              height: 0,
              backgroundColor: 'transparent',
              borderStyle: 'solid',
              borderRightWidth: 15,
              borderTopWidth: 15,
              borderRightColor: 'transparent',
              borderTopColor: 'white',
              left: -10,
              top: 37 * DP,
              transform: [{ rotate: '90deg' }],
            }}></View>
        )}
      </View>
    );
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={newMessage => handleSend(newMessage)}
      user={{
        _id: authContext.id,
        avatar:
          authContext.image != null
            ? authContext.image
            : 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/1024px-Circle-icons-profile.svg.png',
        name: authContext.name,
      }}
      showUserAvatar={true}
      showAvatarForEveryMessage={true}
      renderAvatar={props => renderAvatar(props)}
      renderBubble={props => renderBubble(props)}
      messagesContainerStyle={{ backgroundColor: '#B0C4DE' }}
      
      dateFormat={'YYYY. MM. DD'}
    
    />
  );
};

export default RoomScreen;
