import axios from 'axios';
import {
    authRequest,
    stuffAdded,
    authSuccess,
    authFailed,
    authError,
    authLogout,
    doneSuccess,
    getRequest,
    getFailed,
    getError,
} from './userSlice';

const getErrorMessage = (error) => error.response?.data?.message || "An error occurred";

export const loginUser = (fields, role) => async (dispatch) => {
    dispatch(authRequest());
    try {
        // REMOVED manual slash to fix the double-slash 404 bug
        const result = await axios.post(`${process.env.REACT_APP_BASE_URL}${role}Login`, fields, {
            headers: { 'Content-Type': 'application/json' },
        });
        if (result.data) {
            dispatch(authSuccess({ ...result.data, role: role }));
        } else {
            dispatch(authFailed(result.data?.message || "Login failed"));
        }
    } catch (error) {
        dispatch(authError(getErrorMessage(error)));
    }
};

export const registerUser = (fields, role) => async (dispatch) => {
    dispatch(authRequest());
    try {
        // REMOVED manual slash to fix the double-slash 404 bug
        const result = await axios.post(`${process.env.REACT_APP_BASE_URL}${role}Reg`, fields, {
            headers: { 'Content-Type': 'application/json' },
        });

        if (result.data.schoolName) {
            // FIXED: Explicitly attached role payload so the frontend redirect condition triggers successfully
            dispatch(authSuccess({ ...result.data, role: role }));
        } else if (result.data.role === "Teacher" || result.data.school) { 
            dispatch(stuffAdded());
        } else {
            dispatch(authFailed(result.data.message || "Failed to add user"));
        } 
    } catch (error) {
        dispatch(authError(getErrorMessage(error)));
    }
};

export const logoutUser = () => (dispatch) => {
    dispatch(authLogout());
};

export const getUserDetails = (id, address) => async (dispatch) => {
    dispatch(getRequest());
    try {
        // REMOVED manual slash
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}${address}/${id}`);
        if (result.data) {
            dispatch(doneSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(getErrorMessage(error)));
    }
};

export const deleteUser = (id, address) => async (dispatch) => {
    dispatch(getRequest());
    dispatch(getFailed("Sorry the delete function has been disabled for now."));
};

export const updateUser = (fields, id, address) => async (dispatch) => {
    dispatch(getRequest());
    try {
        // REMOVED manual slash
        const result = await axios.put(`${process.env.REACT_APP_BASE_URL}${address}/${id}`, fields, {
            headers: { 'Content-Type': 'application/json' },
        });
        if (result.data.schoolName) {
            dispatch(authSuccess({ ...result.data, role: address }));
        } else {
            dispatch(doneSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(getErrorMessage(error)));
    }
};

export const addStuff = (fields, address) => async (dispatch) => {
    dispatch(authRequest());
    try {
        // REMOVED manual slash
        const result = await axios.post(
            `${process.env.REACT_APP_BASE_URL}${address}Create`,
            fields,
            { headers: { 'Content-Type': 'application/json' } }
        );

        if (result.data.message) {
            dispatch(authFailed(result.data.message));
            return null; 
        } else {
            dispatch(stuffAdded(result.data));
            return result.data; 
        }
    } catch (error) {
        dispatch(authError(getErrorMessage(error)));
        return null; 
    }
};