import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  BackHandler,
  Alert,
} from 'react-native';
import GestureRecognizer from 'react-native-swipe-gestures';

import { AuthContext } from '../context/authcontext';
import { styles } from './styles/profileScreenStyle';
import { HEIGHT } from '../dp';

export const ProfileMain = ({ navigation }) => {
  const authContext = React.useContext(AuthContext);
  const config = { velocityThreshold: 0.5, directionalOffsetThreshold: 50 }; //swipe gesture Handler Option
  // 화면 Swipe 결과 실행
  function onSwipe(gestureName) {
    console.log('GestureName :' + gestureName);
    if (gestureName === 'SWIPE_LEFT') navigation.navigate('TaskScreen'); //Swipe Left할 시 Screen.Task로 이동
  }

  //Profile Screen에서 HardwareBackBtn을 눌렀을 시 발생하는 컨펌 Alert
  const onBackPress = useCallback(() => {
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

  const goToEdit = () => {
    //TaskList, Profile Screen 화면에서는 HardWareBackButton을 누를 시 Alert창을 출력
    //하지만 Edit로 depth가 깊어지면서는 스택을 바탕으로한 뒤로가기버튼이 수행되도록 BackHEvent를 삭제
    BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    console.log('BackHandler 삭제');
    navigation.push('ProfileEdit');
  };
  useEffect(() => {
    // 오로직 프로필 스크린에서만 BackHandler를 적용시켜보자
    console.log('Profile Screen Mount'); // 첨에만 발동
    const subscribe = navigation.addListener('focus', () => {
      //foucs될 때마다 발동 , 이게 핵심
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
    });
    return subscribe;
  }, []);


  return (
    <GestureRecognizer
      style={{ height: HEIGHT }}
      onSwipe={(direction, state) => onSwipe(direction, state)}
      config={config}>
      <View style={styles.container}>
        <Text style={styles.headerText}>프 로 필</Text>
        <View style={styles.overlap}>
          <View style={styles.profileBox}>
            <Image
              source={
                authContext.image === null || authContext.image === undefined
                  ? require('../assets/profile3.jpg')
                  : { uri: authContext.image }
              }
              style={styles.profileImage}
            />
            <Text style={styles.nameText}> {authContext.name} </Text>
            <Text style={styles.emailText}>
              {' '}
              {authContext.email === null
                ? authContext.emailNull
                : authContext.email}{' '}
            </Text>
            <TouchableOpacity onPress={goToEdit} style={styles.editBox}>
              <Text style={styles.editText}> 프로필 수정 </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.bottom}>
          <View style={styles.detailContainer}>
            <Text style={styles.detailCategory}> * Register Date </Text>
            <Text style={styles.detailContent}>
              {' '}
              - {authContext.regi_date}{' '}
            </Text>
          </View>
          <View style={styles.detailContainer2}>
            <Text style={styles.detailCategory}> * Job </Text>
            <Text style={styles.detailContent}>
              {' '}
              -{' '}
              {authContext.job === null
                ? authContext.jobNull
                : authContext.job}{' '}
            </Text>
          </View>
          <View style={styles.detailContainer2}>
            <Text style={styles.detailCategory}> * City </Text>
            <Text style={styles.detailContent}> - From DB </Text>
          </View>
        </View>
      </View>
    </GestureRecognizer>
  );
};
