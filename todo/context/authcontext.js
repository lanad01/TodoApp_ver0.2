import React from "react";

export const AuthContext = React.createContext({
    login_route : '일반 로그인',
    autologin: false,
    user_no:'',
    id: '',
    pwd:'',
    name:'',
    job:'',
    email:'',
    regi_date:'',
    image:null,
    emailNull:'이메일은 미등록 상태입니다.',
    jobNull:'직업란은 미등록 상태입니다.'
    
});