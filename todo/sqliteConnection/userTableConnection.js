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


export const CREATE_USER_TABLE = () =>
  DB.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS user_info (' +
        'user_no INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,' +
        'id VARCHAR(30) NOT NULL,' +
        'pwd VARCHAR(30) NOT NULL,' +
        'name VARCHAR(30) NOT NULL,' +
        'job VARCHAR(30),' +
        'email VARCHAR(100),' +
        'regi_date VARCHAR(100) default "' +
        moment().format('YYYY-MM-DD') +
        '", image VARCHAR(255));',
      [],
      (tx, res) => {
        console.log('User_Table created successfully');
      },
      error => {
        console.log('Table unsuccessfully created' + JSON.stringify(error));
      },
    );
  });

export const INSERT_USER = user_info => {
  DB.transaction(tx => {
    const current_time = moment().format('LL'); //현재 시간을 'llll'로 포맷하여 Stringify
    console.log(current_time);
    tx.executeSql(
      'INSERT INTO user_info (id, pwd, job, name, email, image, regi_date) VALUES (?,?,?,?,?,?,?)',
      [
        user_info.id,
        user_info.pwd,
        user_info.job,
        user_info.name,
        user_info.email,
        user_info.image,
        current_time,
      ],
      (tx, res) => {
        console.log('INSER_USER SUCCESS');
      },
      error => {
        console.log('Insert Failed' + error);
      },
    );
  });
};

