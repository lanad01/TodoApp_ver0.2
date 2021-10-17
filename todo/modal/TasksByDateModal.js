import React from 'react';
import { FlatList } from 'react-native';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { Card } from 'react-native-shadow-cards';
import { DPW } from '../config/dp';
import { AuthContext } from '../context/authcontext';
import { SELECT_TASK_BY_EXP_DATE } from '../sqliteConnection/taskTableConnection';

const TasksByDateModal = props => {
  const authContext = React.useContext(AuthContext);
  const [tasklist, setTaskList] = React.useState([]);
  React.useEffect(async () => {
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
        <View
          key={index}
          style={{ flex: 1, flexDirection: 'row',  }}>
          <View style={styles.task_nameView}>
            <Text style={styles.task_name}>{item.task_name} </Text>
          </View>
          <View style={{ flexDirection: 'row', width: 80 }}>
            <Text style={styles.priority}>
              {item.priority == null ? 'Middle' : item.priority}
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
            showsVerticalScrollIndicator={true}
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

const styles = StyleSheet.create({
  choicebox: {
    alignItems: 'center',
    marginTop: 15,
  },
  outside: {
    width: 400,
    height: 700,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exitBtn: {
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: 'BMJUA',
    fontSize: 23,
    backgroundColor: 'white',
    borderRadius: 7,
    borderWidth: 5,
    marginBottom: 20,
    padding: 10,
  },
  validModal: {
    width: 300,
    height: 350,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 7,
    borderColor: 'black',
  },
  selected_Date: {
    fontFamily: 'BMJUA',
    fontSize: 27,
    textAlign: 'center',
    marginVertical: 15,
  },
  card: {
    shadowOpacity: 0.8,
    elevation: 5,
    height: 100 * DPW,
    width: 480 * DPW,
    alignSelf: 'center',
    marginTop: 10 * DPW,
    marginBottom: 15 * DPW,
    backgroundColor: '#FAFAD2',
  },
  task_nameView: {
    width: 120,
    height: 40,
    alignSelf: 'center',
    alignItems: 'center',
    alignContent: 'center',
    marginTop:10,
  },
  task_name: {
    fontFamily: 'BMJUA',
    fontSize: 22,
    textAlignVertical: 'center',
    color: 'black',
  },
  priority: {
    fontFamily: 'BMJUA',
    fontSize: 17,
    textAlignVertical: 'center',
    color: 'black',
  },
  performed: {
    fontFamily: 'BMJUA',
    fontSize: 15,
    textAlignVertical: 'center',
    color: 'black',
  },
});
