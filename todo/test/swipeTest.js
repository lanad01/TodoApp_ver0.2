import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';
import GestureRecognizer, {
  swipeDirections,
} from 'react-native-swipe-gestures';

export default swipe = () => {
  const [myText, setText] = useState('Im ready to use swipe');
  const [gestureName, setGestureName] = useState('none');
  const [color, setColor] = useState('#fff');
  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
  };

  function onSwipeUp(gestureState) {
    setText('up');
  }

  function onSwipeDown(gestureState) {
    setText('down');
  }

  function onSwipeLeft(gestureState) {
    setText('lft');
  }

  function onSwipeRight(gestureState) {
    setText('rit');
  }

  function onSwipe(gestureName, gestureState) {
    const { SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections;
    setGestureName(gestureName);
    // this.setState({ gestureName: gestureName });
    switch (gestureName) {
      case SWIPE_UP:
        setColor('blue');
        break;
      case SWIPE_DOWN:
        setColor('pink');
        break;
      case SWIPE_LEFT:
        setColor('oreange');

        break;
      case SWIPE_RIGHT:
        setColor('yellow');

        break;
    }
  }
  return (
    <GestureRecognizer
      onSwipe={(direction, state) => onSwipe(direction, state)}
      onSwipeUp={state => onSwipeUp(state)}
      onSwipeDown={state => onSwipeDown(state)}
      onSwipeLeft={state => onSwipeLeft(state)}
      onSwipeRight={state => onSwipeRight(state)}
      config={config}
      style={{ flex: 1, backgroundColor: color }}>
      <Text style={{ alignItems: 'center' }}> {myText}</Text>
    </GestureRecognizer>
  );
};
