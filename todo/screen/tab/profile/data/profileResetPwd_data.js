import React from 'react';
import {  View,} from 'react-native';
import { AuthContext } from '../../../../context/authcontext';
import OneButtonModal from '../../../../component/OneButtonModal';
import { RESET_PWD } from '../../../../sqliteConnection/userTableConnection';
import { ProfileResetPwd } from '../view/profileResetPwd';

export const ProfileResetPwd_Data = ({ navigation }) => {
  const authContext = React.useContext(AuthContext);
  const [pwdVisible, setPwdVisible] = React.useState(true); // 비밀번호 보이기 boolean
  const [newPwd, setNewPwd] = React.useState(); // 새로운 비밀번호
  const [pwdCheck, setPwdCheck] = React.useState(); // 새로운 비밀번호 더블체크
  const [confirmFailedModal, setModal] = React.useState(false); // 비밀번호 수정 오류 모달
  const [errorMsg, setErrorMsg] = React.useState('오류'); //에러 모달 Msg전송 값
  const confirm = () => {
    if (newPwd == undefined || pwdCheck == undefined) {
      setErrorMsg('비밀번호 작성란이 비어있습니다. ');
      setModal(true);
    } else if (newPwd === pwdCheck && newPwd != authContext.pwd) {
      console.log('두 비밀번호가 일치');
      RESET_PWD(authContext.user_no, newPwd); // 비밀번호 재설정 Sqlite 구문
      navigation.replace('ProfileMain');
    } else if (newPwd != pwdCheck) {
      console.log('비밀번호 더블체크 불일치');
      setErrorMsg('새로운 비밀번호와 비밀번호 확인이 불일치합니다');
      setModal(true);
    } else if (newPwd === authContext.pwd) {
      console.log('이전에 사용했던 비밀번호');
      setErrorMsg('이전에 사용했던 비밀번호입니다.');
      setModal(true);
    }
  };
  return (
    <View style={{}}>
      <ProfileResetPwd
        goBack={() => navigation.goBack('ProfileEdit')}
        pwdVisible={pwdVisible}
        setNewPwd={pwd => setNewPwd(pwd)}
        setPwdVisible={() => setPwdVisible(!pwdVisible)}
        setPwdCheck={pwd => setPwdCheck(pwd)}
        confirm={confirm}
      />
      <OneButtonModal
        modalOn={confirmFailedModal}
        modalOff={() => setModal(false)}
        message={errorMsg}
      />
    </View>
  );
};
