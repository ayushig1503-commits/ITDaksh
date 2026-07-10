import axios from 'axios';
import {
    getRequest,
    getSuccess,
    getFailed,
    getError,
    stuffDone
} from './studentSlice';

// Helper to handle the API response logic to keep code DRY
const handleResponse = (result, dispatch, successAction) => {
    // If it's an array, it's a list of students (Success!)
    if (Array.isArray(result.data)) {
        dispatch(successAction(result.data));
        return true;
    }
    
    // If it has a message and NO data, it's likely a "No students found" 404/msg
    if (result.data.message && !result.data.students) {
        dispatch(getFailed(result.data.message));
        return false;
    } 
    
    // Fallback for other data structures
    dispatch(successAction(result.data.students || result.data));
    return true;
};

export const getAllStudents = (id) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/Students/${id}`);
        console.log("RAW API DATA:", result.data);
        handleResponse(result, dispatch, getSuccess);
        return result.data; // Return data so components can chain .then()
    } catch (error) {
        dispatch(getError(error.response?.data?.message || "Error"));
        throw error; // Throw error so components can use .catch()
    }
}

export const updateStudentFields = (id, fields, address) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.put(`${process.env.REACT_APP_BASE_URL}/${address}/${id}`, fields, {
            headers: { 'Content-Type': 'application/json' },
        });
        
        const isSuccess = handleResponse(result, dispatch, stuffDone);
        return isSuccess; 
    } catch (error) {
        dispatch(getError(error));
        throw error;
    }
}

export const removeStuff = (id, address) => async (dispatch) => {
    dispatch(getRequest());

    try {
        // Change .put to .delete
        const result = await axios.delete(`${process.env.REACT_APP_BASE_URL}/${address}/${id}`);
        
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
            return false;
        } else {
            dispatch(stuffDone());
            return true;
        }
    } catch (error) {
        dispatch(getError(error));
        throw error;
    }
}