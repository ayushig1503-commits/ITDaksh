import axios from 'axios';
import {
    getRequest,
    getSuccess,
    getFailed,
    getError,
    getStudentsSuccess,
    detailsSuccess,
    getFailedTwo,
    getSubjectsSuccess,
    getSubDetailsSuccess,
    getSubDetailsRequest,
    getClassGroupsSuccess,
    removeSubjectFromList, 
    getMarkingSchemeSuccess,
    getSclassByClassGroupSuccess,
} from './sclassSlice';

// Helper to extract clean error messages
const getErrorMessage = (error) => error.response?.data?.message || error.message || "An error occurred";

export const getAllSclasses = (id, address) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/${address}List/${id}`);
        if (result.data.message) {
            dispatch(getFailedTwo(result.data.message));
        } else {
            dispatch(getSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(getErrorMessage(error)));
    }
};

export const getClassStudents = (id) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/Sclass/Students/${id}`);
        if (result.data.message) {
            dispatch(getFailedTwo(result.data.message));
        } else {
            dispatch(getStudentsSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(getErrorMessage(error)));
    }
};

export const getClassDetails = (id, address) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/${address}/${id}`);
        if (result.data && !result.data.message) {
            dispatch(detailsSuccess(result.data));
        } else if (result.data?.message) {
            dispatch(getFailed(result.data.message));
        }
    } catch (error) {
        dispatch(getError(getErrorMessage(error)));
    }
};

export const getSubjectList = (id, address) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/${address}/${id}`);
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(getSubjectsSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(getErrorMessage(error)));
    }
};

export const getTeacherFreeClassSubjects = (id) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/FreeSubjectList/${id}`);
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(getSubjectsSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(getErrorMessage(error)));
    }
};

export const getSubjectDetails = (id, address) => async (dispatch) => {
    dispatch(getSubDetailsRequest());
    try {
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/${address}/${id}`);
        if (result.data && !result.data.message) {
            dispatch(getSubDetailsSuccess(result.data));
        } else if (result.data?.message) {
            dispatch(getFailed(result.data.message));
        }
    } catch (error) {
        dispatch(getError(getErrorMessage(error)));
    }
};

export const getAllClassGroups = (id) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/ClassGroupList/${id}`);
        if (result.data.message) {
            dispatch(getFailedTwo(result.data.message));
        } else {
            dispatch(getClassGroupsSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(getErrorMessage(error)));
    }
};

export const createClassGroup = (data) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await axios.post(
            `${process.env.REACT_APP_BASE_URL}/ClassGroupCreate`,
            data
        );
        dispatch(getClassGroupsSuccess([result.data]));
        return result.data;
    } catch (error) {
        if (error.response?.status === 400 &&
            error.response?.data?.message === "Class group already exists") {
            const listRes = await axios.get(
                `${process.env.REACT_APP_BASE_URL}/ClassGroupList/${data.adminID}`
            );
            const existing = listRes.data.find(g => g.name === data.name);
            return existing || null;
        }
        dispatch(getError(getErrorMessage(error)));
        return null;
    }
};

export const deleteClassGroup = (id) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await axios.delete(`${process.env.REACT_APP_BASE_URL}/ClassGroup/${id}`);
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        }
    } catch (error) {
        dispatch(getError(getErrorMessage(error)));
    }
};

export const deleteSubject = (id) => async (dispatch) => {
    try {
        const result = await axios.delete(`${process.env.REACT_APP_BASE_URL}/Subject/${id}`);
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(removeSubjectFromList(id));
        }
    } catch (error) {
        dispatch(getError(getErrorMessage(error)));
    }
};

export const getMarkingScheme = (classGroupId, schoolId) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const result = await axios.get(
            `${process.env.REACT_APP_BASE_URL}/MarkingScheme/${classGroupId}/${schoolId}`
        );
        dispatch(getMarkingSchemeSuccess(result.data));
    } catch (error) {
        dispatch(getError(getErrorMessage(error)));
    }
};

export const getSclassByClassGroup = (id) => async (dispatch) => {
    dispatch(getRequest());
    try {
        const url = `${process.env.REACT_APP_BASE_URL}/SclassList/${id}`;
        console.log("DEBUG [Handle]: Axios Request to URL:", url);
        
        const result = await axios.get(url);
        
        console.log("DEBUG [Handle]: Axios Response Data:", result.data);

        if (result.data.message) {
            console.warn("DEBUG [Handle]: Server returned a message instead of data:", result.data.message);
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(getSclassByClassGroupSuccess(result.data));
        }
    } catch (error) {
        console.error("DEBUG [Handle]: Axios Catch Error:", error);
        dispatch(getError(error));
    }
};