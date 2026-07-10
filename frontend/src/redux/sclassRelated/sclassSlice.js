import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    sclassesList: [],
    sclassStudents: [],
    sclassDetails: null,      
    subjectsList: [],
    subjectDetails: null,     
    subjectTeacherMap: [],    
    classGroupsList: [],      
    loading: false,
    subloading: false,
    error: null,
    response: null,
    getresponse: null,
    markingScheme: null,
};

const sclassSlice = createSlice({
    name: 'sclass',
    initialState,
    reducers: {
        getRequest: (state) => {
            state.loading = true;
        },
        getSubDetailsRequest: (state) => {
            state.subloading = true;
        },
        getSuccess: (state, action) => {
            state.sclassesList = action.payload;
            state.loading = false;
            state.error = null;
            state.getresponse = null;
        },
        // This is the specific one needed for the AddTeacher dropdown
        getSclassByClassGroupSuccess: (state, action) => {
            state.sclassesList = action.payload;
            state.loading = false;
            state.error = null;
            state.getresponse = null;
        },
        getClassGroupsSuccess: (state, action) => {
            state.classGroupsList = Array.isArray(action.payload)
                ? action.payload
                : [...state.classGroupsList, action.payload];
            state.loading = false;
            state.error = null;
        },
        getStudentsSuccess: (state, action) => {
            state.sclassStudents = action.payload;
            state.loading = false;
            state.error = null;
        },
        getSubjectsSuccess: (state, action) => {
            state.subjectsList = action.payload;
            state.loading = false;
            state.error = null;
            state.response = null;
        },
        getFailed: (state, action) => {
            state.response = action.payload;
            state.loading = false;
            state.error = null;
        },
        getFailedTwo: (state, action) => {
            state.sclassesList = [];
            state.getresponse = action.payload;
            state.loading = false;
            state.error = null;
        },
        getError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        detailsSuccess: (state, action) => {
            state.sclassDetails = action.payload;
            state.loading = false;
            state.error = null;
        },
        getSubDetailsSuccess: (state, action) => {
            state.subjectDetails = action.payload;
            state.subloading = false;
            state.error = null;
        },
        resetSubjects: (state) => {
            state.subjectsList = [];
            state.sclassesList = [];
        },
        removeSubjectFromList: (state, action) => {
            state.subjectsList = state.subjectsList.filter(
                (sub) => sub._id !== action.payload
            );
        },
        getMarkingSchemeSuccess: (state, action) => {
            state.markingScheme = action.payload;
            state.loading = false;
            state.error = null;
        },
    },
});

export const {
    getRequest,
    getSuccess,
    getFailed,
    getError,
    getStudentsSuccess,
    getSubjectsSuccess,
    detailsSuccess,
    getFailedTwo,
    resetSubjects,
    getSubDetailsSuccess,
    getSubDetailsRequest,
    getClassGroupsSuccess,
    getSclassByClassGroupSuccess, // Export the new action
    removeSubjectFromList,
    getMarkingSchemeSuccess,
} = sclassSlice.actions;

export const sclassReducer = sclassSlice.reducer;