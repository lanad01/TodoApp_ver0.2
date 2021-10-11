import React, { useState, useEffect, Component } from 'react';
import {  View, Text, StyleSheet, TouchableOpacity,} from 'react-native';
import Modal from 'react-native-modal';
import { ActivityIndicator } from 'react-native-paper';

export class Loading extends Component {
    constructor(props){
    super(props);
    }
    render() {
        return (
      <Modal
        isVisible={this.props.modalOn}
        avoidKeyboard={true}
        transparent={true}
        style={{ width:50, height:50, justifyContent: 'center', alignItems: 'center', alignSelf:'center' }}>
        <TouchableOpacity onPress={this.props.modalOff }>
          <View style={styles.outside}>
              <ActivityIndicator size='large'/>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }
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