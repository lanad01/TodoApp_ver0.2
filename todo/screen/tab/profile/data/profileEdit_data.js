import React from 'react';
import { View } from 'react-native';

import { AuthContext } from '../../../../context/authcontext';
import { PwdChangeModal } from '../../../../modal/PwdChangeModal';
import { UPDATE_USER_INFO } from '../../../../sqliteConnection/userTableConnection';
import OneButtonModal from '../../../../modal/OneButtonModal';
import { ProfileChooseModal } from '../../../../modal/ProfileChooseModal';
import ProfileEdit from '../view/profileEdit';

export const ProfileEdit_Data = ({ navigation }) => {
  const authContext = React.useContext(AuthContext);
  const [pictureSelected, setPicture] = React.useState(false); //지정된 프로필이미지의 존재여부
  const [profileImage, setProfileImage] = React.useState(authContext.image); // DB에 등록된 프로필 이미지 path
  const [newName, setNewName] = React.useState(null); // not null
  const [newEmail, setNewEmail] = React.useState(null); // 바꿀 email
  const [newJob, setNewJob] = React.useState(null); // 바꿀 job

  const [errorModal, setErrorModal] = React.useState(false); //이름 불일치 에러 메시지 모달
  const [profileModal, setProfileModal] = React.useState(false); //이미지 설정 모달
  const [pwdChangeModal, setPwdChangeModal] = React.useState(false); //비밀번호 변경 모달

  //DB에서 받아온 image가 null일 경우의 대체 이미지 설정
  if (authContext.image == null) {
    console.log('auth image Null');
    authContext.image =
      'https://icon-library.com/images/profile-icon/profile-icon-7.jpg';
  }

  // 프로필 수정 완료 버튼 Press
  const saveConfirm = () => {
    if (newName === null) {
      // 이름 Null 분기
      console.log('Errormodal');
      setErrorModal(true);
    } else if (newName != null) {
      saveBtn();
    }
  };

  // 프로필 수정 최종 분기
  function saveBtn() {
    if (profileImage === undefined) {
      // 건드리지 않았을 때
      console.log('건드리지 않았을 때');
      setProfileImage(authContext.image);
    }
    if (profileImage != authContext.image) {
      //프로필 이미지를 수정했을 때
      console.log('프로필을 수정했을 때');
      authContext.image = profileImage;
    }
    const updated_userInfo = {
      newName: newName,
      newEmail: newEmail,
      newJob: newJob,
      newImage: authContext.image,
      user_no: authContext.user_no,
    };
    UPDATE_USER_INFO(updated_userInfo); //user 정보 update SQLite 접속
    authContext.name = newName;
    authContext.email = newEmail;
    authContext.job = newJob;
    navigation.replace('ProfileMain');
  }
  return (
    <View style={{flex:1}}> 
      <ProfileEdit
        pictureSelected={pictureSelected}
        profileImage={profileImage}
        setProfileModal={() => setProfileModal(!profileModal)}
        setName={name => setNewName(name)}
        setEmail={email => setNewEmail(email)}
        setJob={job => setNewJob(job)}
        pwdChangeModal={() => setPwdChangeModal(!pwdChangeModal)}
        saveConfirm={saveConfirm}
      />
      <ProfileChooseModal
        modalOn={profileModal}
        modalOff={() => setProfileModal(false)}
        setPicture={pictureValue => setPicture(pictureValue)}
        setProfileImage={profileImage => setProfileImage(profileImage)}
      />
      <OneButtonModal
        modalOn={errorModal}
        message="이름은 반드시 적어주셔야 합니다."
        modalOff={() => setErrorModal(false)}
      />
      <PwdChangeModal
        modalOn={pwdChangeModal}
        modalOff={() => setPwdChangeModal(false)}
        pwdVerify={authContext.pwd}
        resetPwd={() => {
          navigation.push('ProfileResetPwd');
          setErrorModal(false);
          setProfileModal(false);
          setPwdChangeModal(false);
        }}
      />
    </View>
  );
};
