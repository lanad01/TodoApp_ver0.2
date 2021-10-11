import React, { useState, useContext, useEffect } from 'react';
import {  Text, View, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, BackHandler
} from 'react-native';
import { AuthContext } from '../context/authcontext';
import { ErrorModal } from '../modal/ErrorModal';
import { DB } from '../sqliteConnection';
import { styles } from './styles/resetPwdStyle';

export const ProfileResetPwd = ({ navigation }) => {
  const authContext = useContext(AuthContext);
  const [pwdVisible, setPwdVisible] = useState(true); // 비밀번호 보이기 boolean
  const [newPwd, setNewPwd] = useState(); // 새로운 비밀번호
  const [pwdCheck, setPwdCheck] = useState(); // 새로운 비밀번호 더블체크
  const [confirmFailedModal, setModal] = useState(false); // 비밀번호 수정 오류 모달
  const [errorMsg, setErrorMsg] = useState('오류'); //에러 모달 Msg전송 값 


  const confirm = () => {
    if (newPwd === pwdCheck && newPwd != authContext.pwd) {
      console.log('new pwd matched');
      DB.transaction(tx => {
        tx.executeSql(
          'UPDATE user_info SET pwd=? WHERE user_no=? ',
          [newPwd, authContext.user_no],
          (tx, res) => {
            console.log('update success');
            navigation.navigate('Profile1st');
          },
          error => {
            console.log('Update Failed' + error);
          },
        );
      });
    } else if (newPwd != pwdCheck) {
      console.log('double check unmatched');
      setErrorMsg('새로운 비밀번호와 비밀번호 확인이 불일치합니다');
      setModal(true);
    } else if (newPwd === authContext.pwd) {
      console.log('double check mathed but same with the previous password');
      setErrorMsg('이전에 사용했던 비밀번호입니다.');
      setModal(true);
    }
  };
  return (
    <KeyboardAvoidingView
        behavior="position"
        keyboardVerticalOffset="100"
    >
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack('ProfileEdit')}
          style={styles.backBtnContainer}>
          <Image
            source={require('../assets/back.png')}
            style={styles.backBtn}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}> 비밀번호 수정</Text>

        <View>
          <Text style={styles.detailText}> 새로운 비밀번호 </Text>
          <View style={{ flexDirection: 'row' }}>
            <TextInput
              placeholder="새로운 비밀번호"
              style={styles.input}
              secureTextEntry={pwdVisible}
              onChangeText={pwd => setNewPwd(pwd)}
            />
            <TouchableOpacity
              onPress={() => setPwdVisible(!pwdVisible)}
              style={styles.pwdVisible}>
              <Image
                source={require('../assets/show.jpg')}
                style={styles.visibleImg}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.underLine} />
        </View>
        <View>
          <Text style={styles.detailText}> 비밀번호 확인 </Text>
          <View style={{ flexDirection: 'row' }}>
            <TextInput
              placeholder="비밀번호 확인"
              style={styles.input}
              secureTextEntry={pwdVisible}
              onChangeText={pwd => setPwdCheck(pwd)}
            />
            <TouchableOpacity
              onPress={() => setPwdVisible(!pwdVisible)}
              style={styles.pwdVisible2}>
              <Image
                source={require('../assets/show.jpg')}
                style={styles.visibleImg}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.underLine} />
        </View>
        <View style={styles.btnContainer}>
          <TouchableOpacity onPress={confirm} style={styles.editBox}>
            <Text style={styles.editText}> 변 경 </Text>
          </TouchableOpacity>
        </View>
      </View>
      <ErrorModal
        modalOn={confirmFailedModal}
        modalOff={() => setModal(false)}
        message={errorMsg}
      />
    </View>
    </KeyboardAvoidingView>
  );
};
