import {
    v4 as uuidv4
} from 'uuid';
import {
    SET_ALERT,
    REMOVE_ALERT
} from './types';

export const setAlert = (msg, alertType, timeout = 5000) => (dispatch) => {
    const id = uuidv4(); // random universal id version 4
    dispatch({
        // calling the set alert from the reducer
        type: SET_ALERT,
        payload: {
            msg,
            alertType,
            id,
        },
    });

    setTimeout( // removes the alert after 5 seconds
        () =>
        dispatch({
            type: REMOVE_ALERT,
            payload: id,
        }),
        timeout
    );
};