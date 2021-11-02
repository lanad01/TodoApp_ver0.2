import React, { useState } from 'react';
import {  View,  Text,  TextInput,  TouchableOpacity,   } from 'react-native';
import Modal from 'react-native-modal';
import { styles } from './styles/pwdChangeModalStyle'
import OneButtonModal from '../../component/OneButtonModal';

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
      <OneButtonModal
        modalOn={validFailModal}
        modalOff={() => setValidFailModal(false)}
        message={'현재 비밀번호와 일치하지않습니다.'}
      />
    </Modal>
  );
};
