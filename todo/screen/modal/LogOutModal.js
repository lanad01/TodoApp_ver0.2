import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { logout, unlink } from '@react-native-seoul/kakao-login';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-community/async-storage';
import Modal from 'react-native-modal';

import { AuthContext } from '../../context/authcontext';
import { DPW } from '../../config/dp'
import { LIGNT_CYAN } from '../../config/color';

const LogOutModal = (props) => {
  //two btn modal
  const authContext=React.useContext(AuthContext)

  const logOutImple = async () => {
    console.log("로그인루트  "+authContext.login_route)
    if (
      authContext.login_route == null ||
      authContext.login_route == undefined
    ) {
      console.log('로그아웃 / 일반유저');
    } else if (authContext.login_route == 'google') {
      console.log('로그아웃 / 구글유저');
      try {
        const isSignedIn = await GoogleSignin.isSignedIn();
        console.log("issigned" + isSignedIn)
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
    props.gobackHome()

  };
  return (
    <Modal
      isVisible={props.modalOn}
      avoidKeyboard={true}
      transparent={true}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={styles.outside}>
          <View style={styles.validModal}>
            <Text style={styles.validText}>{props.message}</Text>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                style={styles.choicebox}
                onPress={props.modalOff}>
                <Text textAlign="center" style={styles.btn}>
                  돌아가기
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.choicebox} onPress={logOutImple}>
                <Text textAlign="center" style={styles.btn}>
                  로그아웃
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
    </Modal>
  );
};

export default LogOutModal;

const styles = StyleSheet.create({
  choicebox: {
    alignItems: 'center',
    marginTop: 30 * DPW,
  },
  outside: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    textAlign: 'center',
    textAlignVertical:'center',
    fontFamily: 'BMJUA',
    fontSize: 36 * DPW,
    backgroundColor: 'white',
    borderRadius: 7,
    borderWidth: 5,
    padding: 15 * DPW,
    marginHorizontal: 13 * DPW,
  },
  validModal: {
    width: 600 * DPW,
    height: 300 * DPW,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    borderColor: LIGNT_CYAN,
    borderWidth: 9,
  },
  validText: {
    fontFamily: 'BMJUA',
    fontSize: 46 * DPW,
    textAlign: 'center',
    width: 440 * DPW,
  },
});
