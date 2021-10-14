import React, { useState, useEffect, Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { logout, unlink } from '@react-native-seoul/kakao-login';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-community/async-storage';
import Modal from 'react-native-modal';
import { AuthContext } from '../context/authcontext';

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
      <TouchableOpacity onPress={props.modalOff}>
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
      </TouchableOpacity>
    </Modal>
  );
};

export default LogOutModal;

const styles = StyleSheet.create({
  choicebox: {
    alignItems: 'center',
    marginTop: 15,
  },
  outside: {
    width: 400,
    height: 700,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  btn: {
    textAlign: 'center',
    fontFamily: 'BMJUA',
    fontSize: 18,
    backgroundColor: 'white',
    borderRadius: 7,
    borderWidth: 5,
    width: 120,
    borderWidth: 5,
    paddingTop: 10,
    marginHorizontal: 13,
    zIndex: 4,
  },
  validModal: {
    width: 300,
    height: 150,
    backgroundColor: 'white',
    borderRadius: 10,
    borderColor: '#E0ffff',
    borderWidth: 9,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 19,
    zIndex: 3,
  },
  validText: {
    fontFamily: 'BMJUA',
    fontSize: 23,
    textAlign: 'center',
    width: 220,
  },
});
