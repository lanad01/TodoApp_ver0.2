import React, { useEffect, useState } from 'react';
import {
  View,
  SafeAreaView,
  Image,
  Text,
  TouchableWithoutFeedback,
  TextInput,
  Keyboard,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { DPW } from '../../../config/dp';
import { styles } from '../style/assignScreenStyle';

export default AssignScreen_1st = (props) => {
  const [rise, setRise] = useState(0);
  useEffect(() => {
    const hide = Keyboard.addListener('keyboardDidHide', e => {
      // 키보드가 사라지면 화면을 직접 내려버린다.
      setRise(0);
    });
    return (
      () => {
        console.log('Unsubscribe ');
        // useEffect에서 요기 return뒤의 값은 해당 컴포넌트가 종료될 때 실행된다
        // Keyboard.removeAllListeners('keyboardDidHide'); //resource Leak 에러메시지 해결
        hide.remove();
      },
      []
    );
  });
  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={{
            padding: 48 * DPW,
            backgroundColor: 'white',
            width: 660 * DPW,
            height: 1100 * DPW,
            borderRadius: 20,
            marginBottom: 200 * DPW,
            bottom: rise * DPW,
          }}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.headerText}> Register </Text>
            <TouchableOpacity onPress={props.nextpage}>
              <View style={styles.nextBtnContainer}>
                <Image
                  source={require('../../../assets/images/Next.jpg')}
                  style={styles.nextBtn}
                />
              </View>
            </TouchableOpacity>
          </View>
          <Text style={styles.headerDetailText}>
            Please enter details to register
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.category}> ID</Text>
            <Text style={styles.nnMsg}> {props.idNNMessage}</Text>
          </View>
          <TextInput
            style={styles.input}
            maxLength={30}
            placeholder=" Please type ID :)"
            onChangeText={ id => props.setUserData('id', id)}
            ref={props.idRef}
          />

          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.category}> Password </Text>
            <Text style={styles.nnMsg}> {props.pwdNNMsg}</Text>
          </View>
          <TextInput
            style={styles.pwdinput}
            secureTextEntry={true}
            maxLength={30}
            placeholder=" Please Fill your Password!"
            onChangeText={pwd =>props.setUserData('pwd', pwd)}
            ref={props.pwdRef}
          />

          <Text style={styles.category}> Job </Text>
          <TextInput
            style={styles.input}
            maxLength={30}
            placeholder=" Fell free to type here :)"
            onChangeText={job => props.setUserData('job', job)}
            onFocus={() => setRise(160)}
          />

          <Text style={styles.category}> Email </Text>
          <TextInput
            style={styles.input}
            keyboardType={'email-address'}
            maxLength={30}
            placeholder=" email@example.com"
            onChangeText={email => props.setUserData('email',email)}
            onFocus={() => setRise(350)}
          />
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};
