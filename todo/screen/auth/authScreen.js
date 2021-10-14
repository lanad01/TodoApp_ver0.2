import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import {
  getProfile as getKakaoProfile,
  login as kakaoLogin,
} from '@react-native-seoul/kakao-login';

import { AuthContext } from '../../context/authcontext';
import {
  SELECT_USER_INFO_BY_USERNO,
  LOGIN_VALIDATION,
  SELECT_USER_INFO_BY_ID,
  DELETE_TEMP,
  SOCIAL_LOGIN,
} from '../../sqliteConnection/userTableConnection';
import { styles } from './authScreenStyle';
import { Loading } from '../../modal/Loading';
import OneButtonModal from '../../modal/OneButtonModal';

GoogleSignin.configure({}); //구글로그인 configure

export const authScreen = ({ navigation }) => {
  const authContext = React.useContext(AuthContext);
  const [loginNotNullModal, setLoginNotNullModal] = React.useState(false); // 아이디 비밀번호 null발생 시
  const [loginUnmatchedModal, setLoginUnmatchedModal] = React.useState(false); //비밀번호만 오류일 시
  const [loading, setLoading] = React.useState(false); //로딩화면
  const [id, setId] = React.useState('');
  const [pwd, setPwd] = React.useState('');
  React.useEffect(() => {
    const subscribe = navigation.addListener('focus', () => {
      autoLogin(); // autologin값이 true일 경우 loading창 유지 => DB Access 완료 이후 로딩 종료
      // autologin값이 false일 경우 loading창 바로 종료 => Login 직접 시도 On
    });
    return subscribe;
  }, []);
  //자동 로그인
  autoLogin = async () => {
    try {
      const user_no = await AsyncStorage.getItem('user_no');
      if (user_no != null) {
        //Async에 남아있는 user_no가 있는 경우
        console.log('AuthScreen / AutoLogin / Async Value :' + user_no);
        getInfoWhenAutoLogin(user_no);
      } else {
        console.log('AuthScreen / AutoLogin : Async Null  - Login Required');
      }
    } catch (error) {
      console.log(
        'AuthScreen / AutoLogin : GetAsync Failed' + JSON.stringify(error),
      );
    }
  };

  //자동로그인 시 authContext에 저장하기 위한 user정보
  const getInfoWhenAutoLogin = async user_no => {
    try {
      const userInfo = await SELECT_USER_INFO_BY_USERNO(user_no);
      send_to_context(userInfo);
      authContext.autologin = true; //자동로그인이므로 autologin값 true
      // AsyncStorage.setItem('user_no', JSON.stringify(authContext.user_no)); - 이미 존재 필요없다
      navigation.replace('TabRoot');
    } catch (err) {
      console.log(
        'AuthScreen / 자동로그인 유저 data get Failed' + JSON.stringify(err),
      );
    }
  };

  //일반 로그인
  const login = async () => {
    try {
      if (id === null || pwd === null) {
        // id pwd가 Null일 경우
        setLoginNotNullModal(true);
      } else {
        const dupCount = await LOGIN_VALIDATION(id, pwd); //result : 작성된 ID PWD와 일치하는 유저의 COUNT
        console.log('count ' + dupCount);
        if (dupCount > 0) {
          //최종일치한 유저가 존재한 경우
          console.log('최종일치 유저 수 : ' + dupCount);
          getUser_no();
        } else if (dupCount == 0) {
          // 최종일치 Failed = VALIDATION FAILED
          console.log('pwd and inputpwd not matched');
          setLoginUnmatchedModal(true);
        }
      }
    } catch (err) {
      console.log('일반 로그인 오류 ' + err);
    }
  };

  //일반 로그인 성공 시 context에 담을 user 정보 get
  const getUser_no = async () => {
    setLoading(true);
    const userInfo = await SELECT_USER_INFO_BY_ID(id);
    AsyncStorage.setItem('user_no', JSON.stringify(userInfo.user_no)); // 자동로그인이 아니므로 필요
    send_to_context(userInfo);
    authContext.autologin = false;
    setLoading(false);
    navigation.replace('TabRoot');
    // replace 새로운 스택route로 바꾸기 때문에 authScreen이 stack Index에 존재하지 않게 된다
  };

  //소셜 로그인
  const socialLogin = async type => {
    console.log('Socail Type  : ' + type);
    let social_id = ''; // id 중복 체크 및 SELECT인자
    if (type == 'kakao') {
      try {
        const token = await kakaoLogin();
        if (token != null) {
          // 카카오 로그인 성공
          const kakao_userInfo = await getKakaoProfile();
          SOCIAL_LOGIN(kakao_userInfo, 'kakao');
          social_id = kakao_userInfo.id;
        }
      } catch (err) {
        console.log('Kakao login failed' + JSON.stringify(err));
      }
    } else if ((type = 'google')) {
      try {
        await GoogleSignin.hasPlayServices();
        const google_userInfo = await GoogleSignin.signIn(); //선택한 구글 아이디의 정보 객체
        if (google_userInfo.user.id != null) {
          SOCIAL_LOGIN(google_userInfo, 'google');
          social_id = google_userInfo.user.id;
        }
      } catch (err) {
        console.log('Google login failed ' + JSON.stringify(err));
      }
    }
    let social_login_user_info = {};
    setTimeout(async () => {
      social_login_user_info = await SELECT_USER_INFO_BY_ID(social_id);
      send_to_context(social_login_user_info);
      AsyncStorage.setItem(
        'user_no',
        JSON.stringify(social_login_user_info.user_no),
      ); // 필요
      // context 값 선언 방법 변경 권장 export
      authContext.autologin = false;
      authContext.login_route = type; // 구글로그인 루트 설정
      navigation.replace('TabRoot');
    }, 1000);
    
  };

  //DB에서 얻어온 userInfo를 context에 저장
  const send_to_context = userInfo => {
    authContext.user_no = userInfo.user_no;
    authContext.id = userInfo.id;
    authContext.pwd = userInfo.pwd;
    authContext.name = userInfo.name;
    authContext.email = userInfo.email;
    authContext.job = userInfo.job;
    authContext.regi_date = userInfo.regi_date;
    authContext.image = userInfo.image;
  };
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerText}> TO DO LIST</Text>
      <View style={styles.bodyContainer}>
        <TextInput
          style={styles.idInput}
          onChangeText={id => setId(id)}
          placeholder="아이디 입력해주세요."
          placeholderTextColor="#B0C4DE"
          maxLength={22}
        />
        <TextInput
          style={styles.pwdInput}
          onChangeText={pwd => setPwd(pwd)}
          secureTextEntry={true}
          placeholder="비밀번호를 입력해주세요"
          placeholderTextColor="#B0C4DE"
          maxLength={22}
        />
        <TouchableOpacity onPress={login} style={styles.loginBtnContainer}>
          <Text style={styles.loginBtn}> 로 그 인 </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setLoading(false); // memory leak 오류 방지
            navigation.push('AssignRoot');
          }}
          style={styles.loginBtnContainer}>
          <Text style={styles.loginBtn}> 회 원 가 입</Text>
        </TouchableOpacity>
        <Text style={styles.showText}></Text>
        <Text style={styles.showText}></Text>
        <GoogleSigninButton
          onPress={() => socialLogin('google')}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          style={styles.googleLogin}
        />
        <TouchableOpacity onPress={() => socialLogin('kakao')}>
          <Image
            source={require('../../assets/images/kakao_login_medium_wide.png')}
            style={styles.kakaoLogin}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => DELETE_TEMP()}>
          <Image
            source={require('../../assets/images/kakao_login_medium_wide.png')}
            style={{
              width: 260,
              height: 40,
              marginTop: 10,
              resizeMode: 'contain',
            }}
          />
        </TouchableOpacity>
      </View>

      <OneButtonModal
        modalOn={loginNotNullModal || loginUnmatchedModal}
        modalOff={() => {
          setLoginNotNullModal(false);
          setLoginUnmatchedModal(false);
        }}
        message={
          loginNotNullModal
            ? 'ID와 암호는 반드시 작성해주셔야합니다.' //Not null 에러일 경우
            : '아이디 혹은 비밀번호가 일치하지 않습니다.' // Not null이 아닌 미일치 에러일 경우
        }
      />
      <Loading modalOn={loading} modalOff={() => setLoading(false)} />
    </SafeAreaView>
  );
};
