import React, { useRef, useState } from 'react';
import { View } from 'react-native';
import { ID_DUPLICATION_CHECK } from '../../../sqliteConnection/userTableConnection';
import OneButtonModal from '../../../component/OneButtonModal';
import AssignScreen_1st from '../view/assign_1st';

export default Assign_1st_data = ({ navigation }) => {
  const idRef = React.useRef(); // useRefsms Dom을 부른다
  const pwdRef = React.useRef();

  const [id, setId] = React.useState(null);
  const [pwd, setPwd] = React.useState(null);
  const [email, setEmail] = React.useState(null);
  const [job, setJob] = React.useState(null);
  const [idNNMessage, setIdNNMessage] = React.useState();
  const [dupIdError, setDupIdError] = React.useState(false);
  const [pwdNNMsg, setPwdNNMsg] = React.useState();

  const patchInfo = (type, value) => {
    if (type == 'id') { setId(value) }
    if (type == 'pwd') { setPwd(value); }
    if (type == 'email') { setEmail(value) }
    if (type == 'job') { setJob(value) }
  };
  const modalOff = () => {
    setDupIdError(false);
    idRef.current.focus(); //중복오류 발생 시 id작성란에 focus
  };
  async function nextPage() {
    // >(next) 버튼 눌렀을 때.
    if (id === null && pwd != null) {
      //id Null
      setIdNNMessage(' !! ID는 반드시 입력해주셔야 합니다.');
      idRef.current.focus();
    } else if (pwd === null && id != null) {
      // Pwd Null
      setPwdNNMsg(' !! 암호는 반드시 입력해주셔야 합니다. ');
      pwdRef.current.focus();
    } else if (id === null && pwd === null) {
      // id Pwd null
      setPwdNNMsg(' !! 암호는 반드시 입력해주셔야 합니다. ');
      setIdNNMessage(' !! ID는 반드시 입력해주셔야 합니다.');
      idRef.current.focus();
    } else if (pwd != null && id != null) {
      // Both Not null
      setIdNNMessage('');
      setPwdNNMsg('');
      //얻어와보자 count를
      const count = await ID_DUPLICATION_CHECK(id); //ID와 일치하는 기존 아이디 개수 // 0이면 중복없음 => 가입 가능
      console.log('Count check at Screen' + count);
      if (count > 0) {
        console.log('중복된 아이디 존재');
        setDupIdError(true);
      } else if (count == 0) {
        console.log('중복아이디 없음');
        navigation.push('Assign2nd', {
          id: id,
          pwd: pwd,
          job: job,
          email: email,
        });
      }
    }
  }
  return (
    <View>
      <AssignScreen_1st
        setUserData={(type, value) => patchInfo(type, value)}
        nextpage={nextPage}
        idNNMessage={idNNMessage}
        pwdNNMsg={pwdNNMsg}
        idRef={idRef}
        pwdRef={pwdRef}
      />
      <OneButtonModal
        modalOn={dupIdError}
        modalOff={modalOff}
        message={'중복된 아이디가 존재합니다.'}
      />
    </View>
  );
};
