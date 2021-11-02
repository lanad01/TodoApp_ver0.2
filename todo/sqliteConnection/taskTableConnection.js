import SQLite from 'react-native-sqlite-storage';
import { BACKGROUND_ALARM_ABOUT_TO_EXPIRED_DATE } from '../pushAlarms/pushAlarm';
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
export const CREATE_TASK_TABLE = () => {
  DB.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS task_info2 (' +
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
      },
      error => {
        console.log('Task table created fail ' + JSON.stringify(error));
      },
    );
  });
};
export const INSERT_TASK = taskInfo => {
  DB.transaction(tx => {
    tx.executeSql(
      'INSERT INTO task_info2 (user_no, task_name, priority, exp, exp_date, performed ) VALUES (?,?,?,?,?,false)',
      [
        taskInfo.user_no,
        taskInfo.task_name,
        taskInfo.priority,
        taskInfo.exp,
        taskInfo.exp_date,
      ],
      (tx, res) => {
        console.log('Insert Success');
      },
      error => {
        console.log('Insert Failed' + JSON.stringify(error));
      },
    );
  });
};
export const DELETE_TASK = task_no => {
  DB.transaction(tx => {
    tx.executeSql(
      'DELETE FROM task_info2 WHERE task_no=?', //수령한 task_no에 해당하는 row 삭제
      [task_no],
      (tx, res) => {
        console.log('Delete Success');
        // 배열 정보에서 삭제
      },
      error => {
        console.log('Delete Failed' + error);
      },
    );
  });
};

export const UPDATE_TASK = taskInfo => {
  console.log('UPDATE TASK ARG CHECK' + JSON.stringify(taskInfo));
  console.log(taskInfo.priority)
  DB.transaction(tx => {
    tx.executeSql(
      //상위 컴포넌트에서 호출시킨 task_no의 데이터를 Update
      'UPDATE task_info2 SET task_name=?, priority=?, exp=? WHERE task_no=?',
      [taskInfo.task_name, taskInfo.priority, taskInfo.exp, taskInfo.task_no],
      (tx, res) => {
        console.log('Update Task Success');
      },
      error => {
        console.log('Update Task Failed' + JSON.stringify(error));
      },
    );
  });
};
export const SELECT_TASK_BY_TASKNO = async task_no => {
  const taskInfo = {
    task_name: '',
    priority: '',
    exp: '',
  };
  const task_from_db = () => {
    return new Promise((resolve, reject) => {
      DB.transaction(tx => {
        tx.executeSql(
          'SELECT task_name,priority,exp, exp_date FROM task_info2 WHERE task_no=?',
          [task_no],
          (tx, res) => {
            taskInfo.task_name = res.rows.item(0).task_name;
            taskInfo.priority = res.rows.item(0).priority;
            taskInfo.exp = res.rows.item(0).exp;
            resolve(taskInfo);
          },
          error => {
            console.log('Delete Failed' + error);
          },
        );
      });
    });
  };
  const result = await task_from_db();
  return result;
};

