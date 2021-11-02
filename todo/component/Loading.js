import React from 'react';
import { View, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import { ActivityIndicator } from 'react-native-paper';
import { DPW } from '../config/dp';

export const Loading = props => {
  return (
    <Modal
      isVisible={props.modalOn}
      avoidKeyboard={true}
      transparent={true}
      style={styles.modal}>
        <View style={styles.outside}>
          <ActivityIndicator size="large" color="white"/>
        </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  choicebox: {
    alignItems: 'center',
    marginTop: 30 * DPW,
  },
  outside: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
