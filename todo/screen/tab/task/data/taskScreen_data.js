import React from 'react';
import {  Animated,  Dimensions,  View, } from 'react-native';

import { GuideModal } from '../../../modal/GuideModal';
import { TaskDetailModal } from '../../../modal/TaskDetailModal';
import { Loading } from '../../../../modal/Loading';
import { TodoContext } from '../../../../context/todoContext';
import { AuthContext } from '../../../../context/authcontext';
import { AddModal } from '../../../modal/AddModal';
import { TaskScreen } from '../view/taskScreen';
import {
  SELECT_TASKLIST_BY_USERNO,
  DELETE_TASK,
  UPDATE_TASK_PERFORMED,
} from '../../../../sqliteConnection/taskTableConnection';

const rowTranslateAnimatedValues = {};

export const TaskScreen_Data = ({ navigation }) => {
  const todoContext = React.useContext(TodoContext);
  const authContext = React.useContext(AuthContext);
  const [render, reRender] = React.useState(1); // 강제 렌더링

  const [loading, setLoading] = React.useState(false); // Loading 모달
  const [addModal, setAddModal] = React.useState(false); //Task추가 모달
  const [detailModal, setDetailModal] = React.useState(false); //Detail Task 확인 모달
  const [detailTask_no, setDetailTask_no] = React.useState(); //Detail Task에 보낼 특정 Task_no
  const [showGuideModal, setShowGuideModal] = React.useState(false); //가이드 애니메이션 모달

  //TaskScreen이 처음 mount 될 때 가이드 애니메이션 출력
  React.useEffect(() => {
    setShowGuideModal(true);
    return () => {
      setShowGuideModal(false);
    };
  }, []);
  //Todo List 출력
  React.useEffect(() => {
    const getTaskList = async () => {
      //현재 유저의 TaskList를 검색
      const taskList = await SELECT_TASKLIST_BY_USERNO(authContext.user_no);
      taskList.map((v, i) => {
        todoContext.taskInfo[i] = v; //context와 동기화
        const split=v.exp_date.split('-')
        todoContext.task_exp[i]=new Date(split[0], split[1]-1, split[2]).getTime()
        setList(); //애니메이션 용 배열 정보를 각 iteration마다 추가하는 메소드
      });
      console.log("왜 없던게 "+JSON.stringify(todoContext.taskInfo))
    };
    setLoading(true);
    getTaskList() //async await 활용
      .then(setLoading(false));
    return () => {};
  }, [render]);

  //Task 클릭 시 명세창 출력
  const getTaskDetail = index => {
    // index = 클릭 된 task의 task_no
    setDetailTask_no(index); // 해당 task_no(Primary Key)의 디테일을 출력하는 모달
    setDetailModal(true);
  };

  //Task 삭제 실행
  const deleteTask = async (i, task_no) => {
    // i = 배열의 index, 클릭된 배열이 실제 가지고 있는 task_no(PK)
    DELETE_TASK(task_no); //task삭제 DB ACCESS
    todoContext.taskInfo.splice(i, 1); //배열정보에서 삭제
  };

  //각 Task마다 Animated Value 
  Array(todoContext.taskInfo.length)
    //각 List row에 해당하는 Animated.Value 생성 - 이 부분은 Hook이 아니라 배열로 가능
    .fill('')
    .forEach((_, i) => {
      rowTranslateAnimatedValues[`${i}`] = new Animated.Value(1);
    });

  //애니메이션 전용 Array
  const [listData, setListData] = React.useState(); 
  const setList = () => {
    // task의 숫자만큼 배열 : key - index / text - 해당 task의 기본키
    setListData(
      Array(todoContext.taskInfo.length)
        .fill('')
        .map((_, i) => ({
          key: `${i}`,
          text: todoContext.taskInfo[i].task_no,
        })),
    );
  };

  const animationIsRunning = React.useRef(false); //애니메이션 액션 진행 boolean

  //Task Swipe시 삭제 로직
  const onSwipeValueChange = async swipeData => {
    const { key, value } = swipeData;
    if (
      // swipe한 value의 값이 negative가 되고 animationRunning Ref가 false일 경우(애니메이션 액션 false상태)
      value < -Dimensions.get('window').width &&
      !animationIsRunning.current
    ) {
      animationIsRunning.current = true;
      Animated.timing(rowTranslateAnimatedValues[key], {
        //각 rowAnimated Value에는 1의 값이 들어가 있으며,
        toValue: 0, // 0 Value를 향행
        duration: 200, // 0.2초가 실행되며
        useNativeDriver: false, // NativeDriver를 사용하지않는다.
      }).start(() => {
        //애니메이션이 실행되면
        const newData = [...listData]; // 배열로 된 state값을 바꾸기 위한 copy
        // 배열로 생성된 listData에서 이번에 선택된 index는 key값에 보관되어 있다.
        const prevIndex = listData.findIndex(item => item.key === key);

        newData.splice(prevIndex, 1); // 해당 index에서 1개의 값을 삭제
        setListData(newData); // listData는 변경된 Array의 값과 동기화된다.
        setTimeout(() => {
          reRender(render + 1); //getTaskList 렌더링 시도
        }, 500); //여기서 timeOut을 주지 않으면 ListData와 newData사이의 간극이 생겨
        // undefined가 생겨버린다.
        setLoading(true);
        deleteTask(key, listData[key].text);                            
        animationIsRunning.current = false;
        setLoading(false);
      });            
    }
  };

  //완료처리
  const complete = async (index, task_no) => {     
    UPDATE_TASK_PERFORMED(task_no)
    todoContext.taskInfo[index].performed=true   
  }                                                                                             
  return (                                              
    <View style={{flex:1}}>                                                          
      <TaskScreen
        addModal={() => setAddModal(true)}
        listData={listData}
        onSwipeValueChange={onSwipeValueChange}
        getTaskDetail={ index => getTaskDetail(todoContext.taskInfo[index].task_no)}
        rowTranslateAnimatedValues={rowTranslateAnimatedValues}
        complete={complete}
      />
      <AddModal
        modalOn={addModal}
        modalOff={() => setAddModal(false)}
        render={() => reRender(render + 1)}
      />
      <Loading modalOn={loading} />
      <GuideModal
        modalOn={showGuideModal}
        modalOff={() => setShowGuideModal(false)}
      />
      <TaskDetailModal
        modalOn={detailModal}
        modalOff={() => setDetailModal(false)}
        task_no={detailTask_no}
        render={() => reRender(render + 1)}
      />
    </View>
  );
};
