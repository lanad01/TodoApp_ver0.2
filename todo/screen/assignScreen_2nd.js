import React, { useRef, useState, useContext, useEffect } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Modal from 'react-native-modal';
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';

import { DPW } from '../dp';
import { styles } from './styles/assignScreenPhotoStyle';
import { AuthContext } from '../context/authcontext';
import { DB, INSERT_USER_INFO } from '../sqliteConnection';

export default AssignScreen_2nd = ({ route, navigation }) => {
  console.log('Assign 2nd');
  const authContext = useContext(AuthContext);
  const nameRef = useRef(); // 유저네임 Null일 경우 focus용

  const { id, pwd, job, email } = route.params; // assignScreen에서 작성된 유저 정보
  const [pictureSelected, setPicture] = useState(false); // 프로필 사진이 지정되었는지 안되었는지 여부
  const [profileImage, setProfileImage] = useState(null); // 프로필 사진 image.path
  const [modalShow, setModal] = useState(false); // 프로필 사진 지정 방법 모달
  const [name, setName] = useState(null); // 유저네임
  const [nameIsNull, setNameIsNN] = useState(false); // 유저네임 Null 메시지

  const [rise, setRise] = useState(0);
  // 키보드가 사라지면 화면을 직접 내려버린다.
  useEffect(() => {
    Keyboard.addListener('keyboardDidHide', e => {
      setRise(0);
    });
    // console.log('KeyboardHide unSubscribe');
    // Keyboard.removeAllListeners('keyboardDidHide');
    return () => {};
  }, []);

  //image CropPicker Configure
  const cropPicker_Opt = () => {
    return { cropping: true, includeBase64: true };
  };

  // 갤러리에서 사진선택
  function pickOnePhoto() {
    ImagePicker.openPicker({ cropPicker_Opt })
      .then(image => {
        setPicture(true); // 사진선택 True
        console.log('pictureSelectd : ' + pictureSelected);
        setProfileImage(image.path); // Profile이미지를 갤러리에서 선택한 사진으로 변경
        setModal(!modalShow); //카메라 모달 종료
      })
      .catch(e => {
        //Null Handle
        if (e.code !== 'E_PICKER_CANCELLED') {
          console.log(e);
          Alert.alert(
            'Sorry, there was an issue attempting to get the image/video you selected. Please try again',
          );
        }
      });
  }
  // 사진 직접 찍기 선택
  function callCamera() {
    ImagePicker.openCamera({ cropPicker_Opt })
      .then(image => {
        setPicture(true); // 사진선택 True
        setProfileImage(image.path); // 찍은 camera image path를 프로필 이미지로 변경
        setModal(!modalShow); // 카메라 모달 종료
      })
      .catch(e => {
        //Null Handle
        if (e.code !== 'E_PICKER_CANCELLED') {
          console.log(e);
          Alert.alert(
            'Sorry, there was an issue attempting to get the image/video you selected. Please try again',
          );
        }
      });
  }
  // 최종 Insert
  const finalize = () => {
    if (name === null) {
      // 이름이 Null값
      nameRef.current.focus(); // NameInput란에 커서 처리
      setNameIsNN(true); // 이름 null error Modal On
    } else {
      DB.transaction(tx => {
        const current_time = moment().format('LL'); //현재 시간을 'llll'로 포맷하여 Stringify
        console.log(current_time);
        tx.executeSql(
          'INSERT INTO user_info (id, pwd, job, name, email, image, regi_date) VALUES (?,?,?,?,?,?,?)',
          [id, pwd, job, name, email, profileImage, current_time],
          (tx, res) => {
            select(); //Insert된 값을 authContext에 저장
          },
          error => {
            console.log('Insert Failed' + error);
          },
        );
      });
    }
  };
  //Insert 후 유저정보를 authContext에 저장
  const select = () => {
    let myFirstPromise = new Promise((resolve, reject) => {
      const result = INSERT_USER_INFO(id);
      setTimeout(() => {
        resolve(result);
      }, 2000);
    }).catch(err => {
      console.log('Error occur in promise' + err);
    });
    myFirstPromise.then(result => {
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
      Keyboard.removeAllListeners('keyboardDidhide');
      navigation.replace('MainScreen');
    });
    
  };
  return (
    <View style={styles.scrollContainer}>
      <View style={styles.headContainer}>
        <Text style={styles.headerText}>
          사진과 이름을 등록해주세요. {pictureSelected}
        </Text>
        <TouchableOpacity onPress={() => setModal(!modalShow)}>
          <Image
            source={
              pictureSelected
                ? { uri: profileImage }
                : require('../assets/profile3.jpg')
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
          onFocus={() => setRise(90)}
        />
        <Text style={styles.nameInfo}> 이름은 반드시 적어주셔야해요! </Text>
        <Text style={styles.Info}>
          프로필 정보(사진, 이름)는 회원 식별, 커뮤니케이션 등의 목적으로
          활용됩니다.{' '}
        </Text>
        <TouchableOpacity onPress={finalize} style={styles.footer}>
          <Text style={styles.btn}>등 록 하 기 </Text>
        </TouchableOpacity>
        <Modal isVisible={modalShow} avoidKeyboard={true} transparent={true}>
          <View>
            <TouchableOpacity onPress={pickOnePhoto} style={styles.choicebox}>
              <Text textAlign="center" style={styles.photochoose}>
                갤러리에서 사진 선택!{' '}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={callCamera} style={styles.choicebox}>
              <Text style={styles.photochoose}>사진 촬영</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModal(!modalShow)}
              style={styles.choicebox}>
              <Text textAlign="center" style={styles.photochoose}>
                나 가 기{' '}
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </View>
  );
};
