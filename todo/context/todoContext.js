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
});