export const ID_DUPLICATION_CHECK = async id => {
  const getCount = () => {
    return new Promise((resolve, reject) => {
      DB.transaction(tx => {
        tx.executeSql(
          'SELECT COUNT(*) AS count FROM user_info WHERE id=?',
          [id],
          (tx, res) => {
            result = res.rows.item(0).count;
            resolve(result);
          },
          error => {
            console.log(
              'Select Count of Duplicated userID' + JSON.stringify(error),
            );
          },
        );
      });
    });
  };
  const count = await getCount();
  return count;
};
export const SOCIAL_LOGIN = (userInfo, type) => {
  let id = '';
  if (type == 'google') {
    id = userInfo.user.id;
  } else if (type == 'kakao') {
    id = userInfo.id;
  }
  DB.transaction(tx => {
    tx.executeSql(
      'SELECT COUNT(*) AS count FROM user_info WHERE id=?',
      [id],
      (tx, res) => {
        let count = res.rows.item(0).count;
        if (count > 0) {
          console.log('구글 아이디 중복');
        } else if (count == 0) {
          console.log('카카오 아이디 중복 없음 => INSERT USER');
          INSERT_USER_BY_SOCIAL_LOGIN(userInfo, type); //로그인 이력이 있는 구글ID가 아니라면 새로 Insert
        }
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

export const INSERT_USER_BY_SOCIAL_LOGIN = async (userInfo, type) => {
  const user_data = {
    id: '',
    name: '',
    email: '',
    image: null,
  };
  if (type == 'google') {
    user_data.id = userInfo.user.id;
    user_data.email = userInfo.user.email;
    user_data.name = userInfo.user.name;
    user_data.image = null;
  } else if (type == 'kakao') {
    user_data.id = userInfo.id;
    user_data.name = userInfo.nickname;
    user_data.email = userInfo.email;
    user_data.image = userInfo.profileImageUrl;
  }

  console.log('Login type  : ' + type);
  const current_time = moment().format('LL'); //현재 시간을 'llll'로 포맷하여 Stringify
  let tempPwd = ''; //카카오에서 얻어온 id와 더불어 더미 pwd 변수 선언
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  Array.from(Array(15)).forEach(() => {
    // 랜덤형 pwd 생성
    tempPwd += possible.charAt(Math.floor(Math.random() * possible.length));
  });
  await DB.transaction(tx => {
    tx.executeSql(
      'INSERT INTO user_info (id, pwd, job, name, email, image, regi_date) VALUES (?,?,?,?,?,?,?)',
      [
        user_data.id,
        tempPwd,
        null,
        user_data.name,
        user_data.email,
        user_data.image,
        current_time,
      ],
      (tx, res) => {
        console.log('SOCIAL Login Insert Success ');
      },
      error => {
        console.log('Insert google Login user Failed' + JSON.stringify(error));
      },
    );
  });
};

export const UPDATE_USER_INFO = info => {
  DB.transaction(tx => {
    tx.executeSql(
      'UPDATE user_info SET name=?,email=?,job=?, image=? WHERE user_no=?',
      [info.newName, info.newEmail, info.newJob, info.newImage, info.user_no],
      (tx, res) => {
        console.log('update success');
        //******replace로 해야 'ProfileMain'에서 렌더링이 실행******
      },
      error => {
        console.log('Update Failed' + error);
      },
    );
  });
};

export const LOGIN_VALIDATION = async (id, pwd) => {
  console.log('LOGIN VALIDATION : ' + id + '  / ' + pwd);
  const id_pwd_check = () => {
    return new Promise((resolve, reject) => {
      DB.transaction(tx => {
        tx.executeSql(
          'SELECT count(*) as count FROM user_info WHERE id=? AND pwd=?',
          [id, pwd],
          (tx, res) => {
            let count = res.rows.item(0).count;
            console.log('ID PWD Matched user count :  ' + count);
            resolve(count);
          },
          error => {
            console.log('Select Failed' + error);
          },
        );
      });
    });
  };
  const dupCount = await id_pwd_check();
  console.log('user_data promise  ' + dupCount);
  return dupCount;
}
  

//비밀번호 재설정
export const RESET_PWD = (user_no, newPwd) => {
  console.log('SQLite ' + user_no + '     ' + newPwd);
  DB.transaction(tx => {
    tx.executeSql(
      'UPDATE user_info SET pwd=? WHERE user_no=? ',
      [newPwd, user_no],
      (tx, res) => {
        console.log('update success');
      },
      error => {
        console.log('Update Failed' + error);
      },
    );
  });
};

export const SELECT_USER_INFO_BY_USERNO = async user_no => {
  const user_data = {
    id: '',
    pwd: '',
    job: '',
    name: '',
    email: '',
    image: null,
    regi_date: null,
    job: '',
    user_no: 0,
  };
  const get_user_data = () => {
    return new Promise((resolve, reject) => {
      DB.transaction(tx => {
        tx.executeSql(
          'SELECT id, pwd, job, name, email, image, regi_date, job, user_no FROM user_info WHERE user_no=?',
          [user_no],
          (tx, res) => {
            user_data.id = res.rows.item(0).id;
            user_data.user_no = res.rows.item(0).user_no;
            user_data.pwd = res.rows.item(0).pwd;
            user_data.name = res.rows.item(0).name;
            user_data.email = res.rows.item(0).email;
            user_data.job = res.rows.item(0).job;
            user_data.regi_date = res.rows.item(0).regi_date;
            user_data.image = res.rows.item(0).image;
            resolve(user_data);
          },
          error => {
            console.log('Select Failed' + error);
          },
        );
      });
    });
  };
  const user_data_from_db = await get_user_data();
  return user_data_from_db;
};

export const SELECT_USER_INFO_BY_ID = async id => {
  let user_data = {
    id: '',
    pwd: '',
    job: '',
    name: '',
    email: '',
    image: null,
    regi_date: '',
    job: '',
    user_no: 0,
  };
  const get_user_data = async () => {
    return new Promise( async (resolve, reject) => {
      await DB.transaction(tx => {
        tx.executeSql(
          'SELECT id, pwd, job, name, email, image, regi_date, job, user_no FROM user_info WHERE id=?',
          [id],
          (tx, res) => {
            user_data.id = res.rows.item(0).id;
            user_data.user_no = res.rows.item(0).user_no;
            user_data.pwd = res.rows.item(0).pwd;
            user_data.name = res.rows.item(0).name;
            user_data.email = res.rows.item(0).email;
            user_data.job = res.rows.item(0).job;
            user_data.regi_date = res.rows.item(0).regi_date;
            user_data.image = res.rows.item(0).image;
            resolve(user_data);
          },
          error => {
            console.log('Select Failed' + error);
          },
        );
      });
    });
  };
  const user_data_from_db = await get_user_data();
  return user_data_from_db;
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
