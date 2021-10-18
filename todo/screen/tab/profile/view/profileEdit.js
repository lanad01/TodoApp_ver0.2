import React from 'react';
import {  Text,  View,  Image,  TextInput,  KeyboardAvoidingView,  TouchableOpacity,    } from 'react-native';
import { AuthContext } from '../../../../context/authcontext';
import { styles } from '../style/profileEditStyle';

const ProfileEdit = (props) => {
  const authContext = React.useContext(AuthContext);
  
  return (
    <KeyboardAvoidingView behavior="position" style={styles.keyBoardAvoid}>
      <View style={styles.backSide} />
      <View style={styles.topContainer}>
        <Image
          source={
            props.pictureSelected //프로필 이미지가 선택되어 있다면 true 없다면 default 이미지
              ? { uri: props.profileImage }
              : { uri: authContext.image }
          }
          style={styles.profile}
        />
        <TouchableOpacity
          onPress={props.setProfileModal}
          style={styles.cameraImg}>
          <Image source={require('../../../../assets/images/cameraEidt.png')}/>
        </TouchableOpacity>
      </View>

      {/* 하단부 디테일 */}
      <View style={styles.bottomContainer}>
        <View style={styles.categories}>
          <Text style={styles.text}> 이름(필수)</Text>
          <TextInput
            style={styles.input}
            placeholder={authContext.name}
            onChangeText={name => props.setName(name)}
          />
          <View style={styles.inputUnderLine} />
        </View>
        <View style={styles.categories}>
          <Text style={styles.text}> 이메일 주소</Text>
          <TextInput
            style={styles.input}
            keyboardType="email-address"
            placeholder={
              authContext.email != null //이메일 null값 처리
                ? authContext.email
                : '이메일은 공란입니다'
            }
            onChangeText={email => props.setEmail(email)}
          />
          <View style={styles.inputUnderLine} />
        </View>
        <View style={styles.categories}>
          <Text style={styles.text}> 직 장 </Text>
          <TextInput
            style={styles.input}
            placeholder={
              authContext.job != null ? authContext.job : '직장란은 공란입니다.'
            }
            onChangeText={job => props.setJob(job)}
          />
          <View style={styles.inputUnderLine} />
        </View>
        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
          <TouchableOpacity
            onPress={props.pwdChangeModal}
            style={styles.pwdChange}>
            <Text style={styles.pwdChangeText}> [ 비밀번호 변경 ]</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={props.saveConfirm} style={styles.editBox}>
            <Text style={styles.editText}> 저장 </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
export default ProfileEdit;
