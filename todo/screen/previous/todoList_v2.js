import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, FlatList, StyleSheet, Text, View, Image , Alert, TouchableOpacity, 
                         } from 'react-native';
import { TodoContext } from '../../todoContext';
import { AuthContext } from '../../authcontext';
import SQLite from 'react-native-sqlite-storage';
import { TaskDetailModal } from '../../modal/TaskDetailModal';
import {TouchableWithoutFeedback, } from 'react-native-gesture-handler';
import  Animated, { useSharedValue, useAnimatedStyle,withTiming,withSpring,  
} from 'react-native-reanimated';
import { DB  } from '../../globalVar';

const progress = [];

const TodoList_v2 = (props) => {

  const todoContext = React.useContext(TodoContext);
  const authContext = React.useContext(AuthContext);
  const [showBox, setShowBox] = useState(true);
  const [noTask, setNoTask] = useState(0); 
  const [taskDetailModal,setTaskDetailModal]=useState({
    modal : false,
    task_no : 0
  });
  
  useEffect(() => {
    setNoTask(noTask+1)
      DB.transaction( tx => {
         tx.executeSql(
           'SELECT * FROM task_info2 WHERE user_no=?',
           [authContext.user_no],
           (tx , res) => {
           var len=res.rows.length;
           if(len===0){
             // console.log("Array length 0")
               setNoTask(0);
           }else if(len>0){
               for(var i=0; i<len; i++){
                  var priority=res.rows.item(i).priority
                  if(priority===null) {priority="Middle"}
                  todoContext.task_no[i]=res.rows.item(i).task_no
                  todoContext.task_name[i]=res.rows.item(i).task_name
                  todoContext.task_prior[i]=priority
                  todoContext.task_exp[i]=res.rows.item(i).exp
                  todoContext.performed[i]=res.rows.item(i).performed
                  
               }
           }
           }, error => {
           console.log("Failed"+error);
           }
        )} 
      );
    return () => {
    }
  }, [props.render])

  const deleteTaskImple = (task_no, index) => {
    DB.transaction(tx => {
        tx.executeSql(
            'DELETE FROM task_info2 WHERE task_no=?',
            [task_no],
            (tx , res) => {
              console.log("Deleter Task")
              todoContext.task_name.splice(index,1)
              todoContext.task_prior.splice(index,1)
              todoContext.task_exp.splice(index,1)
              todoContext.task_no.splice(index,1)
              todoContext.performed.splice(index,1)

            }, error => {
              console.log("Delete Failed"+error);
            }
        );
      });
  }
  const details = index => {
    console.log("Detail index : "+index);
    setTaskDetailModal( {modal: true, task_no:index
    });
  }
  const deleteTask = (task_no, index) => {
    return(
    Alert.alert(
      "정말로 삭제하시겠습니까?",
      "복구하실 수 없습니다!",
      [   {   text:"Yes",
              onPress : () => {
                deleteTaskImple(task_no, index);
                setShowBox(!showBox);
              },
          },
          { text: "No", },
      ]
    ));
  }
  const complete = (task_no, index) => {
    console.log(task_no)
   DB.transaction(tx => {
      tx.executeSql(
          'UPDATE task_info2 SET performed=true WHERE task_no=?',
          [task_no],
          (tx , res) => {
            console.log("update Success")
            props.render2()
          }, error => {
            console.log("Delete Failed"+error);
          }
      );
    });
  }
  Array(10)
  .fill('')
  .forEach((_, i) => {
      progress[`${i}`] = useSharedValue(30);
  });
  const [indexOfAnimate, setIndexOfAnimate]=useState();
  const progress2=useSharedValue(30)
  const reanimatedStyle=useAnimatedStyle( index =>{
    console.log("index : "+index)
    console.log("indexOfAnimate : "+indexOfAnimate)
    if(indexOfAnimate==index){
      console.log("Index Compariosn "+index)
      return{ marginRight:40,transform:[{translateX:progress2.value,}]
      }
    }else{
      return {  }
    }
    
  })

  // reanimatedStyle[0]=useAnimatedStyle(()=>{return{ marginRight:40,transform:[{translateX:progress[0].value,}],}})
  // reanimatedStyle[1]=useAnimatedStyle(()=>{return{ marginRight:40,transform:[{translateX:progress[1].value}],}})
  // reanimatedStyle[2]=useAnimatedStyle(()=>{return{ marginRight:40,transform:[{translateX:progress[2].value}],}})
  // reanimatedStyle[3]=useAnimatedStyle(()=>{return{ marginRight:40,transform:[{translateX:progress[3].value}],}})
  // reanimatedStyle[4]=useAnimatedStyle(()=>{return{ marginRight:40,transform:[{translateX:progress[4].value}],}})
  // reanimatedStyle[5]=useAnimatedStyle(()=>{return{ marginRight:40,transform:[{translateX:progress[5].value}],}})
  // reanimatedStyle[6]=useAnimatedStyle(()=>{return{ marginRight:40,transform:[{translateX:progress[6].value}],}})
  // reanimatedStyle[7]=useAnimatedStyle(()=>{return{ marginRight:40,transform:[{translateX:progress[7].value}],}})
  
  const animated = i => {
    console.log("progress2Value :"+progress2.value)
    setIndexOfAnimate(i)
    progress2.value=withSpring(-progress2.value,0.1,(isFinished)=> {
      console.log("isFinished")
      
    })

  }
  const listData = () => { return (
    todoContext.task_name, todoContext.task_prior, 
    todoContext.task_exp, todoContext.task_no, todoContext.performed )
  }
  const renderItem = ({item, index}) => {
     return(
      <View >
      <TouchableOpacity onPress={() => deleteTask(todoContext.task_no[index], index)} 
      style={{flex:1, marginLeft:255 ,marginTop:27 , position:'absolute'}}>
        <Image source={require("../assets/bin3.png")} 
          style={{width:44, height:37, zIndex:1}}/>
      </TouchableOpacity>
    <Animated.View  key={index} style={ (index) => reanimatedStyle(index)}>
       <View style={{flexDirection:'row'}}>
       <TouchableOpacity onPress={ () => { animated(index)} } style={{zIndex:3}} 
    // onPress={() => details(todoContext.task_no[index])*/ 
       >
      <View style={todoContext.task_prior[index]==="High" ? styles.HighPriority : styles.itemContainer}> 
          <View style={{flexDirection:'row' }}>
              <Text style={styles.listtext} ellipsizeMode={'tail'} numberOfLines={1} >
                {todoContext.task_name[index]} { todoContext.task_no[index]} 
              </Text>
              <Text style={styles.priorityText}>[ {todoContext.task_prior[index]} ]</Text>
          </View>
          <View style={{flexDirection:'row'}}>
            <Text style={styles.exp}> 기한 -  {todoContext.task_exp[index]}</Text>
            <View>
            {todoContext.performed[index] == 0 ?  
              <TouchableOpacity style={styles.notComplete} 
              onPress={() => complete(todoContext.task_no[index],index)}>
                <Text style={styles.perforemd}> 완 료</Text>  
              </TouchableOpacity>
            : 
            <TouchableWithoutFeedback style={styles.complete}>
                <Text style={styles.perforemd}> 완료됨</Text>  
            </TouchableWithoutFeedback>
            }
            </View>    
          </View>
      </View>
      
    </TouchableOpacity>
    </View>
  </Animated.View>
  </View>
     )
  }
  const renderKey = (item, index) => todoContext.task_no[index];
  return (
    <View style={styles.container}>
        { noTask ===0 ? 
        <View style={{width:300, alignSelf:'center', alignItems:'center'}} scrollEnabled={false} >
        <Text style={styles.noTasktext}> No Task Yet ... </Text>
        <Image source={ require('../assets/task.png')}  style={{width:300, height:300, marginTop:-30}} />
        </View>
        : 
        <FlatList 
        data={listData()}
        renderItem={renderItem} 
        keyExtractor={renderKey}
      />
    }
    <TaskDetailModal modalOn={taskDetailModal.modal} modalOff={ () => setTaskDetailModal(false, 1)}
                    task_no={taskDetailModal.task_no} />
  </View>
  );
};

