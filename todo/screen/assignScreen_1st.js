import React, { useEffect, useRef, useState } from 'react';
import {  View,  SafeAreaView,  Image,  Text,  TouchableWithoutFeedback,  TextInput,  Keyboard,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { DPW } from '../dp';
import { DB } from '../sqliteConnection';
import { styles } from './styles/assignScreenStyle';
import { ErrorModal } from '../modal/ErrorModal';

export default AssignScreen_1st = ({ navigation }) => {
  const idRef = useRef(); // useRefsms Dom을 부른다
  const pwdRef = useRef();

  const [id, setId] = useState(null);
  const [idNull, setIdNull] = useState(false);
  const [idNNMessage, setIdNNMessage] = useState();
  const [dupIdError, setDupIdError] = useState(false);

  const [pwd, setpwd] = useState(null);
  const [pwdNull, setPwdNull] = useState(false);
  const [pwdNNMsg, setPwdNNMsg] = useState();

  const [job, setJob] = useState(null);
  const [email, setEmail] = useState(null);
  const [rise,setRise] = useState(0)
  useEffect(() => {
    const hide = Keyboard.addListener('keyboardDidHide', e => {
      // 키보드가 사라지면 화면을 직접 내려버린다.
      setRise(0)
    });
    return (() => {
      console.log('Unsubscribe ');
      // useEffect에서 요기 return뒤의 값은 해당 컴포넌트가 종료될 때 실행된다
      // Keyboard.removeAllListeners('keyboardDidHide'); //resource Leak 에러메시지 해결
      hide.remove();
    },
      []
    );
  });
  const modalOff = () => {
    setDupIdError(false);
    idRef.current.focus(); //중복오류 발생 시 id작성란에 focus
  };
  function nextPage() {
    if (id === null && pwd != null) {
      //id Null
      setIdNull(true);
      setIdNNMessage(' !! ID는 반드시 입력해주셔야 합니다.');
      idRef.current.focus();
    } else if (pwd === null && id != null) {
      // Pwd Null
      setPwdNull(true);
      setPwdNNMsg(' !! 암호는 반드시 입력해주셔야 합니다. ');
      pwdRef.current.focus();
    } else if (id === null && pwd === null) {
      // id Pwd null
      setPwdNull(true);
      setPwdNNMsg(' !! 암호는 반드시 입력해주셔야 합니다. ');
      setIdNull(true);
      setIdNNMessage(' !! ID는 반드시 입력해주셔야 합니다.');
      idRef.current.focus();
    } else if (pwd != null && id != null) {
      // Both Not null
      setIdNNMessage('');
      setPwdNNMsg('');
      DB.transaction(tx => {
        // Duplication Check
        tx.executeSql(
          'SELECT count(*) AS count from user_info WHERE id=?',
          [id],
          (tx, res) => {
            let count = JSON.stringify(res.rows.item(0).count);
            console.log(count);
            if (count == 1) {
              console.log('중복된 아이디 존재');
              setDupIdError(true);
            } else {
              // 최종
              console.log('중복아이디 없음');
              navigation.push('Assign2nd', {
                id: id,
                pwd: pwd,
                job: job,
                email: email,
              });
            }
          },
          error => {
            console.log('Valid Failed' + JSON.stringify(error));
          },
        );
      });
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={{
            padding: 48 * DPW,
            backgroundColor: 'white',
            width: 660 * DPW,
            height: 1100 * DPW,
            borderRadius: 20,
            marginBottom: 200 * DPW,
            bottom: rise * DPW,
          }}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.headerText}> Register </Text>
            <TouchableOpacity onPress={nextPage}>
              <View style={styles.nextBtnContainer}>
                <Image
                  source={require('../assets/Next.jpg')}
                  style={styles.nextBtn}
                />
              </View>
            </TouchableOpacity>
          </View>
          <Text style={styles.headerDetailText}>
            Please enter details to register
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.category}> ID</Text>
            <Text style={styles.nnMsg}> {idNNMessage}</Text>
          </View>
          <TextInput
            style={styles.input}
            maxLength={30}
            placeholder=" Please type ID :)"
            onChangeText={id => setId(id)}
            ref={idRef}
          />

          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.category}> Password </Text>
            <Text style={styles.nnMsg}> {pwdNNMsg}</Text>
          </View>
          <TextInput
            style={styles.pwdinput}
            secureTextEntry={true}
            maxLength={30}
            placeholder=" Please Fill your Password!"
            onChangeText={pwd => setpwd(pwd)}
            ref={pwdRef}
          />

          <Text style={styles.category}> Job </Text>
          <TextInput
            style={styles.input}
            maxLength={30}
            placeholder=" Fell free to type here :)"
            onChangeText={job => setJob(job)}
            onFocus={ () => setRise(160)}
          />

          <Text style={styles.category}> Email </Text>
          <TextInput
            style={styles.input}
            keyboardType={'email-address'}
            maxLength={30}
            placeholder=" email@example.com"
            onChangeText={email => setEmail(email)}
            onFocus={ () => setRise(350)}

          />
        </View>
      </TouchableWithoutFeedback>
      <ErrorModal
        modalOn={dupIdError}
        modalOff={modalOff}
        message={'중복된 아이디가 존재합니다.'}
      />
    </SafeAreaView>
  );
};
