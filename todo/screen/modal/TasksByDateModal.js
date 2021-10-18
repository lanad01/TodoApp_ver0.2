import React from 'react';
import { FlatList } from 'react-native';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { Card } from 'react-native-shadow-cards';
import { styles } from './styles/taskByDateModalStyle';
import { AuthContext } from '../../context/authcontext';
import { SELECT_TASK_BY_EXP_DATE } from '../../sqliteConnection/taskTableConnection';

const TasksByDateModal = props => {
  const authContext = React.useContext(AuthContext);
  const [tasklist, setTaskList] = React.useState([]); //DB에서 받아온 TASKS를 담을 STATE

  //이 모달이 출력되면 수행되는 useEffect
  React.useEffect(async () => {
    //선택한 날짜에 현재 유저가 등록한 Task를 검색
    const tasks = await SELECT_TASK_BY_EXP_DATE(
      props.date,
      authContext.user_no,
    );
    setTaskList(tasks);
    return () => {};
  }, [props.modalOn]);

  const renderItem = ({ item, index }) => {
    return (
      <Card style={styles.card}>
        <View key={index} style={{ flex: 1, flexDirection: 'row' }}>
          <View style={styles.task_nameView}>
            <Text style={styles.task_name} ellipsizeMode={'tail'}>{item.task_name} </Text>
          </View>
          <View style={styles.task_priorAndperformed}>
            <Text style={styles.priority}>
              | {item.priority == null ? 'Middle' : item.priority}
            </Text>
            {item.performed == 0 ? (
              <Text style={styles.performed}> [ 미완료 ] </Text>
            ) : (
              <Text style={styles.performed}> [ 완 료 ] </Text>
            )}
          </View>
        </View>
      </Card>
    );
  };
  return (
    <Modal
      isVisible={props.modalOn}
      avoidKeyboard={true}
      transparent={true}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={styles.outside}>
        <View style={styles.validModal}>
          <Text style={styles.selected_Date}>{props.date} </Text>
          <FlatList
            data={tasklist}
            renderItem={renderItem}
            keyExtractor={(item, index) => {
              return index;
            }}
          />
          <TouchableOpacity style={styles.choicebox} onPress={props.modalOff}>
            <Text textAlign="center" style={styles.exitBtn}>
              나 가 기
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
export default TasksByDateModal;
