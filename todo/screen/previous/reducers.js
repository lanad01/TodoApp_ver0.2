import { SET_TASK_BADGE} from "./actions";

const initialState = {
    taskBadge : 0
}
function userReducer(state = initialState, action){
    switch(action.type){
        case SET_TASK_BADGE:
            return { ...state, taskBadge: action.payload};
        default : return state;
    }
}
export default userReducer;