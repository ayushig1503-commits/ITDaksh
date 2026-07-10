import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    studentsList: [],
    loading: false,
    error: null,
    response: null, // Used for backend messages (e.g., "No students found")
    statestatus: "idle",
};

const studentSlice = createSlice({
    name: 'student',
    initialState,
    reducers: {
        getRequest: (state) => {
            state.loading = true;
            state.error = null; // Clear old errors when starting a new request
        },
getSuccess: (state, action) => {
    state.studentsList = action.payload; // Payload should be the Array from the API
    state.loading = false;
    state.error = null;
    state.response = null;
},
        getFailed: (state, action) => {
            state.loading = false;
            state.response = action.payload; // Specifically for "Not Found" or 404 messages
            state.studentsList = []; // Clear list if request failed
        },
        getError: (state, action) => {
            state.loading = false;
            state.error = action.payload; // For system/network errors
        },
        stuffDone: (state) => {
            state.loading = false;
            state.error = null;
            state.statestatus = "added";
        },
        underStudentControl: (state) => {
            state.loading = false;
            state.response = null;
            state.error = null;
            state.statestatus = "idle";
        }
    },
});

export const {
    getRequest,
    getSuccess,
    getFailed,
    getError,
    underStudentControl,
    stuffDone,
} = studentSlice.actions;

export const studentReducer = studentSlice.reducer;