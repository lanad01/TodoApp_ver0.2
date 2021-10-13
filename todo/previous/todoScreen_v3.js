import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, FlatList, StyleSheet, Text, View, Image , Alert, TouchableOpacity, 
                         } from 'react-native';
import { TodoContext } from '../todoContext';
import { AuthContext } from '../authcontext';
import { TaskDetailModal } from '../modal/TaskDetailModal';
import {TouchableWithoutFeedback, } from 'react-native-gesture-handler';
import  Animated, { useSharedValue, useAnimatedStyle,withTiming,withSpring, 
} from 'react-native-reanimated';
import { DB } from '../globalVar';
import { styles } from './styles/taskListStyle';

const reanimatedStyle = []
const TaskListScreen = (props) => {
  
  const todoContext = React.useContext(TodoContext);
  const authContext = React.useContext(AuthContext);
  const [showBox, setShowBox] = useState(true);
  const [noTask, setNoTask] = useState(0); 
  const [taskDetailModal,setTaskDetailModal]=useState({
    modal : false,
    task_no : 0
  });
  
  useEffect(() => {
    console.log("getTaskDEtail")
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

  var len=todoContext.task_no.length;
  const progress=useSharedValue(30)
  reanimatedStyle.length=len
  
  reanimatedStyle[0]=useAnimatedStyle(()=> {
    // console.log("progressValue:"+progress.value)
    return{ 
      transform:[{translateX:progress.value}], 
      }
  })
  reanimatedStyle[1]=useAnimatedStyle(()=> {
    // console.log("progressValue:"+progress.value)
    return{ 
      transform:[{translateX:progress.value}], 
      }
  })
  
  const animated = i => {
    console.log(i)
    progress.value=withSpring(-progress.value)
  }
 
  return (
    <View style={styles.container}>
        { noTask ===0 ? 
        <View style={{width:300, alignSelf:'center', alignItems:'center'}} scrollEnabled={false} >
        <Text style={styles.noTasktext}> No Task Yet ... </Text>
        <Image source={ require('../assets/task.png')}  style={{width:300, height:300, marginTop:-30}} />
        </View>
        : 
        <FlatList  
data={todoContext.task_name, todoContext.task_prior, todoContext.task_exp, todoContext.task_no, todoContext.performed }
        renderItem={({ index }) => (  
         
            <Animated.View   key={index.toString()} style={reanimatedStyle[index]} >
               
            <TouchableOpacity onPress={ () => {animated(index)}} 
            // onPress={() => details(todoContext.task_no[index])*/ 
            >
              <View style={todoContext.task_prior[index]==="High" ? styles.HighPriority : styles.itemContainer}> 
                  <View style={{flexDirection:'row' }}>
                      <Text style={styles.listtext} ellipsizeMode={'tail'} numberOfLines={1} >
                        {todoContext.task_name[index]} { todoContext.task_no[index]} 
                      </Text>
                      <Text style={styles.priorityText}>[ {todoContext.task_prior[index]} ]</Text>
                      <View>
                      <TouchableOpacity onPress={() => deleteTask(todoContext.task_no[index], index)}>
                      <Image source={require("../assets/bin3.png")} 
                      style={{width:35, height:30, marginTop:5, }}/>
                      </TouchableOpacity>
                      </View>
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

          </Animated.View>
        )}
      />
    }
    <TaskDetailModal modalOn={taskDetailModal.modal} modalOff={ () => setTaskDetailModal(false, 1)}
                    task_no={taskDetailModal.task_no} />
  </View>
  );
};

export default TaskListScreen;