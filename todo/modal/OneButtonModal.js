import React from 'react';
import {  View,  Text,  StyleSheet,  TouchableOpacity,   } from 'react-native';
import Modal from 'react-native-modal';
import { DPW } from '../config/dp';
const OneButtonModal = props => {

  return (
    <Modal
      isVisible={props.modalOn}
      avoidKeyboard={true}
      transparent={true}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity onPress={props.modalOff}>
        <View style={styles.outside}>
          <View style={styles.validModal}>
            <Text style={styles.validText}>{props.message}</Text>
            <TouchableOpacity
              style={styles.choicebox}
              onPress={props.modalOff}>
              <Text textAlign="center" style={styles.photochoose}>
                나 가 기
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
export default OneButtonModal

const styles = StyleSheet.create({
  choicebox: {
    alignItems: 'center',
    marginTop: 30 * DPW,
  },
  outside: {
    width: 800 * DPW,
    height: 1400 * DPW,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  photochoose: {
    textAlign: 'center',
    fontFamily: 'BMJUA',
    fontSize: 46 * DPW,
    backgroundColor: 'white',
    borderRadius: 7,
    borderWidth: 5,
    width: 300 * DPW,
    borderWidth: 5,
    paddingTop: 20 * DPW,
    zIndex: 4,
  },
  validModal: {
    width: 600 * DPW,
    height: 300 * DPW,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
  },
  validText: {
    fontFamily: 'BMJUA',
    fontSize: 36 * DPW,
    textAlign: 'center',
    elevation: 19,
    width: 380 * DPW,
  },
});
