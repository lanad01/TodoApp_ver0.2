import React from 'react';
import {  Animated,  Dimensions,  Text,  View,  PanResponder,  TouchableOpacity,  Image,  } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Card } from 'react-native-shadow-cards';
import ActionButton from 'react-native-action-button';
import { TodoContext } from '../../../../context/todoContext';
import { DPW } from '../../../../config/dp';
import { styles } from '../style/taskListStyle';

export const TaskScreen = props => {
  const todoContext = React.useContext(TodoContext);
  const today = new Date(new Date().setHours(0, 0, 0, 0)); //오늘 자정시간의 time value
  const renderHiddenItem = () => (
    // LeftSwipe시 생성되는 뒤쪽 View
    <View style={styles.rowBack}>
      <View style={[styles.backRightBtn, styles.backRightBtnRight]}>
        <Text style={styles.backTextWhite}> ＜＜＜Delete</Text>
      </View>
    </View>
  );
  const flatListSeparator = () => {
    // Separator
    return <View style={styles.separator} />;
  };

  const pan = new Animated.ValueXY();
  const panResponder = PanResponder.create({
    // gestureState : 제스처의 속도 누적 이동거리 등 데이터 접근 경로
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      //터치이벤트에 반응할지 여부
      return !(gestureState.dx === 0 && gestureState.dy === 0);
    },

    onPanResponderGrant: () => {
      // 터치 이벤트 발생할 때 실행
      pan.setOffset({
        x: pan.x._value,
        y: pan.y._value,
      });
    },
    onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
      // 진행 중일 때의 이벤트
      useNativeDriver: false,
    }),
    onPanResponderRelease: () => {
      // 터치 이벤트 종료시 실행
      pan.flattenOffset();
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.underLine} />
      {todoContext.taskInfo.length < 1 ? (
        //Task가 없는 경우 : Add to task 그림을 출력
        <TouchableOpacity onPress={props.addModal}>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.noTaskText}>Press Img to Add Task</Text>
            <Image
              source={require('../../../../assets/images/task.png')}
              style={styles.noTaskImg}
            />
          </View>
        </TouchableOpacity>
      ) : (
        //Task가 존재한 경우 : List 출력
        <SwipeListView
          ItemSeparatorComponent={flatListSeparator} // listSeparator
          disableRightSwipe //오른쪽 스와이프 불가
          data={props.listData}
          renderHiddenItem={renderHiddenItem} //스와이프 할 때 뒤쪽 view
          rightOpenValue={-Dimensions.get('window').width} //오른쪽 delete버튼이 발생하는 기준 value
          onSwipeValueChange={props.onSwipeValueChange} //터치 이벤트 발생
          useNativeDriver={false} // Native Driver사용 여부, 필수
          renderItem={({ index }) => (
            <Card 
              style={
              todoContext.taskInfo[index].performed == 0  //Task 미완료 True or false
              ? styles.card
              : styles.card_perfomed}>
              <TouchableOpacity
                onPress={() => props.getTaskDetail(index)}
                style={styles.rowFront}>
                <Animated.View
                  style={[
                    styles.rowFrontContainer,
                    { height: props.rowTranslateAnimatedValues[index] },
                  ]}>
                  {todoContext.task_exp[index] < today.getTime() ? ( //만료된 Task - Text
                    <Text style={styles.taskCont_not_expired_text}>=== 만 료 ===</Text>
                  ) : (
                    <></>
                  )}
                  <View
                    style={
                      todoContext.task_exp[index] < today.getTime() //만료된 Task 스타일
                        ? styles.taskCont_expired
                        : styles.taskCont
                    }>
                    <View style={styles.task1st}>
                      <Text
                        style={styles.taskName}
                        ellipsizeMode={'tail'}
                        numberOfLines={1}>
                        {todoContext.taskInfo[index].task_name}
                      </Text>
                      <Text style={styles.taskPrior}>
                        [ {todoContext.taskInfo[index].priority} ]
                      </Text>
                    </View>
                    <View style={styles.task2nd}>
                      <Text style={styles.taskExp}>
                        {todoContext.taskInfo[index].exp}
                      </Text>
                      <TouchableOpacity
                        style={styles.completeBtnView}
                        onPress={() => props.complete(index,todoContext.taskInfo[index].task_no)}>
                        <Text style={styles.completeTextView}>
                          {todoContext.taskInfo[index].performed == 0 //Task 미완료 True or false
                            ? '완료'
                            : '완료됨'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Animated.View>
              </TouchableOpacity>
            </Card>
          )}
        />
      )}
      <Animated.View
        style={{
          transform: [{ translateX: pan.x }, { translateY: pan.y }],
          top: 1000 * DPW,
          right: 25 * DPW,
          alignSelf: 'flex-end',
          position: 'absolute',
        }}
        {...panResponder.panHandlers}>
        <TouchableOpacity onPress={props.addModal}>
          <View style={styles.addBtnContainer}>
            <View style={styles.actionBtnContainer}>
              <ActionButton buttonColor="rgba(231,76,60,1)" />
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.bottomLine} />
    </View>
  );
};
