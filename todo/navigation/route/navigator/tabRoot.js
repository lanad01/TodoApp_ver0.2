import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, Text, TouchableOpacity } from 'react-native';

import { styles } from '../../styles/tabRootStyle';
import { ProfileRoot } from './profileRoot';
import { TodoContext } from '../../../context/todoContext';
import { AuthContext } from '../../../context/authcontext';
import {
  CREATE_TASK_TABLE,
  GET_BADGE_VALUE,
} from '../../../sqliteConnection/taskTableConnection';
import { AUTO_LOGIN_PUSH_ALARM } from '../../../pushAlarms/pushAlarm';
import LogOutModal from '../../../screen/modal/LogOutModal';
import { useNavigation } from '@react-navigation/core';
import { TaskScreen_Data } from '../../../screen/tab/task/data/taskScreen_data';
import { LIGNT_CYAN } from '../../../config/color';
import Calendar_Data from '../../../screen/tab/calendar/calendar_data';
import Chat from '../../../screen/tab/chat/chat';

export const TabRoot = props => {
  console.log('TabRoot ');
  const navigation = useNavigation();
  const authContext = React.useContext(AuthContext);
  const todoContext = React.useContext(TodoContext);
  const [number_of_task, setNumber_of_task] = React.useState(null); //Task 갯수
  //TaskList 확인 여부 - true : Badge 숫자를 0으로
  const [taskListWritten, setTaskListWritten] = React.useState(false);
  const [logoutModal, setLogoutModal] = React.useState(false);
  //Task TabbarBadge select 실행

  React.useEffect(() => {
    CREATE_TASK_TABLE();
    const getBadge = async () => {
      try {
        const result = await GET_BADGE_VALUE(authContext.user_no);
        setNumber_of_task(result);
      } catch (err) {
        console.log('ERROR' + err);
      }
    };
    const subscribe = navigation.addListener('focus', getBadge);
    return subscribe;
  }, []);

  //Badge 형성이 된 후
  React.useEffect(() => {
    //task의 숫자가 null이 아니면 자동로그인일 경우 알람 설정
    if (number_of_task != null && authContext.autologin == true) {
      AUTO_LOGIN_PUSH_ALARM(authContext, number_of_task);
    }
    return () => {};
  }, [number_of_task]);

  const logoutImple = () => {
    setLogoutModal(false);
    todoContext.taskInfo=[]
    props.navigation.navigate('Auth');
  };

  const logoutBtn = () => {
    return (
      <TouchableOpacity
        style={styles.btnView}
        onPress={() => setLogoutModal(true)}>
        <Text style={styles.logoutBtn}>Logout</Text>
        <LogOutModal
          modalOn={logoutModal}
          modalOff={() => setLogoutModal(false)}
          message="로그아웃 하시겠습니까?"
          gobackHome={logoutImple}
        />
      </TouchableOpacity>
    );
  };
  //Profile screen Configure
  const profileScreen_Opt = () => {
    return {
      tabBarActiveTintColor: '#00af9d',
      tabBarLabelStyle: styles.tabbarLabel,
      headerTitleStyle: styles.headerTitleStyle,
      headerRight: () => logoutBtn(),
      tabBarIcon: ({}) => {
        return (
          <Image
            source={require('../../../assets/images/profileIcon.png')}
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
      headerRight: () => logoutBtn(),
      tabBarIcon: ({}) => {
        return (
          <Image
            source={require('../../../assets/images/128x128.png')}
            style={styles.tabbarIcon}
          />
        );
      },
    };
  };

  const calnerdarScreen_opt = () => {
    return {
      tabBarActiveTintColor: '#00af9d',
      tabBarLabelStyle: styles.tabbarLabel,
      headerTitleStyle: styles.headerTitleStyle,
      headerRight: () => logoutBtn(),
      tabBarIcon: ({tintColor, focused}) => {
        
        return (
          <Image
            source={require('../../../assets/images/calendar-icon.png')}
            style={styles.tabbarIcon}
          />
        );
      },
    };
  };

  const chattingScreen_opt = () => {
    return {
      tabBarActiveTintColor: '#00af9d',
      tabBarLabelStyle: styles.tabbarLabel,
      headerTitleStyle: styles.headerTitleStyle,
      headerRight: () => logoutBtn(),
      tabBarIcon: ({tintColor, focused}) => {
        return (
          <Image
            source={require('../../../assets/images/chat.jpg')}
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
      <Tabs.Navigator initialRouteName="Chatting">
        <Tabs.Screen
          name="Profile"
          component={ProfileRoot}
          options={profileScreen_Opt}
        />
        <Tabs.Screen
          name="Task"
          component={TaskScreen_Data}
          options={taskScreen_Opt}
          listeners={({}) => ({
            tabPress: e => {
              setTaskListWritten(true);
            },
          })}
        />
        <Tabs.Screen
          name="Calendar"
          component={Calendar_Data}
          options={calnerdarScreen_opt}
        />
        <Tabs.Screen
          name="Chatting"
          component={Chat}
          options={chattingScreen_opt}
        />
      </Tabs.Navigator>
    </TodoContext.Provider>
  );
};
