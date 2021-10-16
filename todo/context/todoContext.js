import React from "react";

export const TodoContext = React.createContext({
    taskName:'',
    taskPrior:'',
    taskExp:'',
    taskBadge:0,
    task_no:[],
    task_name: [],
    task_prior:[],
    task_exp:[],
    render:false,
    performed: [],
    //요렇게 해보자
    taskInfo: [],
    list_of_date : [],
});