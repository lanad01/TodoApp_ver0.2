import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, Text, TouchableOpacity, BackHandler } from 'react-native';

import { styles } from './styles/tabsScreenStyle';
import { ProfileRoot } from './profileRoot';
import { TodoContext } from '../context/todoContext';
import { AuthContext } from '../context/authcontext';
import { TaskScreen } from '../screen/tab/task/view/taskScreen';
import {
  CREATE_TASK_TABLE,
  GET_BADGE_VALUE,
} from '../sqliteConnection/taskTableConnection';
import { AUTO_LOGIN_PUSH_ALARM } from '../pushAlarm';
import LogOutModal from '../modal/LogOutModal';
import { useNavigation } from '@react-navigation/core';

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
    const subscribe = navigation.addListener('focus', getBadge );
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
    props.navigation.navigate('Auth');
  };
  //Profile screen Configure
  const profileScreen_Opt = () => {
    return {
      tabBarActiveTintColor: '#00af9d',
      tabBarLabelStyle: styles.tabbarLabel,
      headerStyle: { backgroundColor: '#E0ffff' },
      headerTitleStyle: styles.headerTitleStyle,
      headerRight: () => (
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
      ),
      tabBarIcon: ({}) => {
        return (
          <Image
            source={require('../assets/images/profileIcon.png')}
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
      ),
      tabBarIcon: ({}) => {
        return (
          <Image
            source={require('../assets/images/128x128.png')}
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
