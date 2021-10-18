import React, { useRef, useState, useContext } from 'react';
import {
  View,
  Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import { AuthContext } from '../../../context/authcontext';
import {
  SELECT_USER_INFO_BY_ID,
  INSERT_USER,
} from '../../../sqliteConnection/userTableConnection';
import { ProfileChooseModal } from '../../../screen/modal/ProfileChooseModal';
import AssignScreen_2nd from '../view/assign_2nd';

export default Assign_2nd_data = ({ route, navigation }) => {
  console.log('Assign 2nd');
  const authContext = React.useContext(AuthContext);
  const nameRef = React.useRef(); // 유저네임 Null일 경우 focus용

  const { id, pwd, job, email } = route.params; // assignScreen에서 작성된 유저 정보
  const [pictureSelected, setPicture] = React.useState(false); // 프로필 사진이 지정되었는지 안되었는지 여부
  const [profileImage, setProfileImage] = React.useState(null); // 프로필 사진 image.path
  const [profileChooseModal, setProfileChooseModal] = React.useState(false); // 프로필 사진 지정 방법 모달
  const [name, setName] = React.useState(null); // 유저네임
  const [nameIsNull, setNameIsNN] = React.useState(false); // 유저네임 Null 메시지
  // 최종 Insert
  const finalize = async () => {
    if (name === null) {
      // 이름 Null?
      nameRef.current.focus(); // NameInput란에 커서 처리
      setNameIsNN(true); // 이름 null error Modal On "이름을 채워주세요"
    } else {
      const user_info = {
        // INSERT SQL에 보낼 유저정보 인자
        id: id,
        pwd: pwd,
        name: name,
        email: email,
        job: job,
        image: profileImage,
      };
      INSERT_USER(user_info);
      select();
    }
  };
  //Insert 후 유저정보를 authContext에 저장
  const select = async () => {
    const result = await SELECT_USER_INFO_BY_ID(id);
    authContext.id = result.id;
    authContext.name = result.name;
    authContext.email = result.email;
    authContext.regi_date = result.regi_date;
    authContext.job = result.job;
    authContext.autologin = false;
    authContext.user_no = result.user_no;
    AsyncStorage.setItem('user_no', JSON.stringify(authContext.user_no), () => {
      // user_no 변수로 user_no값이 들어가 있는 user 저장
      console.log('유저 id 저장');
    });
    authContext.image = result.image;
    Keyboard.removeAllListeners('keyboardDidHide');
    Keyboard.removeAllListeners('keyboardDidShow');
    navigation.replace('TabRoot');
  };
  return (
    <View>
      <AssignScreen_2nd
        pictureSelected={pictureSelected}
        profileImage={profileImage}
        profileModal={() => setProfileChooseModal(!profileChooseModal)}
        setName={name => setName(name)}
        nameIsNull={nameIsNull}
        finalize={finalize}
        nameRef={nameRef}
      />
      <ProfileChooseModal
        modalOn={profileChooseModal}
        modalOff={() => setProfileChooseModal(false)}
        setPicture={pictureValue => setPicture(pictureValue)}
        setProfileImage={profileImage => setProfileImage(profileImage)}
      />
    </View>
  );
};
