import React from 'react';
import {  Text, View, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, BackHandler,  } from 'react-native';

import { styles } from '../style/profileResetPwd';

export const ProfileResetPwd = (props) => {
  return (
    <KeyboardAvoidingView behavior="position" keyboardVerticalOffset="100">
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={props.goBack}
              style={styles.backBtnContainer}>
              <Image
                source={require('../../../../assets/images/back.png')}
                style={styles.backBtn}
              />
            </TouchableOpacity>
            <Text style={styles.headerText}> 비밀번호 수정</Text>

            <View>
              <Text style={styles.detailText}> 새로운 비밀번호 </Text>
              <View style={{ flexDirection: 'row' }}>
                <TextInput
                  placeholder="새로운 비밀번호"
                  style={styles.input}
                  secureTextEntry={props.pwdVisible}
                  onChangeText={ pwd => props.setNewPwd(pwd) }
                />
                <TouchableOpacity
                  onPress={props.setPwdVisible}
                  style={styles.pwdVisible}>
                  <Image
                    source={require('../../../../assets/images/show.jpg')}
                    style={styles.visibleImg}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.underLine} />
            </View>
            <View>
              <Text style={styles.detailText}> 비밀번호 확인 </Text>
              <View style={{ flexDirection: 'row' }}>
                <TextInput
                  placeholder="비밀번호 확인"
                  style={styles.input}
                  secureTextEntry={props.pwdVisible}
                  onChangeText={pwd => props.setPwdCheck(pwd)}
                />
                <TouchableOpacity
                  onPress={props.setPwdVisible}
                  style={styles.pwdVisible2}>
                  <Image
                    source={require('../../../../assets/images/show.jpg')}
                    style={styles.visibleImg}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.underLine} />
            </View>
            <View style={styles.btnContainer}>
              <TouchableOpacity onPress={props.confirm} style={styles.editBox}>
                <Text style={styles.editText}> 변 경 </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
  );
};
