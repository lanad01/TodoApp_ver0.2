import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';

import {  DELETE_TEMP,} from '../../sqliteConnection/userTableConnection';
import { styles } from './authScreenStyle';
import { Loading } from '../../component/Loading';
import OneButtonModal from '../../component/OneButtonModal';

export const AuthScreen = props => {
  const [loading, setLoading] = React.useState(false)
  return (
    
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerText}> TO DO LIST</Text>
      <View style={styles.bodyContainer}>
        <TextInput
          style={styles.idInput}
          onChangeText={ e => props.setId(e)}
          placeholder="아이디 입력해주세요."
          placeholderTextColor="#B0C4DE"
          maxLength={22}
        />
        <TextInput
          style={styles.pwdInput}
          onChangeText={e => props.setPwd(e)}
          secureTextEntry={true}
          placeholder="비밀번호를 입력해주세요"
          placeholderTextColor="#B0C4DE"
          maxLength={22}
        />
        <TouchableOpacity onPress={props.login} style={styles.loginBtnContainer}>
          <Text style={styles.loginBtn}> 로 그 인 </Text>
        </TouchableOpacity>
        <TouchableOpacity  onPress={props.assign}
          style={styles.loginBtnContainer}>
          <Text style={styles.loginBtn}> 회 원 가 입</Text>
        </TouchableOpacity>
        <Text style={styles.showText}></Text>
        <Text style={styles.showText}></Text>
        <GoogleSigninButton
          onPress={() => props.socialLogin('google')}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          style={styles.googleLogin}
        />
        <TouchableOpacity onPress={() => props.socialLogin('kakao')}>
          <Image
            source={require('../../assets/images/kakao_login_medium_wide.png')}
            style={styles.kakaoLogin}
          />
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={() => DELETE_TEMP()}>
          <Image
            source={require('../../assets/images/kakao_login_medium_wide.png')}
            style={{
              width: 260,
              height: 40,
              marginTop: 10,
              resizeMode: 'contain',
            }}
          />
        </TouchableOpacity> */}
      </View>

      <OneButtonModal
        modalOn={props.modalData.loginNotNullModal || props.modalData.loginUnmatchedModal}
        modalOff={() => {
          props.setModalData({loginNotNullModal : false});
          props.setModalData({setLoginUnmatchedModal : false});
        }}
        message={
          props.modalData.loginNotNullModal
            ? 'ID와 암호는 반드시 작성해주셔야합니다.' //Not null 에러일 경우
            : '아이디 혹은 비밀번호가 일치하지 않습니다.' // Not null이 아닌 미일치 에러일 경우
        }
      />
      <Loading modalOn={loading} modalOff={() => setLoading(false)} />
    </SafeAreaView>
  );
};
