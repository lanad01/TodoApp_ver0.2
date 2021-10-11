import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, Alert, Text, TouchableOpacity } from 'react-native';
import { logout, unlink } from '@react-native-seoul/kakao-login';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-community/async-storage';

import { styles } from './styles/tabsScreenStyle';
import { ProfileRoot } from './profileRoot';
import { TodoContext } from '../context/todoContext';
import { AuthContext } from '../context/authcontext';
import { TaskScreen } from './taskScreen';
import {
  DB,
  CREATE_TASK_TABLE,
  GET_BADGE_VALUE,
  DB_MODULE,
} from '../sqliteConnection';
import { AUTO_LOGIN_PUSH_ALARM } from '../pushAlarm';

export const MainScreen = props => {
  console.log('MainScreen ');
  const authContext = React.useContext(AuthContext);
  const todoContext = React.useContext(TodoContext);
  const [number_of_task, setNumber_of_task] = React.useState(null); //Task 갯수
  const [logoutModal, setLogoutModal] = useState(false);
  //TaskList 확인 여부 - true : Badge 숫자를 0으로
  const [taskListWritten, setTaskListWritten] = React.useState(false);

  //Task TabbarBadge select 실행
  const getBadge = () => {
    let myFirstPromise = new Promise((resolve, reject) => {
      const result = GET_BADGE_VALUE(authContext.user_no);
      setTimeout(() => {
        resolve(result);
      }, 2000);
    }).catch(err => {
      console.log('Error occur in promise' + err);
    });
    myFirstPromise.then(result => {
      setNumber_of_task(result.count);
    });
  };

  //Task Badge 값 받아오기
  React.useEffect(() => {
    CREATE_TASK_TABLE();
    getBadge();
  }, [props.navigation]);

  //Badge 형성이 된 후
  React.useEffect(() => {
    //task의 숫자가 null이 아니면 자동로그인일 경우 알람 설정
    if (number_of_task != null && authContext.autologin == true) {
      AUTO_LOGIN_PUSH_ALARM(authContext, number_of_task);
      console.log('mainscreen / 자동로그인 체크 ' + authContext.autologin);
    }
    return () => {};
  }, [number_of_task]);

  //로그아웃 버튼 Alert창
  function logOutConfirm() {
    Alert.alert(
      '로그아웃하시겠습니까?', '',
      [
        {
          text: '아니오',
          onPress: () => console.log('Cancel Pressed'),
        },
        {
          text: '예',
          onPress: () => logOutImple(),
        },
      ],
      { cancelable: false },
    );
  }

  //로그아웃 실행
  const logOutImple = async () => {
    console.log('로그인 루트 ?' + authContext.login_route);
    if (
      authContext.login_route == null ||
      authContext.login_route == undefined
    ) {
      console.log('로그아웃 / 일반유저');
    } else if (authContext.login_route == 'google') {
      console.log('로그아웃 / 구글유저');
      try {
        const isSignedIn = await GoogleSignin.isSignedIn();
        if (isSignedIn) {
          console.log('gets here'); // LOGS THIS
          await GoogleSignin.revokeAccess(); // GETS STUCK HERE
          console.log('passed revoke access');
          await GoogleSignin.signOut(); // 구글 로그아웃
          console.log('passed signOut');
        }
      } catch (err) {
        console.log(err);
      }
    } else if (authContext.login_route == 'kakao') {
      console.log('로그아웃 / 카카오유저');
      const message = await unlink();
      console.log('링크해제 카카오 메시지' + message);
    }

    AsyncStorage.removeItem('user_no');
    props.navigation.replace('Auth'); // 로그인화면
  };
  //Profile screen Configure
  const profileScreen_Opt = () => {
    return {
      tabBarActiveTintColor: '#00af9d',
      tabBarLabelStyle: styles.tabbarLabel,
      headerStyle: { backgroundColor: '#E0ffff' },
      headerTitleStyle: styles.headerTitleStyle,
      headerRight: () => (
        <TouchableOpacity style={styles.btnView} onPress={logOutConfirm}>
          <Text style={styles.logoutBtn}>Logout</Text>
        </TouchableOpacity>
      ),
      tabBarIcon: ({}) => {
        return (
          <Image
            source={require('../assets/profileIcon.png')}
            style={styles.tabbarIcon}
          />
        );
      },
    };
  };
  //TaskScreen Configure
  const taskScreen_Opt = () => {
    return {
      //tabBarBadge는 task가 한번 읽혔다면 0, 첫 프로필화면에서는 숫자만큼 출력
      tabBarBadge: taskListWritten ? 0 : number_of_task,
      tabBarActiveTintColor: '#00af9d',
      tabBarLabelStyle: styles.tabbarLabel,
      headerTitleStyle: styles.headerTitleStyle,
      headerStyle: { backgroundColor: '#E0ffff' },
      headerRight: () => (
        <TouchableOpacity style={styles.btnView} onPress={logOutConfirm}>
          <Text style={styles.logoutBtn}>Logout</Text>
        </TouchableOpacity>
      ),
      tabBarIcon: ({}) => {
        return (
          <Image
            source={require('../assets/128x128.png')}
            style={styles.tabbarIcon}
          />
        );
      },
    };
  };

  const Tabs = createBottomTabNavigator();
  return (
    //컴포넌트화
    <TodoContext.Provider value={todoContext}>
      <Tabs.Navigator initialRouteName="Profile">
        <Tabs.Screen
          name="Profile"
          component={ProfileRoot}
          options={profileScreen_Opt}
        />
        <Tabs.Screen
          name="TaskScreen"
          component={TaskScreen}
          options={taskScreen_Opt}
          listeners={({}) => ({
            tabPress: e => {
              setTaskListWritten(true);
            },
          })}
        />
      </Tabs.Navigator>
    </TodoContext.Provider>
  );
};
