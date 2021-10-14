import React, { useState, useEffect, useRef, useContext } from 'react';
import { Animated, Dimensions, Text, View, PanResponder, TouchableOpacity, Image,
} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Card } from 'react-native-shadow-cards';
import ActionButton from 'react-native-action-button';

import { GuideModal } from '../../../../modal/GuideModal';
import { TaskDetailModal } from '../../../../modal/TaskDetailModal';
import { Loading } from '../../../../modal/Loading';
import { TodoContext } from '../../../../context/todoContext';
import { AuthContext } from '../../../../context/authcontext';
import { AddModal } from '../../../../modal/AddModal';
import { DB } from '../../../../userTableConnection';
import { DPW } from '../../../../config/dp';
import { styles } from '../style/taskListStyle';

const rowTranslateAnimatedValues = {};

export const TaskScreen = ({ navigation }) => {
  const todoContext = useContext(TodoContext);
  const authContext = useContext(AuthContext);
  const [render, reRender] = useState(1); // 강제 렌더링

  const [loading, setLoading] = useState(false); // Loading 모달
  const [addModal, setAddModal] = useState(false); //Task추가 모달
  const [detailModal, setDetailModal] = useState(false) //Detail Task 확인 모달
  const [detailTask_no,setDetailTask_no] = useState(); //Detail Task에 보낼 특정 Task_no
  const [showGuideModal, setShowGuideModal] = useState(false);

  //가이드 애니메이션 출력
  useEffect(() => {
    setShowGuideModal(true); 
    return () => {}
  }, [])

  //Todo List 출력
  useEffect( () => {
    getTaskList = async function(){ // taskList를 받아오는 함수를 async처리
      await DB.transaction(tx => {
        console.log("taskList ListSelect mounted")
        tx.executeSql(
          'SELECT task_no, task_name, priority, exp, performed FROM task_info2 WHERE user_no=?',
          [authContext.user_no],
          (tx, res) => {
            let len = res.rows.length;
            if (len === 0) {
              // console.log("Array length 0")
            } else if (len > 0) {
              for (let i = 0; i < len; i++) {
                let priority = res.rows.item(i).priority;
                if (priority === null) {
                  priority = 'Middle';
                }
                //context에 조회된 데이터 row수만큼 배열 생성
                todoContext.task_no[i] = res.rows.item(i).task_no;
                todoContext.task_name[i] = res.rows.item(i).task_name;
                todoContext.task_prior[i] = priority;
                todoContext.task_exp[i] = res.rows.item(i).exp;
                todoContext.performed[i] = res.rows.item(i).performed;
                setList(); //taskContext 배열정보에 넣은 뒤 애니메이션 전용 배열 생성
              }
            }
          },
          error => {
            console.log('Failed' + error);
          },
        );
      });
    } 
    setLoading(true)
    getTaskList() //async await 활용
    .then(setLoading(false))
    return () => {};
  }, [render]);

  const getTaskDetail = index => { // index = 클릭 된 task의 task_no
    console.log("indx" + index)
    setDetailTask_no(index) // 해당 task_no(Primary Key)의 디테일을 출력하는 모달
    setDetailModal(true);
  }
  const deleteTask = (i, task_no) => { // i = 배열의 index, 클릭된 배열이 실제 가지고 있는 task_no(PK)
    DB.transaction(tx => {
      DB.executeSql(
        'DELETE FROM task_info2 WHERE task_no=?', //수령한 task_no에 해당하는 row 삭제
        [task_no], 
        (tx, res) => {
          console.log('Delete Success');
          // 배열 정보에서 삭제
          todoContext.task_name.splice(i, 1);
          todoContext.task_prior.splice(i, 1);
          todoContext.task_exp.splice(i, 1);
          todoContext.task_no.splice(i, 1);
          todoContext.performed.splice(i, 1);
          getTaskList() //다시 getTask로 DB방문하여 리스트 출력 ? 다른 좋은 방법 없을까
          .then(setLoading(false))
        },
        error => {
          console.log('Delete Failed' + error);
        },
      );
    });
  };

  Array(todoContext.task_name.length) 
    //각 List row에 해당하는 Animated.Value 생성 - 이 부분은 Hook이 아니라 배열로 가능
    .fill('')
    .forEach((_, i) => {
      rowTranslateAnimatedValues[`${i}`] = new Animated.Value(1);
    });

  const [listData, setListData] = useState(); //애니메이션 전용 Array
  const setList = () => { // task의 숫자만큼 배열 : key - index / text - 해당 task의 기본키
    setListData(
      Array(todoContext.task_name.length)
        .fill('')
        .map((_, i) => ({
          key: `${i}`, 
          text: todoContext.task_no[i] })),
    );
  };

  const animationIsRunning = useRef(false); //애니메이션 액션 진행 boolean
  
  const onSwipeValueChange = swipeData => {
    const { key, value } = swipeData;
    if ( // swipe한 value의 값이 negative가 되고 animationRunning Ref가 false일 경우(애니메이션 액션 false상태)
      value < -Dimensions.get('window').width && 
      !animationIsRunning.current
    ) {
      animationIsRunning.current = true;
      Animated.timing(rowTranslateAnimatedValues[key], { //각 rowAnimated Value에는 1의 값이 들어가 있으며,
        toValue: 0, // 0 Value를 향행
        duration: 200, // 0.2초가 실행되며
        useNativeDriver: false, // NativeDriver를 사용하지않는다.
      }).start(() => { //애니메이션이 실행되면
        const newData = [...listData]; // 배열로 된 state값을 바꾸기 위한 copy
         // 배열로 생성된 listData에서 이번에 선택된 index는 key값에 보관되어 있다.
        const prevIndex = listData.findIndex(item => item.key === key)
        newData.splice(prevIndex, 1); // 해당 index에서 1개의 값을 삭제
        setListData(newData); // listData는 변경된 Array의 값과 동기화된다.
        setLoading(true)
        deleteTask(key, listData[key].text);
        animationIsRunning.current = false;
      });
    }
  };
  const renderHiddenItem = () => ( // LeftSwipe시 생성되는 뒤쪽 View
    <View style={styles.rowBack}>
      <View style={[styles.backRightBtn, styles.backRightBtnRight]}>
        <Text style={styles.backTextWhite}>  ＜＜＜Delete</Text>
      </View>
    </View>
  );
  const flatListSeparator = () => { // Separator
    return ( <View style={ styles.separator}/>);};

  const pan = new Animated.ValueXY();
  const panResponder = PanResponder.create({
    // gestureState : 제스처의 속도 누적 이동거리 등 데이터 접근 경로
    onMoveShouldSetPanResponder: (evt, gestureState) => { //터치이벤트에 반응할지 여부
      return !(gestureState.dx === 0 && gestureState.dy === 0);
    },
    // [ gesture state에서 받을 수 있는 props ]
    // stateID - 제스처 id
    // moveX - 마지막(최신,latest)에 이동한 요소의 좌표
    // moveY - 마지막(최신,latest)에 이동한 요소의 좌표
    // x0 - 이동직전의 좌표. 즉 터치이벤트가 발생한 순간의 좌표인 것 같다.
    // y0 - 이동직전의 좌표. 즉 터치이벤트가 발생한 순간의 좌표인 것 같다.
    // dx - 터치가 시작된 이후 제스처의 누적(움직인) 거리
    // dy - 터치가 시작된 이후 제스처의 누적(움직인) 거리
    // vx - 제스처의 현재 속도
    // vy - 제스처의 현재 속도
    // numberActiveTouches: 현재 화면에 표시된 터치 수, 세손가락을 올리면 3이다.


    onPanResponderGrant: () => { // 터치 이벤트 발생할 때 실행
      pan.setOffset({
        x: pan.x._value,
        y: pan.y._value,
      });
    },
    onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { // 진행 중일 때의 이벤트
      useNativeDriver: false,
    }),
    onPanResponderRelease: () => { // 터치 이벤트 종료시 실행
      pan.flattenOffset();
    },
  });
  return (
    <View style={styles.container}>
      <View style={styles.underLine}/>
      { todoContext.task_no.length < 1 
      ?  //Task가 없는 경우 : Add to task 그림을 출력
      <TouchableOpacity onPress={()=> setAddModal(true)}>
        <View style={{alignItems:'center', justifyContent: 'center',}}>
          <Text style={styles.noTaskText}>
            Press Img to Add Task
          </Text>
          <Image source={require('../../../../assets/images/task.png')} 
            style={styles.noTaskImg}/>
        </View>
      </TouchableOpacity>
      : //Task가 존재한 경우 : List 출력
      <SwipeListView
        ItemSeparatorComponent={flatListSeparator} // listSeparator
        disableRightSwipe //오른쪽 스와이프 불가
        data={listData}
        renderHiddenItem={renderHiddenItem} //스와이프 할 때 뒤쪽 view
        rightOpenValue={-Dimensions.get('window').width} //오른쪽 delete버튼이 발생하는 기준 value
        onSwipeValueChange={onSwipeValueChange}//터치 이벤트 발생
        useNativeDriver={false} // Native Driver사용 여부, 필수
        renderItem={({ data, index }) => (
          <Card style={styles.card}>
            <TouchableOpacity
                onPress={() => getTaskDetail(todoContext.task_no[index])}
                style={styles.rowFront}
                underlayColor={'#AAA'}>
            <Animated.View
              style={[
                styles.rowFrontContainer,
                { height: rowTranslateAnimatedValues[index] },
              ]}>
                <View style={styles.taskCont}>
                  <View style={styles.task1st}>
                    <Text
                      style={styles.taskName}
                      ellipsizeMode={'tail'}
                      numberOfLines={1}>
                      {todoContext.task_name[index]}
                    </Text>
                    <Text style={styles.taskPrior}>
                      [ {todoContext.task_prior[index]} ]
                    </Text>
                  </View>
                  <View style={{alignSelf: 'flex-start',}}>
                    <Text style={styles.taskExp}>
                      {todoContext.task_exp[index]}{' '}
                    </Text>
                  </View>
                </View>
            </Animated.View>
            </TouchableOpacity>
          </Card>
          
        )}
      />
      }
      <Animated.View
        style={{
          transform: [{ translateX: pan.x }, { translateY: pan.y }],
          top:1000 * DPW,
          right:25 * DPW,
          alignSelf: 'flex-end',
          position:'absolute',
        }}
        {...panResponder.panHandlers}>
        <TouchableOpacity onPress={() => setAddModal(true)}>
          <View style={styles.addBtnContainer}>
            <View style={styles.actionBtnContainer}>
              <ActionButton buttonColor="rgba(231,76,60,1)" />
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
      
      <View style={styles.bottomLine}/>
      
      <AddModal
        modalOn={addModal}
        modalOff={() => setAddModal(false)}
        render={() => reRender(render + 1)}
      />
      <Loading modalOn={loading} />
      <GuideModal modalOn={showGuideModal} modalOff={ () => setShowGuideModal(false)}   />
      <TaskDetailModal 
        modalOn={detailModal} 
        modalOff={()=> setDetailModal(false)} 
        task_no={detailTask_no}
        render={() => reRender(render+1)} />
    </View>
  );
};

