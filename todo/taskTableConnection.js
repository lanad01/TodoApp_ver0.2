import SQLite from 'react-native-sqlite-storage';
import moment from 'moment';
import { BACKGROUND_ALARM_ABOUT_TO_EXPIRED_DATE } from './pushAlarm';
export const DB = SQLite.openDatabase(
  {
    name: 'testDB5',
    location: 'default',
    createFromLocation: 2,
  },
  () => {},
  err => {
    console.log(err);
  },
);
export const CREATE_TASK_TABLE = () =>
  DB.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS task_info3 (' +
        'task_no INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,' +
        'user_no INTEGER NOT NULL,' +
        'task_name VARCHAR(50) NOT NULL,' +
        'priority VARCHAR(30) DEFAULT "Middle",' +
        'exp VARCHAR(100),' +
        'performed boolean,' +
        'exp_date DATE,' +
        'FOREIGN KEY(user_no) REFERENCES user_info(user_no) ON DELETE CASCADE)',
      [],
      (tx, res) => {
        console.log('Tasktable created');
        // ALTER_TASK_TABLE()
      },
      error => {
        console.log('Task table created fail ' + JSON.stringify(error));
      },
    );
  });
export const GET_DATE = (authNo, taskname) => {
  DB.transaction(tx => {
    tx.executeSql(
      'SELECT exp_date FROM task_info2 WHERE user_no=? AND task_name=?',
      [authNo, taskname],
      (tx, res) => {
        console.log('인서트 확인');
        console.log(res.rows.item(0).exp_date);
      },
      error => {
        console.log('Task table created fail ' + JSON.stringify(error));
      },
    );
  });
};

//기한 임박인 Task 존재 여부 확인
export const CHECK_EXP_OF_TASKS = user_no => {
  const now = new Date();
  //기한이 이틀 이하로 남은 task검색을 위한 date객체
  const twoDaysAfter = new Date(now.setDate(now.getDate() + 2));
  const number_of_task_about_exp = []; //기한임박 task개수 배열
  DB.transaction(tx => {
    tx.executeSql(
      'SELECT exp_date FROM task_info2 WHERE user_no=?',
      [user_no],
      (tx, res) => {
        let length = res.rows.length; //해당 유저의 task 개수
        console.log('Length of check exp : ' + length);
        for (let i = 0; i < length; i++) {
          console.log('Exp :' + res.rows.item(i).exp_date); // 2011-10-11 형태로 출력됨
          let exp_date = res.rows.item(i).exp_date;
          exp_date = exp_date.split('-');
          // YYYY-MM-DD를 SPLIT로 나눈뒤 getTime()하기위한 date타입으로 parse
          const exp_date_To_dateType = new Date(
            exp_date[0],
            exp_date[1] - 1,
            exp_date[2],
          );
          const date1 = twoDaysAfter.getTime(); //이틀 후의 시간정보
          const date2 = exp_date_To_dateType.getTime(); // 해당 task의 시간정보
          if (date1 < date2) {
            //task의 getTime Value가 높으므로 아직 이틀 이상의 시간이 남았다
            console.log('아직 기한이 많이 남았다');
          } else if (date1 > date2) {
            //task의 getTime Value가 더 낮다 = 이틀 이하의 시간이 남았다
            console.log(' 이틀 안에 기한이 끝난다');
            number_of_task_about_exp.push('expire coming'); //기한임박 task배열에 추가
          }
        }
        console.log('기한 만료 임박 개수 : ' + number_of_task_about_exp.length);
        if (number_of_task_about_exp.length > 0) {
          console.log('기한만료가 0개 이상일 경우');

          //기한만료가 0개 이상일 경우 Background에서 localPush가 행해진다.
          BACKGROUND_ALARM_ABOUT_TO_EXPIRED_DATE(
            number_of_task_about_exp.length,
          );
        } else if (number_of_task_about_exp.length == 0) {
          console.log('기한임박인 Task가 없습니다.');
        }
      },
      err => {
        console.log('CHECK OF EXP TASK' + JSON.stringify(err));
      },
    );
  });
};

export const GET_BADGE_VALUE = async user_no => {
  const badge = {
    count: 0,
  };
  await DB.transaction(async tx => {
    //badge 형성을 위해 해당 user_no의 남아있는 todoList length 출력
    tx.executeSql(
      'SELECT count(task_no) as count FROM task_info2 WHERE user_no=?',
      [user_no],
      (tx, res) => {
        badge.count = res.rows.item(0).count;
      },
    );
  });
  return badge;
};

export const DB_MODULE = async user_no => {
  const user = {
    id: '12',
    pwd: '12',
  };
  await DB.transaction(tx => {
    tx.executeSql(
      'SELECT id, pwd FROM user_info WHERE user_no=?',
      [user_no],
      (tx, res) => {
        user.id = res.rows.item(0).id;
        user.pwd = res.rows.item(0).pwd;
      },
      error => {
        console.log(JSON.stringify(error));
      },
    );
  });
  return user;
};

export const DELETE_TEMP = () => {
  DB.transaction(tx => {
    console.log('Debug1');
    tx.executeSql(
      'DELETE FROM user_info',
      [],
      (tx, res) => {
        console.log('Delete success');
      },
      error => {
        console.log(
          'Select Count of Google Logined Duplicated User' +
            JSON.stringify(error),
        );
      },
    );
  });
};

export const GET_DATE = (authNo, taskname) => {
  DB.transaction(tx => {
    tx.executeSql(
      'SELECT exp_date FROM task_info2 WHERE user_no=? AND task_name=?',
      [authNo, taskname],
      (tx, res) => {
        console.log('인서트 확인');
        console.log(res.rows.item(0).exp_date);
      },
      error => {
        console.log('Task table created fail ' + JSON.stringify(error));
      },
    );
  });
};