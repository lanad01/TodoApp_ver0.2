import React, { useState, useEffect, Component } from 'react';
import {  View, Text, StyleSheet, TouchableOpacity,} from 'react-native';
import Modal from 'react-native-modal';
import { ActivityIndicator } from 'react-native-paper';

export const Loading = props => {
        return (
      <Modal
        isVisible={props.modalOn}
        avoidKeyboard={true}
        transparent={true}
        style={{ width:50, height:50, justifyContent: 'center', alignItems: 'center', alignSelf:'center' }}>
        <TouchableOpacity onPress={props.modalOff }>
          <View style={styles.outside}>
              <ActivityIndicator size='large'/>
          </View>
        </TouchableOpacity>
      </Modal>
    );
}
const styles=StyleSheet.create({
    choicebox:{
        alignItems:'center',
        marginTop:15,
      },
      outside:{
        justifyContent:'center',
        alignItems:'center',
        zIndex:1,
        opacity:1
      }, 
})