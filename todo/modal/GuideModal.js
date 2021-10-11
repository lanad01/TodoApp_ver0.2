import React, { useEffect, useState } from 'react';
import Modal from 'react-native-modal';
import { View, Text, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-shadow-cards';
import { styles } from '../screen/styles/taskListStyle';
import Animated, {  useAnimatedStyle,  useSharedValue,  withTiming,withRepeat } from 'react-native-reanimated';

export const GuideModal = props => {
  const offset = useSharedValue(0);
  const reanimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value }],
    };
  });
  useEffect(() => {
    console.log("GuideModal Animation working on now")
    // 1.5초 주기로 -250의 value값으로 withTiming Action으로 영원히 반복되는 애니메이션
    offset.value = withRepeat(withTiming(-250, { duration: 1500 }),-1,true);
  }, [])
  

  const exitModal = () => {
    props.modalOff()
  };
  return (
    <Modal isVisible={props.modalOn} avoidKeyboard={true} transparent={true}>
      <View>
        <View
          style={styles.guideHeaderCont}>
          <Text
            style={styles.guideHeaderText}>
            [ 이용 가이드 ]
          </Text>
          <Text
            style={styles.guideText}>
            Task 삭제를 원하실 경우 {'\n'}
            해당 TASK를 아래와 같이 당겨주세요!
          </Text>
        </View>
        <Animated.View style={reanimatedStyle}>
          <Card style={styles.cardForGuide}>
            <View style={styles.taskCont}>
              <View style={styles.task1st}>
                <Text
                  style={styles.taskName}
                  ellipsizeMode={'tail'}
                  numberOfLines={1}>
                  Having Lunch
                </Text>
                <Text style={styles.taskPrior}>[ Middle ]</Text>
              </View>
              <View style={{ alignSelf: 'flex-start' }}>
                <Text style={styles.taskExp}>2021년 12월 25일</Text>
              </View>
            </View>
          </Card>
        </Animated.View>
        <View style={styles.rowBackForGuide}>
          <Text style={styles.deleteBtnForGuide}> ＜＜＜Delete </Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => exitModal()}>
        <View style={styles.guideModalBtn}>
          <Text style={styles.guideModalBtnText}>확인했습니다.</Text>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
