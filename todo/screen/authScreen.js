import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
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

import { AuthContext } from '../context/authcontext';
import {
  SELECT_USER_INFO_BY_USERNO,
  GOOGLE_LOGIN,
  KAKAO_LOGIN,
  LOGIN_VALIDATION,
  SELECT_USER_INFO_BY_ID,
  DELETE_TEMP,
} from '../sqliteConnection';
import { LoginErrorModal } from '../modal/loginErrorModal';
import { IdPwdNotNullModal } from '../modal/IdPwdNotNullModal';
import { ErrorModal } from '../modal/ErrorModal';
import { styles } from './styles/authScreenStyle';
import { Loading } from '../modal/Loading';

export const authScreen = ({ navigation }) => {
  const authContext = React.useContext(AuthContext);
  const [loginErrorModal, setLoginErrorModal] = React.useState(false); //로그인 아이디 비밀번호 비일치 시
  const [loginNotNullModal, setLoginNotNullModal] = React.useState(false); //로그인 아이디 비밀번호 null발생 시
  const [pwdErrorModal, setPwdErrorModal] = React.useState(false); //비밀번호만 오류일 시
  const [loading, setLoading] = React.useState(false); //로딩화면
  const [id, setId] = React.useState('Aldne');
  const [pwd, setPwd] = React.useState('121212');
  // DELETE_TEMP();
  React.useEffect(() => {
    const subscribe = navigation.addListener('focus', () => {
      setLoading(true); //autologin 이전에 loading창
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
        setLoading(false);
      }
    } catch (error) {
      console.log(
        'AuthScreen / AutoLogin : GetAsync Failed' + JSON.stringify(error),
      );
    }
  };

  //자동로그인 시 authContext에 저장하기 위한 user정보
  const getInfoWhenAutoLogin = user_no => {
    
    let getUserInfo = new Promise((resolve, reject) => {
      //자동로그인 된 user_no와 일치하는 data select
      const userInfo = SELECT_USER_INFO_BY_USERNO(user_no);
      setTimeout(() => {
        resolve(userInfo);
      }, 1000);
    }).catch(err => {
      console.log('Error occur in promise' + JSON.stringify(err));
    });
    getUserInfo.then(userInfo => {
      //DB에서 받아온 유저 DATA JSON
      authContext.id = userInfo.id;
      authContext.name = userInfo.name;
      authContext.email = userInfo.email;
      authContext.regi_date = userInfo.regi_date;
      authContext.job = userInfo.job;
      authContext.autologin = true; //자동로그인이므로 autologin값 true
      authContext.user_no = userInfo.user_no;
      // AsyncStorage.setItem('user_no', JSON.stringify(authContext.user_no)); - 이미 존재하므로 필요없다
      authContext.image = userInfo.image;
      navigation.replace('MainScreen');
    });
  };

  //일반 로그인
  const login = () => {
    try {
      if (id === null || pwd === null) {
        // id pwd가 Null일 경우
        setLoginNotNullModal(true);
      } else {
        //Login Validation 접근

        let login_validation = new Promise((resolve, reject) => {
          const result = LOGIN_VALIDATION(id, pwd); //result : 작성된 ID PWD와 일치하는 유저의 COUNT
          setTimeout(() => {
            resolve(result); //RESOLVE
          }, 1000);
        }).catch(err => {
          console.log('Error occur in promise' + JSON.stringify(err));
        });
        login_validation.then(result => {
          //최종일치 유저수 RECEIVE
          if (result.count > 0) {
            //최종일치한 유저가 존재한 경우
            console.log('최종일치 유저 수 : ' + result.count);
            getUser_no();
          } else if (count == 0) {
            // 최종일치 Failed = VALIDATION FAILED
            console.log('pwd and inputpwd not matched');
            setPwdErrorModal(true);
          }
        });
      }
    } catch (err) { console.log("일반 로그인 오류 "+err)   }
  };

  //일반 로그인 성공 시 context에 담을 user 정보 get
  const getUser_no = () => {
    let getUserInfo = new Promise((resolve, reject) => {
      const userInfo = SELECT_USER_INFO_BY_ID(id);
      setTimeout(() => {
        resolve(userInfo);
      }, 1000);
    }).catch(err => {
      console.log('Error occur in promise' + JSON.stringify(err));
    });
    getUserInfo.then(userInfo => {
      AsyncStorage.setItem('user_no', JSON.stringify(userInfo.user_no)); // 자동로그인이 아니므로 필요하다
      // context 값 선언 방법 변경 권장 export
      authContext.id = userInfo.id;
      authContext.pwd = userInfo.pwd;
      authContext.name = userInfo.name;
      authContext.email = userInfo.email;
      authContext.job = userInfo.job;
      authContext.regi_date = userInfo.regi_date;
      authContext.image = userInfo.image;
      authContext.autologin = false;
      authContext.user_no = userInfo.user_no;
      //로그인 완료 후 메인스크린으로 이동
      navigation.replace('MainScreen');
      // replace 새로운 스택route로 바꾸기 때문에 authScreen이 stack Index에 존재하지 않게 된다
    });
  };

  //googleLogin
  loginWithGoogle = async () => {
    GoogleSignin.configure({}); //구글로그인 configure
    try {
      await GoogleSignin.hasPlayServices(); //구글로그인 아이디선택
      const googleUserInfo = await GoogleSignin.signIn(); //선택한 구글 아이디의 정보 객체
      let userIdFromGoogle = googleUserInfo.user.id; //선택한 구글 아이디의 ID 정보 (Ex : 10825657342564)
      GOOGLE_LOGIN(googleUserInfo); //로그인 이력 여부에 따라 새로 INSERT or SELECT
      console.log('userId  : ' + userIdFromGoogle);
      if (userIdFromGoogle != null) {
        //구글로그인 성공
        let getUserInfo = new Promise((resolve, reject) => {
          const userInfo = SELECT_USER_INFO_BY_ID(userIdFromGoogle);
          setTimeout(() => {
            resolve(userInfo);
          }, 1000);
        }).catch(err => {
          console.log('Error occur in promise' + JSON.stringify(err));
        });
        getUserInfo.then(userInfo => {
          console.log('GET USER INFO BY GG ID SUCCESS');
          AsyncStorage.setItem('user_no', JSON.stringify(userInfo.user_no)); // 자동로그인이 아니므로 필요하다
          // context 값 선언 방법 변경 권장 export
          authContext.id = userInfo.id;
          authContext.pwd = userInfo.pwd;
          authContext.name = userInfo.name;
          authContext.email = userInfo.email;
          authContext.job = userInfo.job;
          authContext.regi_date = userInfo.regi_date;
          authContext.image = userInfo.image;
          authContext.autologin = false;
          authContext.user_no = userInfo.user_no;
          authContext.login_route = 'google'; // 구글로그인 루트 설정
          navigation.replace('MainScreen');
        });
      } else if (userIdFromGoogle == null) {
        //구글 ID가 NULL
        alert('구글로그인 실패');
      }
    } catch (err) {
      console.log('Google Login Failed ' + JSON.stringify(err));
    }
  };

  //카카오 로그인
  const loginWithKakao = async () => {
    try {
      const token = await kakaoLogin();
      if (token != null) {
        // 카카오 로그인 성공
        const userInfo = await getKakaoProfile();
        await KAKAO_LOGIN(userInfo);
        let getUserInfo = new Promise((resolve, reject) => {
          const user_data_from_db = SELECT_USER_INFO_BY_ID(userInfo.id);
          setTimeout(() => {
            resolve(user_data_from_db);
          }, 2000);
        }).catch(err => {
          console.log('Error occur in promise' + JSON.stringify(err));
        });
        getUserInfo.then(user_data_from_db => {
          // 자동로그인이 Asyncstorage 필요
          AsyncStorage.setItem('user_no', JSON.stringify(user_data_from_db.user_no)); 
          // context 값 선언 방법 변경 권장 export
          authContext.id = user_data_from_db.id;
          authContext.pwd = user_data_from_db.pwd;
          authContext.name = user_data_from_db.name;
          authContext.email = user_data_from_db.email;
          authContext.job = user_data_from_db.job;
          authContext.regi_date = user_data_from_db.regi_date;
          authContext.image = user_data_from_db.image;
          authContext.autologin = false; // 직접 누른 것이니 autologin false
          authContext.user_no = user_data_from_db.user_no;
          authContext.login_route = 'kakao'; // 카카오 로그인 루트 설정
          console.log(authContext.id)
          console.log(authContext.pwd)
          console.log(authContext.name)
          console.log(authContext.email)
          navigation.replace('MainScreen');
        });
      } else if (token == null) {
        console.log('Kakao Token Null');
      }
    } catch (err) {
      console.log('KaKao Login Error' + err);
    }
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
          onPress={() => navigation.navigate('AssignRoot')}
          style={styles.loginBtnContainer}>
          <Text style={styles.loginBtn}> 회 원 가 입</Text>
        </TouchableOpacity>
        <Text style={styles.showText}></Text>
        <Text style={styles.showText}></Text>
        <GoogleSigninButton
          onPress={loginWithGoogle}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          style={{ width: 260, height: 45, marginRight: 5 }}
        />
        <TouchableWithoutFeedback onPress={loginWithKakao}>
          <Image
            source={require('../assets/kakao_login_medium_wide.png')}
            style={{
              width: 260,
              height: 40,
              marginTop: 10,
              resizeMode: 'contain',
            }}
          />
        </TouchableWithoutFeedback>
      </View>
      <IdPwdNotNullModal
        modalOn={loginNotNullModal}
        modalOff={() => setLoginErrorModal(false)}
      />
      <LoginErrorModal
        modalOn={loginErrorModal}
        modalOff={() => setLoginErrorModal(false)}
      />
      <ErrorModal
        modalOn={pwdErrorModal}
        modalOff={() => setPwdErrorModal(false)}
        message="아이디 혹은 비밀번호가 일치하지 않습니다."
      />
      <Loading modalOn={loading} modalOff={() => setLoading(false)} />
    </SafeAreaView>
  );
};
