export const SET_TASK_BADGE = 'SET_TASK_BADGE'

export const setBadge = badge => dispatch =>{
    dispatch({
        type: SET_TASK_BADGE,
        payload: badge
    })
}