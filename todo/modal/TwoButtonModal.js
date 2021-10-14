import React, { useState, useEffect, Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';

const TwoButtonModal = (props) => {
  //two btn modal
  
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
      </TouchableOpacity>
    </Modal>
  );
};

export default TwoButtonModal;

const styles = StyleSheet.create({
  choicebox: {
    alignItems: 'center',
    marginTop: 15,
  },
  outside: {
    width: 400,
    height: 700,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  btn: {
    textAlign: 'center',
    fontFamily: 'BMJUA',
    fontSize: 18,
    backgroundColor: 'white',
    borderRadius: 7,
    borderWidth: 5,
    width: 120,
    borderWidth: 5,
    paddingTop: 10,
    marginHorizontal: 13,
    zIndex: 4,
  },
  validModal: {
    width: 300,
    height: 150,
    backgroundColor: 'white',
    borderRadius: 10,
    borderColor: '#E0ffff',
    borderWidth: 9,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 19,
    zIndex: 3,
  },
  validText: {
    fontFamily: 'BMJUA',
    fontSize: 23,
    textAlign: 'center',
    width: 220,
  },
});
