
//--------------------------------

export const SET_APPSTATUS = 'SET_APPSTATUS'

export const setAppStatus = (status) => (dispatch, getState) => {
    dispatch({
        type: SET_APPSTATUS,
        status: status
    })
}