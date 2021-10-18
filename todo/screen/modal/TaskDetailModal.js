import React from 'react';
import {  View,  Text,  TouchableOpacity,  TextInput,  } from 'react-native';
import Modal from 'react-native-modal';
import { Picker } from '@react-native-picker/picker';
import DatePicker from 'react-native-date-picker';

import { TodoContext } from '../../context/todoContext';
import { UPDATE_TASK, SELECT_TASK_BY_TASKNO } from '../../sqliteConnection/taskTableConnection';
import { styles } from './styles/taskDetailModalStyle';

export const TaskDetailModal = props => {
  const todoContext = React.useContext(TodoContext);
  const [taskName, setTaskName] = React.useState(''); // 수정 modal창에서 작성된 task이름
  const [taskPrior, setPrior] = React.useState(''); // 수정 modal차엥서 작성된 우선순위
  const [exp, setExp] = React.useState(new Date()); // 수정 modal창에서 작성된 기한
  const [open, setOpen] = React.useState(false); // 달력 모달 오픈
  const [dateToKorean, setDateToKorean] = React.useState(); //기한변경 옆 TEXTINPUT

  React.useEffect(async () => {
    // TaskDetailModal Mount시 실행되는 task_no를 통한 데이터 조회
    const task_from_db = await SELECT_TASK_BY_TASKNO(props.task_no);
    setTaskName(task_from_db.task_name); //Detail 모달에서 출력되는 taskName칸을 DB에서 받아온 값으로 대체
    setPrior(task_from_db.priority);
    setDateToKorean(task_from_db.exp);
    return () => {};
  }, [props.modalOn]); // 상위 컴포넌트에서 해당 모달을 호출할 시 단 한번 시행

  //모달 내용 변경 버튼 클릭 
  const updateTask = () => {
    const new_task_info = { //sqlite에 보낼 변경될 task 정보 json
      task_name: taskName,
      priority: taskPrior,
      exp: dateToKorean,
      task_no: props.task_no,
    };
    UPDATE_TASK(new_task_info); //sqlite access
    props.modalOff(); //Detail 모달 종료
    props.render(); // 상위컴포넌트 리렌더링
  };
  
  //변경 모달에서 exp(기한)을 변경할 시 모달의 기한이 출력하고 있는 dateToKoran도 dateToString parsing을 해서 출력
  React.useEffect(() => { 
    let week = new Array('일', '월', '화', '수', '목', '금', '토');
    let year = exp.getFullYear();
    let month = exp.getMonth() + 1;
    let day = exp.getDate();
    let dayName = week[exp.getDay()];
    let formatted_date = year + '년 ' + month + '월 ' + day + '일 ' + dayName + '요일 ';
    setDateToKorean(formatted_date); 
    return () => {};
  }, [exp]);

  return (
    <Modal isVisible={props.modalOn} style={styles.modal}>
      <View style={styles.validModal}>
        <View style={styles.container}>
          <Text style={styles.validText}> Task 명 : </Text>
          <TextInput
            style={styles.content}
            defaultValue={taskName}
            onChangeText={taskName => setTaskName(taskName)}
          />
        </View>
        <View style={styles.container}>
          <Text style={styles.priorText}> 우선순위 : </Text>
          <View style={styles.pickerView}>
            <Picker
              defaultValue={todoContext.taskPrior}
              selectedValue={taskPrior}
              style={styles.picker}
              mode="dropdown"
              onValueChange={taskPriority => setPrior(taskPriority)}>
              <Picker.Item label="Option" value="미설정" />
              <Picker.Item label="High" value="High" />
              <Picker.Item label="Middle" value="Middle" />
              <Picker.Item label="Low" value="Low" />
            </Picker>
          </View>
        </View>
        <View style={styles.container}>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              style={styles.datePickerView}
              onPress={() => setOpen(true)}>
              <Text style={styles.changeExp}>기한변경 </Text>
            </TouchableOpacity>
            <TextInput
              editable={false}
              defaultValue={dateToKorean}
              style={styles.pickedData}
            />
          </View>
          <DatePicker
            modal
            open={open}
            date={exp}
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
            <Text textAlign="center" style={styles.button}>
              목록으로
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.choicebox} onPress={updateTask}>
            <Text textAlign="center" style={styles.button}>
              수정하기
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