//유저번호를 통한 taskList 검색
export const SELECT_TASKLIST_BY_USERNO = async user_no => {
  const task_data = [];
  let priority=null
  const taskList_from_db = () => {
    return new Promise((resolve, reject) => {
      DB.transaction(tx => {
        tx.executeSql(
          'SELECT task_no, task_name, priority, exp, performed, exp_date FROM task_info2 WHERE user_no=? ORDER BY exp_date ASC',
          [user_no],
          (tx, res) => {
            let len = res.rows.length;
            if (len === 0) {
              console.log('Array length 0');
            } else if (len > 0) {
              for (let i = 0; i < len; i++) {
                //context에 조회된 데이터 row수만큼 배열 생성
                priority = res.rows.item(0).priority;
                if (priority == undefined || priority == null) {
                  priority = 'Middle';
                }
                task_data[i] = {
                  task_no: res.rows.item(i).task_no,
                  user_no: user_no,
                  task_name: res.rows.item(i).task_name,
                  priority: res.rows.item(i).priority,
                  exp: res.rows.item(i).exp,
                  exp_date: res.rows.item(i).exp_date,
                  performed: res.rows.item(i).performed,
                };
              }
            }
            resolve(task_data);
          },
          error => {
            console.log('Failed' + JSON.stringify(error));
          },
        );
      });
    });
  };
  const result = await taskList_from_db();
  return result;
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
        for (let i = 0; i < length; i++) {
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
          } else if (date1 > date2) {
            //task의 getTime Value가 더 낮다 = 이틀 이하의 시간이 남았다
            number_of_task_about_exp.push('expire coming'); //기한임박 task배열에 추가
          }
        }
        console.log('기한 만료 임박 개수 : ' + number_of_task_about_exp.length);
        if (number_of_task_about_exp.length > 0) {
          //기한만료가 0개 이상일 경우 Background에서 localPush가 행해진다.
          BACKGROUND_ALARM_ABOUT_TO_EXPIRED_DATE(
            number_of_task_about_exp.length,
          );
        } else if (number_of_task_about_exp.length == 0) {
        }
      },
      err => {
        console.log('CHECK OF EXP TASK' + JSON.stringify(err));
      },
    );
  });
};

//해당유저의 Task List의 숫자를 검색
export const GET_BADGE_VALUE = async user_no => {
  let badge = 0;
  const get_badge_count = () => {
    return new Promise((resolve, reject) => {
      DB.transaction(async tx => {
        //badge 형성을 위해 해당 user_no의 남아있는 todoList length 출력
        tx.executeSql(
          'SELECT count(task_no) as count FROM task_info2 WHERE user_no=?',
          [user_no],
          (tx, res) => {
            badge = res.rows.item(0).count;
            resolve(badge);
          },
        );
      });
    });
  };
  const result = await get_badge_count();
  return result;
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

//Task 완료 처리
export const UPDATE_TASK_PERFORMED = async task_no => {
  await DB.transaction(tx => {
    tx.executeSql(
      'UPDATE task_info2 SET performed=? WHERE task_no=?',
      [true, task_no],
      (tx, res) => {
        console.log('UPDATE TASK PERFORMED SUCCESS');
      },
      error => {
        console.log('Failed' + JSON.stringify(error));
      },
    );
  });
};
//해당 유저가 가진 Tasks의 exp_date 검색
export const SELECT_EXP_DATE_OF_TASKS = async user_no => {
  const exp_date_array = [];
  const getDates = () => {
    return new Promise(async (resolve, reject) => {
      await DB.transaction(tx => {
        tx.executeSql(
          'SELECT exp_date FROM task_info2 WHERE user_no=? AND performed=?',
          [user_no, false],
          (tx, res) => {
            Array(res.rows.length)
              .fill(res.rows)
              .map((v, i) => {
                exp_date_array.push(v.item(i).exp_date);
              });
            resolve(exp_date_array);
          },
          error => {
            console.log('Failed' + JSON.stringify(error));
          },
        );
      });
    });
  };
  const result = await getDates();
  return result;
};

//현재 유저의 해당 날짜 Task 목록을 검색
export const SELECT_TASK_BY_EXP_DATE = async (date, user_no) => {
  let tasks = [];
  const getTasks_by_date = () => {
    return new Promise(async (resolve, reject) => {
      await DB.transaction(tx => {
        tx.executeSql(
          'SELECT task_no, task_name, priority, exp, exp_date, performed FROM task_info2 WHERE exp_date=? And user_no=?',
          [date, user_no],
          (tx, res) => {
            for (let i = 0; i < res.rows.length; i++) {
              tasks.push(res.rows.item(i));
            }
            resolve(tasks);
          },
          error => {
            console.log('Failed' + JSON.stringify(error));
          },
        );
      });
    });
  };
  const result = await getTasks_by_date();
  return result;
};