export default TodoList_v2;
const styles=StyleSheet.create({
  box:{
    flex:1, 
  },
  container : {
     width:340,
  },
  task:{
    justifyContent: 'center',
  },
  itemContainer : {
    flex:1,
    marginTop:10,
    backgroundColor:'white',
    borderRadius:7,
    marginRight:50,
    },
  listtext : {
    fontFamily:"BMJUA",
    color:"#191970",
    fontSize:20,
    width:'55%',
    marginLeft:8,
    marginTop:10
    },
  noTasktext : {
      alignSelf:'center',
      fontFamily:"BMJUA",
      color:"white",
      fontSize:32,
      width:200,
      marginLeft:27,
      marginTop:10
  },
  priorityText : {
      fontFamily:"BMJUA",
      color:"#191970",
      fontSize:20,
      width:85,
      marginLeft:3,
      marginTop:10
  },
  itemTaskContainer:{
      flexDirection:'row',
  },
  HighPriority:{
      flex:1,
      marginTop:10,
      backgroundColor:'#FFC0CB',
      borderRadius:7,
      shadowColor: "pink",
      shadowOffset: {
          width: 0,
          height: 7,
      },
      shadowOpacity: 0.43,
      shadowRadius: 9.51,
      elevation: 15,
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
  exp : {
    fontFamily:"BMJUA",
    color:"#191970",
    fontSize:15,
    marginLeft:12,
    marginTop:10,
    marginBottom:5,
    paddingTop:10,
  },
  notComplete:{
    backgroundColor:'#191970',
    justifyContent:'center',
    alignSelf:'center',
    marginTop:5,
    marginLeft:10,
    marginRight:10,

    height:30,
    width:50,
    borderRadius:5,
  },
  perforemd:{
    fontFamily: 'BMJUA',
    color: 'white',
    fontSize: 15,
    paddingRight:5,
    justifyContent:'center',
    alignSelf:'center',
  },
  complete:{
    backgroundColor:'#FFB6C1',
    justifyContent:'center',
    alignSelf:'center',
    marginTop:5,
    marginLeft:10,
    marginRight:10,
    height:30,
    width:50,
    borderRadius:5,
    opacity:0.7,
  },
    
})