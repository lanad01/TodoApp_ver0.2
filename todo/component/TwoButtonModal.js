import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { BLUE10, BLUE20, MIDNIGHT_BLUE, RED, WHITE } from '../config/color';
import { DPW } from '../config/dp';

const TwoButtonModal = props => {
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
            <TouchableOpacity style={styles.choicebox} onPress={props.modalOff}>
              <Text textAlign="center" style={styles.cancelBtn}>
                취 소
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.choicebox} onPress={() => props.confirm('Pa')}>
              <Text textAlign="center" style={styles.btn}>
                확 인
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
    backgroundColor: BLUE20,
    borderRadius: 7,
    borderWidth: 2,
    width: 200 * DPW,
    marginHorizontal: 11 * DPW,
    paddingVertical: 10*DP,
    color: WHITE,
    textAlignVertical:'center'
  },
  cancelBtn: {
    textAlign: 'center',
    fontFamily: 'BMJUA',
    fontSize: 36 * DPW,
    backgroundColor: RED,
    borderRadius: 7,
    borderWidth: 2,
    width: 200 * DPW,
    marginHorizontal: 11 * DPW,
    paddingVertical:10*DP,
    color: WHITE,
    textAlignVertical:'center',
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
