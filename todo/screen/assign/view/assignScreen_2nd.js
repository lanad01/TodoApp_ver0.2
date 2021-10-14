import React, { useRef, useState, useContext, useEffect } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  Keyboard,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Modal from 'react-native-modal'
import AsyncStorage from '@react-native-community/async-storage';

import { DPW } from '../../../config/dp';
import { styles } from '../style/assignScreenPhotoStyle';
import { AuthContext } from '../../../context/authcontext';
import { SELECT_USER_INFO_BY_ID, INSERT_USER} from '../../../userTableConnection';
import { ProfileChooseModal } from '../../../modal/ProfileChooseModal';

export default AssignScreen_2nd = ({ route, navigation }) => {
  console.log('Assign 2nd');
  const authContext = useContext(AuthContext);
  const nameRef = useRef(); // 유저네임 Null일 경우 focus용

  const { id, pwd, job, email } = route.params; // assignScreen에서 작성된 유저 정보
  const [pictureSelected, setPicture] = useState(false); // 프로필 사진이 지정되었는지 안되었는지 여부
  const [profileImage, setProfileImage] = useState(null); // 프로필 사진 image.path
  const [profileChooseModal, setProfileChooseModal] = useState(false); // 프로필 사진 지정 방법 모달
  const [name, setName] = useState(null); // 유저네임
  const [nameIsNull, setNameIsNN] = useState(false); // 유저네임 Null 메시지

  const [rise, setRise] = useState(0);
  // 키보드가 사라지면 화면을 직접 내려버린다.
  useEffect(() => {
    Keyboard.addListener('keyboardDidHide', e => {
      setRise(0);
    });
    Keyboard.addListener('keyboardDidShow', e => {
      setRise(90)
    })
    return () => {
      Keyboard.removeAllListeners('keyboardDidHide')
      Keyboard.removeAllListeners('keyboardDidShow')
    };
  }, []);

  // 최종 Insert
  const finalize = async () => {
    if (name === null) { // 이름 Null?
      nameRef.current.focus(); // NameInput란에 커서 처리
      setNameIsNN(true); // 이름 null error Modal On "이름을 채워주세요"
    } else {
      const user_info = { // INSERT SQL에 보낼 유저정보 인자
        id: id,
        pwd : pwd,
        name : name,
        email : email,
        job: job,
        image : profileImage,
      } 
      INSERT_USER(user_info)
      select()
    }
  };
  //Insert 후 유저정보를 authContext에 저장
  const select = async () => {
      const result = await SELECT_USER_INFO_BY_ID(id);
      console.log("result check assin2" +result.id)
      console.log("result check assin2" +result.pwd)
      console.log("result check assin2" +result.name)
      console.log("result check assin2" +result.email)
      authContext.id = result.id;
      authContext.name = result.name;
      authContext.email = result.email;
      authContext.regi_date = result.regi_date;
      authContext.job =result.job;
      authContext.autologin = false;
      authContext.user_no = result.user_no
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
    <View style={styles.scrollContainer}>
      <View style={styles.headContainer}>
        <Text style={styles.headerText}>
          사진과 이름을 등록해주세요. {pictureSelected}
        </Text>
        <TouchableOpacity onPress={() => setProfileChooseModal(!profileChooseModal)}>
          <Image
            source={
              pictureSelected
                ? { uri: profileImage }
                : require('../../../assets/images/profile3.jpg')
            }
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>
      <View
        style={{
          height: 700 * DPW,
          backgroundColor: '#191970',
          marginTop: 90 * DPW,
          alignItems: 'center',
          bottom: rise,
        }}>
        <TextInput
          maxLength={10}
          backgroundColor="white"
          placeholderTextColor={nameIsNull ? 'red' : '#dcdcdc'}
          style={styles.nameInput}
          placeholder=" &nbsp;이름을 작성해주세요."
          onChangeText={name => setName(name)}
          ref={nameRef}
        />
        <Text style={styles.nameInfo}> 이름은 반드시 적어주셔야해요! </Text>
        <Text style={styles.Info}>
          프로필 정보(사진, 이름)는 회원 식별, 커뮤니케이션 등의 목적으로
          활용됩니다.{' '}
        </Text>
        <TouchableOpacity onPress={finalize} style={styles.footer}>
          <Text style={styles.btn}>등 록 하 기 </Text>
        </TouchableOpacity>
        <ProfileChooseModal 
          modalOn={profileChooseModal}
          modalOff={ () => setProfileChooseModal(false)}
          setPicture={ pictureValue => setPicture(pictureValue)}
          setProfileImage= { profileImage => setProfileImage(profileImage)}
        />
      </View>
    </View>
  );
};
