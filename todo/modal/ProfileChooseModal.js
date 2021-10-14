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
import Modal from 'react-native-modal';
import { styles } from '../screen/assign/style/assignScreenPhotoStyle';

export const ProfileChooseModal = props => {
    const cropPicker_Opt = () => {
        return { cropping: true, includeBase64: true };
      };
    
  function pickOnePhoto() {
    ImagePicker.openPicker({ cropPicker_Opt })
      .then(image => {
        props.setPicture(true); // 사진선택 True
        props.setProfileImage(image.path); // Profile이미지를 갤러리에서 선택한 사진으로 변경
        props.modalOff() //카메라 모달 종료
      })
      .catch(e => {
        //Null Handle
        console.log("Profile Edit / call camera Failed : " + JSON.stringify(e))
        if (e.code !== 'E_PICKER_CANCELLED') {
          console.log(e);
          Alert.alert('Issue attempting to get the image/video you selected');
        }
      });
  }
  // 사진 직접 찍기 선택
  function callCamera() {
    ImagePicker.openCamera({ cropPicker_Opt })
      .then(image => {
        props.setPicture(true); // 사진선택 True
        props.setProfileImage(image.path); // Profile이미지를 갤러리에서 선택한 사진으로 변경
        props.modalOff() //카메라 모달 종료
      })
      .catch(e => {
        //Null Handle
        console.log("Profile Edit / call camera Failed : " + JSON.stringify(e))
        if (e.code !== 'E_PICKER_CANCELLED') {
          console.log(e);
          Alert.alert('Issue attempting to get the image/video you selected');
        }
      });
  }
  return (
    <Modal isVisible={props.modalOn} avoidKeyboard={true} transparent={true}>
      <View>
        <TouchableOpacity onPress={pickOnePhoto} style={styles.choicebox}>
          <Text textAlign="center" style={styles.photochoose}>
            갤러리에서 사진 선택!{' '}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={callCamera} style={styles.choicebox}>
          <Text style={styles.photochoose}>사진 촬영</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={props.modalOff} style={styles.choicebox}>
          <Text textAlign="center" style={styles.photochoose}>
            나 가 기{' '}
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};
