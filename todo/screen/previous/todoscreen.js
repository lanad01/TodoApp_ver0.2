import React, { useState, useEffect,useContext } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, DeviceEventEmitter} from 'react-native';
import GestureRecognizer, {  swipeDirections,} from 'react-native-swipe-gestures';
import Modal from "react-native-modal";
import { Picker } from '@react-native-picker/picker';
import DatePicker from 'react-native-date-picker';
import { AuthContext } from '../authcontext';
import TodoList_v2 from './todoList_v2'
import { Loading } from '../modal/Loading';
import { TodoContext } from '../todoContext';
import { DB } from '../globalVar';

export const Todo = ( {navigation}) => {
  const authContext = React.useContext(AuthContext)
  const todoContext = React.useContext(TodoContext)
  const [render, reRender]=useState(1)
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log("todoscreen unsubscribe")
      setLoading(true);
      setTimeout(() => {
        setLoading(false)
      }, 1000);
    });
    return unsubscribe;
  }, [render]);

  const [modal, setModal] = useState(false); // 태스크 추가 모달
  const [open, setOpen] = useState(false); // 달력 모달 오픈
  const [taskName, setTaskName] = useState(null);
  const [priority, setPriority] = useState();
  const [exp, setExp] = useState(new Date());
  var week = new Array('일', '월', '화', '수', '목', '금', '토');
  var year= exp.getFullYear();
  var month = exp.getMonth()+1;
  var day = exp.getDate();
  var dayName = week[exp.getDay()];
  var dateToKorean=year+'년 '+month+'월 '+day+'일 '+dayName+'요일 ';
  const register = () => { // Task 추가 등록
    if(taskName != null){ // name은 낫널
      DB.transaction(tx => {
        tx.executeSql(
            'INSERT INTO task_info2 (user_no, task_name, priority, exp, performed) VALUES (?,?,?,?,false)',
            [authContext.user_no,taskName, priority, dateToKorean ],
            (tx , res) => {
              console.log("Insert Success")
              setModal(!modal);
              reLoading()
              DeviceEventEmitter.emit('updateBadgeCount', { })
            }, error => {
              console.log("Insert Failed"+error);
            }
        );
      });
    }else if(taskName===null){
      console.log("TaskName Null!!")
    }
  }
  // Gesture Recognizer 
  const config = { velocityThreshold: 0.5, directionalOffsetThreshold: 80 };
  function onSwipe(gestureName, gestureState) {
    const { SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections;
    switch (gestureName) {
      case SWIPE_RIGHT:
        navigation.navigate("Profile");
        break;
      case SWIPE_UP:
        console.log(gestureName)
        break;
      case SWIPE_DOWN:
        console.log(gestureName)
        break;
      case SWIPE_LEFT:
        console.log("left")
        break;
    }
  }
  console.log('todoscreen render');
  const reLoading = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false)
    }, 1000);
  }
  return (
    <GestureRecognizer
      style={{ height:"100%"}}
      onSwipe={(direction, state) => onSwipe(direction, state)}
      onSwipeUp={state => state}
      onSwipeDown={state => state}
      onSwipeLeft={state => state}
      onSwipeRight={state => state}
      config={config}>
    <View style={styles.container}>
      <View>
        <Text style={styles.headerText}> To Do List Application</Text>
        <View style={styles.addModalBtn}>
          <Text style={styles.welcomingTxt}>
           [ {authContext.name} ] 님 환영합니다!{' '}
          </Text>
          
        </View>
      </View>
      <TouchableOpacity  onPress={() => setModal(!modal)} style={{ marginLeft: 250, marginTop: 30,}}>
            <Image source={require('../assets/add.png')} />
      </TouchableOpacity>
      
      <TodoList_v2 render={loading} render2={reLoading} />
      <Modal isVisible={modal} avoidKeyboard={true} transparent={true} >
        <View style={styles.addModal}>
          <Text style={styles.modalheader}> New Task </Text>
          <View style={styles.addTaskContent}>
            <Text style={styles.taskContentText}> Task명 : </Text>
            <TextInput style={styles.taskInput} onChangeText={(taskName)=>setTaskName(taskName)} maxLength={20}></TextInput>
          </View>
          <View style={styles.addTaskContent}>
            <Text style={styles.taskContentText}> Priority : </Text>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Picker
                selectedValue={priority}
                style={styles.picker}
                mode="dropdown"
                onValueChange={(priority)=> setPriority(priority)}
              >
                <Picker.Item label="Option" value="미설정" />
                <Picker.Item label="High" value="High" />
                <Picker.Item label="Middle" value="Middle" />
                <Picker.Item label="Low" value="Low" />
              </Picker>
            </View>
          </View>
          <View style={styles.addTaskContent}>
            <TextInput style={styles.expInput} value={dateToKorean} editable={false}  />
            <TouchableOpacity style={styles.opacity}  onPress={() => setOpen(true)}>
              <Text style={{ fontFamily: 'BMJUA',  fontSize: 17, color: '#191970', marginRight: 0}}> 날짜지정 </Text>
            </TouchableOpacity>
            <DatePicker modal open={open} date={exp} minimumDate={new Date()} mode={'date'} textColor={'#191970'}
                onConfirm={(exp) => { setOpen(false)
                setExp(exp)
                }}
                onCancel={() => {
                setOpen(false)
                }}/>
          </View>
          <View style={styles.addTaskContent}>
            <TouchableOpacity style={styles.opacity2} onPress={() => setModal(!modal)}>
                <Text style={styles.regBtn}> 나가기 </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.opacity2} onPress={register}>
                <Text style={styles.regBtn}> 등록 </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Loading modalOn={loading}/>
    </View>
    </GestureRecognizer>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#191970',
    paddingHorizontal: 30,
    flex: 1,
    alignItems: 'center',
  },
  headerText: {
    paddingTop: 30,
    alignItems: 'center',
    fontSize: 30,
    color: 'white',
    fontFamily: 'BMJUA',
  },
  welcomingTxt: {
    marginTop: 80,
    fontFamily: 'BMJUA',
    fontSize: 21,
    color: 'white',
    position:'absolute'
  },
  addModalBtn: {
    flexDirection: 'row',
    position:'absolute',
  },
  addModal: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#191970',
    borderWidth: 5,
    borderColor: 'white',
    borderRadius: 30,
    width: 300,
    height:400,
    marginLeft: 25,
  },
  modalheader: {
    fontFamily: 'BMJUA',
    fontSize: 22,
    color: 'white',
    marginTop: 10,
  },
  addTaskContent: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#191970',
    marginTop: 12,
    flexDirection: 'row',
    marginLeft:10,
  },
  taskContentText: {
    color: 'white',
    fontFamily: 'BMJUA',
    fontSize: 20,
  },
  taskInput: {
    width: '55%',
    height: 35,
    backgroundColor: 'white',
    borderRadius: 7,
    marginLeft: 10,
    fontFamily:'BMJUA',
    paddingLeft:10,
  },
  picker: {
    width: 160,
    height: 50,
    backgroundColor: 'white',
    marginLeft: 5,
  },
  expButton: {
    fontFamily: 'BMJUA',
    fontSize: 17,
    color: 'white',
    borderWidth: 5,
    borderColor: 'white',
    borderRadius: 5,
    width: 65,
    height: 35,
    marginRight: 15,
  },
  expInput: {
    backgroundColor: 'white',
    marginLeft: 3,
    width: 170,
    height: 40,
    borderRadius: 5,
    fontFamily: 'BMJUA',
    fontSize: 14,
    color: '#191970',
    paddingLeft:12,
  },
  textInput: {
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 10,
    height: 60,
    borderRadius: 10,
    borderColor: 'white',
    borderWidth: 3,
    color: 'white',
    fontSize: 19,
  },
  opacity: {
    backgroundColor: 'white',
    marginTop: 0,
    borderStyle: 'dotted',
    borderWidth: 4,
    borderColor: 'white',
    width: 70,
    alignItems: 'center',
    marginLeft: 10,
  },
  showText: {
    marginTop: 10,
    fontSize: 25,
    color: 'white',
  },
  logoutBtn: {
    margin: 10,
  },
  opacity2 : {
    backgroundColor: 'white',
    marginBottom:10,
    borderStyle: 'dotted',
    borderWidth: 4,
    borderColor: 'white',
    width: 70,
    alignItems: 'center',
    marginLeft: 10,
    
  },
  regBtn:{
    fontFamily: 'BMJUA',
    fontSize: 17,
    color: '#191970',
    marginRight: 0
  },  
  btn: {
    alignItems: 'center',
    backgroundColor: 'white',
    width: 100,
    height: 40,
    borderRadius: 5,
    borderWidth: 5,
    marginBottom: 10,
  },
  btnTxt: {
    fontFamily: 'BMJUA',
    fontSize: 20,
    marginTop: 2,
  },
});