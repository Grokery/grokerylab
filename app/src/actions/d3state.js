import { CALL_API } from '../middleware/api'


export const SET_D3STATE = 'SET_D3STATE'

export const setD3State = (d3state) => (dispatch, getState) => {
    dispatch({
        type: SET_D3STATE,
        d3state: d3state
    })
}