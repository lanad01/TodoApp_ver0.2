import React from 'react';
import {  View,  Image,  Text,  TouchableOpacity,  TextInput,  Keyboard,} from 'react-native';
import { DPW } from '../../../config/dp';
import { styles } from '../style/assignScreenPhotoStyle';

export default AssignScreen_2nd = props => {
  const [rise, setRise] = React.useState(0);
  // 키보드가 사라지면 화면을 직접 내려버린다.
  React.useEffect(() => {
    Keyboard.addListener('keyboardDidHide', e => {
      setRise(0);
    });
    Keyboard.addListener('keyboardDidShow', e => {
      setRise(90)
    })
    return () => {
      Keyboard.removeAllListeners('keyboardDidHide')
      Keyboard.removeAllListeners('keyboardDidShow')
    };
  }, []);

  return (
    <View style={styles.scrollContainer}>
      <View style={styles.headContainer}>
        <Text style={styles.headerText}>
          사진과 이름을 등록해주세요. {props.pictureSelected}
        </Text>
        <TouchableOpacity onPress={props.profileModal}>
          <Image
            source={
              props.pictureSelected
                ? { uri: props.profileImage }
                : require('../../../assets/images/profile3.jpg')
            }
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>
      <View
        style={{
          height: 700 * DPW,
          backgroundColor: '#191970',
          marginTop: 90 * DPW,
          alignItems: 'center',
          bottom: rise,
        }}>
        <TextInput
          maxLength={10}
          backgroundColor="white"
          placeholderTextColor={props.nameIsNull ? 'red' : '#dcdcdc'}
          style={styles.nameInput}
          placeholder=" &nbsp;이름을 작성해주세요."
          onChangeText={name => props.setName(name)}
          ref={props.nameRef}
        />
        <Text style={styles.nameInfo}> 이름은 반드시 적어주셔야해요! </Text>
        <Text style={styles.Info}>
          프로필 정보(사진, 이름)는 회원 식별, 커뮤니케이션 등의 목적으로 활용됩니다.
        </Text>
        <TouchableOpacity onPress={props.finalize} style={styles.footer}>
          <Text style={styles.btn}>등 록 하 기 </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
