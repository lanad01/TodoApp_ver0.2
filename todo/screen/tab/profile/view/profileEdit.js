import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Modal from 'react-native-modal';

import { AuthContext } from '../../../../context/authcontext';
import { PwdChangeModal } from '../../../../modal/PwdChangeModal';
import { UPDATE_USER_INFO } from '../../../../sqliteConnection';
import { styles } from '../style/profileEditStyle';
import OneButtonModal from '../../../../modal/OneButtonModal';

const ProfileEdit = ({ navigation }) => {
  const authContext = React.useContext(AuthContext);
  const [pictureSelected, setPicture] = useState(false); //지정된 프로필이미지의 존재여부
  const [profileImage, setProfileImage] = useState(authContext.image); // DB에 등록된 프로필 이미지 path
  const [newName, setNewName] = useState(null); // not null
  const [newEmail, setNewEmail] = useState(null); // 바꿀 email
  const [newJob, setNewJob] = useState(null); // 바꿀 job

  const [errorModal, setErrorModal] = useState(false); //이름 불일치 에러 메시지 모달
  const [profileModal, setProfileModal] = useState(false); //이미지 설정 모달
  const [pwdChangeModal, setPwdChangeModal] = useState(false); //비밀번호 변경 모달
  //DB에서 받아온 image가 null일 경우의 대체 이미지 설정
  if (authContext.image == null) {
    console.log('auth image Null');
    authContext.image =
      'https://icon-library.com/images/profile-icon/profile-icon-7.jpg';
  }

  const cropPicker_Opt = () => {
    return { cropping: true, includeBase64: true };
  }; //Img crop picker Option

  function pickOnePhoto() {
    //갤러리에서 선택
    ImagePicker.openPicker({ cropPicker_Opt })
      .then(image => {
        setPicture(true);
        setProfileImage(image.path);
        setProfileModal(!profileModal);
      })
      .catch(e => {
        console.log("Profile Edit / pick one Photo Failed : " + JSON.stringify(e))
        //Null Handle
        if (e.code !== 'E_PICKER_CANCELLED') {
          console.log(e);
          Alert.alert('Issue occured to get the image you selected. Please try again');
        }
      });
  }
  function callCamera() {
    ImagePicker.openCamera({ cropPicker_Opt })
      .then(image => {
        setPicture(true);
        setProfileImage(image.path);
        setProfileModal(!profileModal);
      })
      .catch(e => {
        console.log("Profile Edit / call camera Failed : " + JSON.stringify(e))
        // 사진찍기 값이 널일 경우
        if (e.code !== 'E_PICKER_CANCELLED') {
          console.log(e);
          Alert.alert('Issue occured to get the image you selected. Please try again')
        }
      });
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
    <KeyboardAvoidingView behavior="position" style={styles.keyBoardAvoid}>
      <View style={styles.backSide} />
      <View style={styles.topContainer}>
        <View style={styles.backBtnView}>
          {/* <TouchableOpacity onPress={() => navigation.goBack('ProfileMain')}>
            <Image
              source={require('../assets/back.png')}
              style={styles.backImg}
            />
          </TouchableOpacity> */}
        </View>

        <Image
          source={
            pictureSelected //프로필 이미지가 선택되어 있다면 true 없다면 default 이미지
              ? { uri: profileImage }
              : { uri: authContext.image }
          }
          style={styles.profile}
        />
        <TouchableOpacity
          onPress={() => setProfileModal(!profileModal)}
          style={styles.cameraImg}>
          <Image source={require('../../../../assets/images/cameraEidt.png')} style={{}} />
        </TouchableOpacity>
      </View>

      {/* 하단부 디테일 */}
      <View style={styles.bottomContainer}>
        <View style={styles.categories}>
          <Text style={styles.text}> 이름(필수)</Text>
          <TextInput
            style={styles.input}
            placeholder={authContext.name}
            onChangeText={name => setNewName(name)}
          />
          <View style={styles.inputUnderLine} />
        </View>
        <View style={styles.categories}>
          <Text style={styles.text}> 이메일 주소</Text>
          <TextInput
            style={styles.input}
            keyboardType="email-address"
            placeholder={
              authContext.email != null //이메일 null값 처리
                ? authContext.email
                : '이메일은 공란입니다'
            }
            onChangeText={email => setNewEmail(email)}
          />
          <View style={styles.inputUnderLine} />
        </View>
        <View style={styles.categories}>
          <Text style={styles.text}> 직 장 </Text>
          <TextInput
            style={styles.input}
            placeholder={
              authContext.job != null ? authContext.job : '직장란은 공란입니다.'
            }
            onChangeText={job => setNewJob(job)}
          />
          <View style={styles.inputUnderLine} />
        </View>
        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
          <TouchableOpacity
            onPress={() => setPwdChangeModal(true)}
            style={styles.pwdChange}>
            <Text style={styles.pwdChangeText}> [ 비밀번호 변경 ]</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={saveConfirm} style={styles.editBox}>
            <Text style={styles.editText}> 저장 </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        isVisible={profileModal}
        avoidKeyboard={true}
        transparent={true}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View>
          <TouchableOpacity onPress={pickOnePhoto} style={styles.choicebox}>
            <Text textAlign="center" style={styles.photochoose}>
              갤러리에서 사진 선택!
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={callCamera} style={styles.choicebox}>
            <Text style={styles.photochoose}>사진 촬영</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setProfileModal(!profileModal)}
            style={styles.choicebox}>
            <Text textAlign="center" style={styles.photochoose}>
              나 가 기
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
          navigation.push('ProfileResetPwd')
          setErrorModal(false)
          setProfileModal(false)
          setPwdChangeModal(false)
        }}
      />
    </KeyboardAvoidingView>
  );
};
export default ProfileEdit;
