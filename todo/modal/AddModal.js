import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { Picker } from '@react-native-picker/picker';
import DatePicker from 'react-native-date-picker';

import { AuthContext } from '../context/authcontext';
import { Loading } from '../modal/Loading';
import { INSERT_TASK } from '../sqliteConnection/taskTableConnection';
import { styles } from './styles/addModalStyle';

export const AddModal = props => {
  const authContext = React.useContext(AuthContext);
  const [loading, setLoading] = useState(false); // 로딩화면

  const [open, setOpen] = useState(false); // 달력 모달 오픈
  const [taskName, setTaskName] = React.useState(null); // Task이름
  const [priority, setPriority] = React.useState(); // 우선순위
  const [exp, setExp] = React.useState(new Date()); // 기한
  let week = new Array('일', '월', '화', '수', '목', '금', '토');
  let year = exp.getFullYear();
  let month = exp.getMonth() + 1;
  let day = exp.getDate();
  let dayName = week[exp.getDay()];
  let dateToKorean = // exp(Date Type) to String
    year + '년 ' + month + '월 ' + day + '일 ' + dayName + '요일 ';
  const register = () => { // Task 추가
    if (taskName != null) { // Task name Not null
      const taskInfo = {
        user_no : authContext.user_no,
        task_name : taskName,
        priority : priority,
        exp : dateToKorean,
        exp_date :  year+'-'+month+'-'+day,
      }
      INSERT_TASK(taskInfo) // INSERT TASK SQLITE ACCESS
      props.render(); // taskList Rerender
      props.modalOff(); // AddModal 종료
    } else if (taskName === null) {
      console.log('TaskName Null!!');
    }
  };
  return (
    <Modal
      isVisible={props.modalOn}
      avoidKeyboard={true}
      transparent={true}
      style={styles.modal}>
      <View style={styles.outside}>
        <View style={styles.validModal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeader}>New Task</Text>
          </View>
          <View style={styles.taskContainer}>
            <Text style={styles.category}>Task명 : </Text>
            <TextInput
              style={styles.taskInput}
              onChangeText={taskName => setTaskName(taskName)}
              maxLength={20}></TextInput>
          </View>
          <View style={styles.priorContainer}>
            <Text style={styles.category2}>우선순위 : </Text>
            <Picker
              selectedValue={priority}
              style={styles.picker}
              mode="dropdown"
              onValueChange={priority => setPriority(priority)}>
              <Picker.Item label="Option" value="미설정" />
              <Picker.Item label="High" value="High" />
              <Picker.Item label="Middle" value="Middle" />
              <Picker.Item label="Low" value="Low" />
            </Picker>
          </View>
          <View style={styles.expContainer}>
            <TouchableOpacity
              style={styles.opacity}
              onPress={() => setOpen(true)}>
              <Text style={styles.expBtn}> 날짜지정 </Text>
            </TouchableOpacity>
            <TextInput
              style={styles.expInput}
              value={dateToKorean}
              editable={false}
            />
            <DatePicker
              modal
              open={open}
              date={new Date()}
              minimumDate={new Date()}
              mode={'date'}
              textColor={'#191970'}
              onConfirm={exp => {
                setOpen(false);
                setExp(exp);
              }}
              onCancel={() => {
                setOpen(false);
              }}
            />
          </View>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity style={styles.choicebox} onPress={props.modalOff}>
              <Text textAlign="center" style={styles.photochoose}>
                나 가 기
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.choicebox} onPress={register}>
              <Text textAlign="center" style={styles.photochoose}>
                등 록
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Loading modalOn={loading} />
      </View>
    </Modal>
  );
};
