import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    // The school defines these once in settings
    sectionOptions: ["A", "B", "C", "D"], 
    loading: false,
    error: null,
};

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setSettingsRequest: (state) => {
            state.loading = true;
        },
        // Call this when you fetch the school's custom naming convention from DB
        getSettingsSuccess: (state, action) => {
            state.sectionOptions = action.payload;
            state.loading = false;
        },
        // For the Admin to add a new section name globally (e.g., adding "E")
        addSectionOption: (state, action) => {
            state.sectionOptions = [...state.sectionOptions, action.payload].sort();
        },
        setSettingsFailed: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const {
    setSettingsRequest,
    getSettingsSuccess,
    addSectionOption,
    setSettingsFailed
} = settingsSlice.actions;

export const settingsReducer = settingsSlice.reducer;