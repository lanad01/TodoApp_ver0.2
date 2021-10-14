import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from 'react-native-splash-screen';
import messaging from '@react-native-firebase/messaging';

import { AuthContext } from '../context/authcontext';
import { TabRoot } from './tabRoot';
import { AssignRoot } from './assignRoot';
import { authScreen } from '../screen/auth/authScreen';
import { CHECK_EXP_OF_TASKS } from '../sqliteConnection/taskTableConnection';
import { CREATE_USER_TABLE } from '../sqliteConnection/userTableConnection';
import { Alert, AppState } from 'react-native';
import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-community/async-storage';

export default () => {
  
  //Push notification alarm 채널 생성
  //이제 route아래의 디렉토리에서는 해당채널에게 push alarm을 줄 수 있다.
  const createChannels = () => {
    PushNotification.createChannel({
      channelId: 'test-channel',
      channelName: 'Test Channel',
    });
  };

  //Appstate가 background인 상태에서 
  //AsyncStorage에 로그인된 기록이 있는 유저의 Task row에서
  //기한이 하루 이하로 남은 row가 있을 경우 푸쉬알람 설정
  const pushNoti_background = async () => {
    console.log('Appstate Change :' + AppState.currentState);
    if (AppState.currentState == 'background') {
      const user_no=await AsyncStorage.getItem('user_no') //왜 await를 붙여야하는지는 차후 이야기합시다
      CHECK_EXP_OF_TASKS(user_no)
    }
  };
  //Appstate가 변할 경우 실행되는 useEffect
  useEffect(() => {
    const back_noti = AppState.addEventListener('change', pushNoti_background);
    return back_noti;
  }, [AppState.currentState]);

  //Firebase를 통한 Remote Message 기능 구현 - firebase를 직접 들어가야함
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });
    createChannels();
    return unsubscribe;
  }, []);

  useEffect(() => {
    SplashScreen.hide(); //첫 로딩화면
  }, []);

  useEffect(() => {
    //Create Table 선언
    CREATE_USER_TABLE();
  }, []);
  const authContext = React.useContext(AuthContext);

  const opt = () => {
    return {
      animationEnabled: false,
      headerTitleStyle: { fontFamily: 'BMJUA' },
      headerShown: false,
      headerStyle: { backgroundColor: '#E0ffff' },
    };
  };

  const MainStack = createStackNavigator();

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <MainStack.Navigator initialRouteName="Auth" headerShown={false}>
          <MainStack.Screen
            name="TabRoot"
            component={TabRoot}
            options={opt}
          />
          <MainStack.Screen name="Auth" component={authScreen} options={opt} />
          <MainStack.Screen
            name="AssignRoot"
            component={AssignRoot}
            options={opt}
          />
        </MainStack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
};
