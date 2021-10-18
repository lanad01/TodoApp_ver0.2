import React from 'react';
import {  View,  BackHandler,  Alert,} from 'react-native';
import { ProfileMain } from '../view/profileMain';

export const ProfileMain_Data = ({ navigation }) => {
  const config = { velocityThreshold: 0.5, directionalOffsetThreshold: 50 }; //swipe gesture Handler Option
  // 화면 Swipe 결과 실행
  function onSwipe(gestureName) {
    console.log('GestureName :' + gestureName);
    if (gestureName === 'SWIPE_LEFT') navigation.navigate('Task'); //Swipe Left할 시 Screen.Task로 이동
  }

  //Profile Screen에서 HardwareBackBtn을 눌렀을 시 발생하는 컨펌 Alert
  const onBackPress = React.useCallback(() => {
    console.log('Onback PRess useCallback');
    Alert.alert('Exit the app', 'Do you want to exit the app?', [
      {
        text: 'Cancel',
        style: 'cancel',
        onPress: () => null,
      },
      {
        text: 'Exit',
        onPress: () => BackHandler.exitApp(),
      },
    ]);
    return true;
  }, []);

  React.useEffect(() => {
    const subscribe = navigation.addListener('focus', () => {
      //foucs될 때마다 발동 , 이게 핵심
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
    });
    navigation.addListener('')
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      subscribe;
    };
  }, []);

  const goToEdit = () => {
    BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    console.log('BackHandler 삭제');
    navigation.push('ProfileEdit');
  };
  return (
    <View>
      <ProfileMain
        goToEdit={goToEdit}
        onSwipe={(direction, state) => onSwipe(direction, state)}
        swipeConfig={config}
      />
    </View>
  );
};
