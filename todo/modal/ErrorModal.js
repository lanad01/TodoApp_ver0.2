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

export class ErrorModal extends Component {
    constructor(props){
    super(props);
    }
    render() {
    
        return (
      <Modal
        isVisible={this.props.modalOn}
        avoidKeyboard={true}
        transparent={true}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity onPress={this.props.modalOff }>
          <View style={styles.outside}>
            <View style={styles.validModal}>
              <Text style={styles.validText}>
                {this.props.message}
              </Text>
              <TouchableOpacity style={styles.choicebox} onPress={this.props.modalOff }>
                <Text textAlign="center" style={styles.photochoose}>
                  나 가 기{' '}
                </Text>
              </TouchableOpacity>
            </View>
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
        width:400,
        height:700,
        justifyContent:'center',
        alignItems:'center',
        zIndex:1
      },
      photochoose:{
        textAlign:"center",
        fontFamily:"BMJUA",
        fontSize:23,
        backgroundColor:'white',
        borderRadius:7,
        borderWidth:5,
        width:150,
        borderWidth:5,
        paddingTop:10,
        zIndex:4,
      },
      validModal:{
        width:300,
        height:150,
        backgroundColor:'white',
        borderRadius:10,
        justifyContent:'center',
        alignItems:'center',
        shadowOffset:{
          width:0,
          height:9
        },
        shadowColor:"#191970",
        shadowRadius: 12.35,
        elevation: 19,
        zIndex:3,
      },
      validText:{
        fontFamily:'BMJUA',
        fontSize:18,
        textAlign:'center',
        width:190
      },  
})