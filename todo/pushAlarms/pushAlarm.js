import PushNotification from 'react-native-push-notification';

export const AUTO_LOGIN_PUSH_ALARM = (authContext, number_of_task) => {
  PushNotification.cancelAllLocalNotifications();
  PushNotification.localNotification({
    channelId: 'test-channel',
    title: '자동 로그인 되었습니다. ',
    message:
      '환영해요! ' +
      authContext.name +
      '님' +
      ' 완료 대기 Task는 총' +
      number_of_task +
      '개입니다',
    color: 'red',
    showWhen: true,
    when: Math.floor(new Date().getTime()),
    largeIcon: 'splash_icon', // (optional) default: "ic_launcher". Use "" for no large icon.
    smallIcon: 'splash_icon', // (optional) default: "ic_notification" with fallback for "ic_laun
  });
};

export const BACKGROUND_ALARM_ABOUT_TO_EXPIRED_DATE = number_of_task_about_exp => {
    console.log('NUMBER' + number_of_task_about_exp);
    PushNotification.cancelAllLocalNotifications(); //기존의 메시지는 모두 삭제한다
    PushNotification.localNotificationSchedule({
      channelId: 'test-channel', // route에서 만든 channelId와 동기화해야한다.
      title: '기한임박인 Task가 있습니다.',
      message: '총 '+number_of_task_about_exp+"개",
      date: new Date(Date.now() + 10 * 1000), // 푸쉬가 되는 시간 : 10초후
      repeatType: 'day', //1분마다 알람이 간다
      allowWhileIdle: true,
      ignoreInForeground: false, //active 상태일 경우 무시한다
      showWhen: true, //시간 표시 true
      timeoutAfter:600 * 1000, // 푸쉬 time out 600초
      color: 'red',
      when: Math.floor(new Date().getTime()),
      largeIcon: 'splash_icon', // (optional) default: "ic_launcher". Use "" for no large icon.
      smallIcon: 'splash_icon', // (optional) default: "ic_notification" with fallback for "ic_laun
    });
  };
