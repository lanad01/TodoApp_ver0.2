//  C:\Users\user01>keytool -exportcert -alias androiddebugkey -keystore
// TodoApp/android/app/debug.keystore -storepass android -keypass android | openssl sha1 -binary | openssl base64
// 이걸 기억해 상우야 디버그 키스토어 적합한 해시 키 찾는 디렉토리는 위에야
import React, { useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import {
  getProfile as getKakaoProfile,
  login,
  logout,
  unlink,
} from '@react-native-seoul/kakao-login';



export const SIGN_WITH_KAKAO = async () => {
  const token = await login();

  console.log("toKEN?"+token.accessToken);
  return token
};

const kakaoLogin = () => {
  console.log('Dddd');

  const [result, setResult] = useState('');
  const signInWithKakao = async () => {
    const token = await login();

    setResult(JSON.stringify(token));
    console.log(result);
    console.log(token.accessToken);
  };
  const signOutWithKakao = async () => {
    const message = await logout();

    setResult(message);
    console.log(result);
  };
  const getProfile = async () => {
    const profile = await getKakaoProfile();

    setResult(JSON.stringify(profile));
    console.log(profile.nickname);
    console.log(profile.id);
  };
  return (
    <View>
      <TouchableOpacity onPress={signInWithKakao}>
        <View>
          <Text
            style={{
              backgroundColor: 'yellow',
              width: 100,
              height: 100,
              justifyContent: 'center',
              marginLeft: 100,
              borderColor: 'black',
              borderWidth: 10,
            }}>
            KKao login
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={signOutWithKakao}>
        <View>
          <Text
            style={{
              backgroundColor: 'yellow',
              width: 100,
              height: 100,
              justifyContent: 'center',
              marginLeft: 100,
              borderColor: 'black',
              borderWidth: 10,
              marginTop: 100,
            }}>
            Logout
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={getProfile}>
        <View>
          <Text
            style={{
              backgroundColor: 'yellow',
              width: 100,
              height: 100,
              justifyContent: 'center',
              marginLeft: 100,
              borderColor: 'black',
              borderWidth: 10,
              marginTop: 52,
            }}>
            getProfile
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

