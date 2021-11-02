import React from 'react';

import { View, Text, TouchableOpacity } from 'react-native';
import moment from 'moment';
import OneButtonModal from '../../../component/OneButtonModal';
import { AuthContext } from '../../../context/authcontext';
import { SELECT_EXP_DATE_OF_TASKS } from '../../../sqliteConnection/taskTableConnection';
import { TodoContext } from '../../../context/todoContext';
import { Loading } from '../../../component/Loading';
import { styles } from './calendarStyle';
import TasksByDateModal from '../../modal/TasksByDateModal';
import Calendar from './calendar';

const Calendar_Data = ({ navigation }) => {
  const authContext = React.useContext(AuthContext);
  const todoContext = React.useContext(TodoContext);
  const [loading, setLoading] = React.useState(false);
  const [dateDetailModal, setDateDetailModal] = React.useState(false); // 특정날짜 클릭 시 발동하는 모달 
  const [selected_date, setSelected_Date] = React.useState(); // 특정날짜 state

  //Calendar가 focus 될 때마다 Task가 등록되어 있는 날짜정보를 가져온다
  React.useEffect(() => {
    const subscribe = navigation.addListener('focus', async () => {
      //foucs될 때마다 발동 , 이게 핵심
      setLoading(true);
      //현재 유저가 가진 tasks들의 exp_date를 조회한다.
      const getDate_of_tasks = await SELECT_EXP_DATE_OF_TASKS(authContext.user_no); 
      //todoContext와 동기화한다
      todoContext.list_of_date = await getDate_of_tasks;
      setLoading(false); //로딩처리를 통해 리렌더링을 자연스럽게 유도
    });
    return subscribe;
  }, [navigation]);

  //특정 날짜 클릭시 작동
  const taskCheck = date => {
    //parameter - date 날짜의 Task 목록을 출력하는 모달 true 
    setSelected_Date(date);
    setDateDetailModal(true);
  };

  const [getMoment, setMoment] = React.useState(moment()); //현재 시각 정보
  // 현재달일 경우 저번달로 넘어가지 못하게 하는 모달
  const [errorModal_last_month, setErrorModal_last_month] = React.useState(false); 
  const this_month_value = moment(new Date()).month(); //이번달
  const this_year_value = moment(new Date()).year(); //올해

  const today = getMoment;
  let day = ['일', '월', '화', '수', '목', '금', '토']; //요일 정보
  const firstWeek = today.clone().startOf('month').week(); //현재 날짜 정보가 가지는 month의 첫째 주 정보를 가져온다
  const lastWeek =
    today.clone().endOf('month').week() === 1 //현재날짜 정보가 가지는 month의 마지막 주 정보를 가져온다
      ? 53 //12월 마지막째 주가 그 해의 52번째 주를 넘겨서 1로 되었을 때는 이를 53으로 인식시켜야한다. 
      : today.clone().endOf('month').week(); 

  const calendarArr = () => { //달력 각 Booth에 들어갈 날짜정보
    let result = [];
    let week = firstWeek; 
    for (week; week <= lastWeek; week++) { //첫째주부터 마지막째 주까지 반복해서 7개씩 흩뿌린다
      result = result.concat(   //날짜 정보를 하나씩 추가해간다.
        <View key={week} style={styles.container}>
          {Array(7) //today를 기준으로 조회한 이번 달의 첫째 주부터 마지막 주까지 Array
            .fill(0)
            .map((data, index) => { //result에는 해당 날짜를 하나씩 붙여간다.
              let days = today
                .clone()
                .startOf('year')
                .week(week)
                .startOf('week')
                .add(index, 'day'); //d로해도되지만 직관성 - index값에  day정보 
              // console.log("days console : "+days.date())

              let have_Task = false; //Task가 등록되어 있는 날 변수
              if (moment().format('YYYYMMDD') === days.format('YYYYMMDD')) { //정확히 오늘 날짜와 일치하는 date
                return (
                  <View key={index} style={styles.today}>
                    <TouchableOpacity
                      onPress={() => taskCheck(days.format('YYYY-MM-DD'))}>
                      <Text style={styles.daysText}>{days.format('D')}</Text>
                    </TouchableOpacity>
                  </View>
                );
              } else if (days.format('MM') !== today.format('MM')) { //이번달이 아니지만 달력에 출력된 dates
                return (
                  <View key={index} style={styles.days_not_this_month}>
                    <Text style={styles.days_not_this_month_text}>
                      {days.format('D')}
                    </Text>
                  </View>
                );
              } else if (todoContext.list_of_date.includes(days.format('YYYY-MM-DD'))) { // Task가 존재하는 날짜가 해당 index의 날짜를 포함할 경우 
                // have task는 true가 되고 해당 날짜의 View는 핑크색이 된다.
                have_Task = true; 
                return (
                  <View
                    key={index}
                    style={
                      have_Task ? styles.days_have_task : styles.days_this_month
                    }>
                    <TouchableOpacity
                      onPress={() => taskCheck(days.format('YYYY-MM-DD'))}> 
                      <Text style={styles.taskMark}> T </Text>
                      <Text style={styles.daysText}>{days.format('D')}</Text>
                    </TouchableOpacity>
                  </View>
                );
              } else { //이외의 이번달 날짜들은 하얀색으로 출력
                return (
                  
                  <View key={index} style={styles.days_this_month}>
                    <TouchableOpacity
                      onPress={() => taskCheck(days.format('YYYY-MM-DD'))}> 
                    <Text style={styles.daysText}>{days.format('D')}</Text>
                    </TouchableOpacity>
                  </View>
                );
              }
            })}
        </View>,
      );
    }
    return result;
  };

  return (
    <View>
      <Calendar
        this_month_value={this_month_value}
        this_year_value={this_year_value}
        getMoment={getMoment}
        setErrorModal_last_month={() => setErrorModal_last_month(true)}
        previous_month={() => setMoment(getMoment.clone().subtract(1, 'month'))}
        next_month={() => setMoment(getMoment.clone().add(1, 'month'))}
        today={today}
        day={day}
        calendarArr={() => calendarArr()}
      />

      <OneButtonModal
        modalOn={errorModal_last_month}
        modalOff={() => setErrorModal_last_month(false)}
        message={'스케쥴 열람은 이번달까지만 가능합니다'}
      />
      <Loading modalOn={loading} />
      <TasksByDateModal
        modalOn={dateDetailModal}
        modalOff={() => setDateDetailModal(false)}
        date={selected_date}
      />
    </View>
  );
};
export default Calendar_Data;
