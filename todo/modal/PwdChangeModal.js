import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';
import { ErrorModal } from './ErrorModal';
import { DPW } from '../dp';

export const PwdChangeModal = props => {
  const [pwdInput, setPwdInput] = useState();
  const [validFailModal, setValidFailModal] = useState(false);
  const verify = () => {
    if (pwdInput === props.pwdVerify) {
      console.log('일치');
      props.modalOff();
      props.resetPwd();
    } else {
      console.log('PWD Verify 불일치');
      setValidFailModal(true);
    }
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
            <Text style={styles.validText}>
              암호 변경을 위해 현재 사용하고 계시는 암호를 입력해주세요
            </Text>
            <TextInput
              placeholder="현재 암호 입력"
              secureTextEntry={true}
              style={styles.pwdInput}
              onChangeText={pwd => setPwdInput(pwd)}
            />
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity style={styles.choicebox} onPress={verify}>
                <Text textAlign="center" style={styles.photochoose}>
                  확 인
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.choicebox}
                onPress={props.modalOff}>
                <Text textAlign="center" style={styles.photochoose}>
                  나 가 기
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <ErrorModal
        modalOn={validFailModal}
        modalOff={() => setValidFailModal(false)}
        message={'현재 비밀번호와 일치하지않습니다.'}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  choicebox: {
    alignItems: 'center',
    marginTop: 30 * DPW,
  },
  outside: {
    width: 800 * DPW,
    height: 1400 * DPW,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  photochoose: {
    textAlign: 'center',
    fontFamily: 'BMJUA',
    fontSize: 44 * DPW,
    backgroundColor: 'white',
    borderRadius: 7,
    borderWidth: 5,
    width: 200 * DPW,
    borderWidth: 5,
    paddingTop: 20 * DPW,
    margin: 10 * DPW,
  },
  validModal: {
    width: 600 * DPW,
    height: 500 * DPW,
    backgroundColor: 'white',
    borderRadius: 10,
    borderColor: '#AEEEEE',
    borderWidth: 5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 19,
    zIndex: 3,
  },
  validText: {
    width: 470 * DPW,
    fontFamily: 'BMJUA',
    fontSize: 36 * DPW,
    textAlign: 'center',
  },
  pwdInput: {
    borderWidth: 4,
    width: 400 * DPW,
    height: 80 * DPW,
    borderRadius: 10,
    textAlign: 'center',
    marginTop: 20 * DPW,
  },
});
