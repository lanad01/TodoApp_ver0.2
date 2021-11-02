import React from 'react';
import {  View,  Text,  StyleSheet,  TouchableOpacity,  } from 'react-native';
import Modal from 'react-native-modal';
import { DPW } from '../config/dp';

const TwoButtonModal = (props) => {
  //two btn modal
  
  return (
    <Modal
      isVisible={props.modalOn}
      avoidKeyboard={true}
      transparent={true}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={styles.outside}>
          <View style={styles.validModal}>
            <Text style={styles.validText}>{props.message}</Text>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                style={styles.choicebox}
                onPress={props.modalOff}>
                <Text textAlign="center" style={styles.btn}>
                  돌아가기
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.choicebox} onPress={props.exitAppImple}>
                <Text textAlign="center" style={styles.btn}>
                  종 료
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
    </Modal>
  );
};

export default TwoButtonModal;

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
  },
  btn: {
    textAlign: 'center',
    fontFamily: 'BMJUA',
    fontSize: 36 * DPW,
    backgroundColor: 'white',
    borderRadius: 7,
    borderWidth: 5,
    width: 240 * DPW,
    paddingTop: 20 * DPW,
    marginHorizontal: 26 * DPW,
  },
  validModal: {
    width: 600 * DPW,
    height: 300 * DPW,
    backgroundColor: 'white',
    borderRadius: 10,
    borderColor: '#E0ffff',
    borderWidth: 9,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 19,
  },
  validText: {
    fontFamily: 'BMJUA',
    fontSize: 46 * DPW,
    textAlign: 'center',
    width: 440 * DPW,
  },
});
