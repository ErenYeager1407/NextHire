import { createSlice } from "@reduxjs/toolkit";

const interviewReportSlice = createSlice({
    name: "interviewReport",
    initialState: {
        interviewReports: [],
        singleReport: null,
        loading: false,
    },
    reducers: {
        setInterviewReports: (state, action) => {
            state.interviewReports = action.payload;
        },
        setSingleReport: (state, action) => {
            state.singleReport = action.payload;
        },
        setReportLoading: (state, action) => {
            state.loading = action.payload;
        },
    },
});

export const { setInterviewReports, setSingleReport, setReportLoading } = interviewReportSlice.actions;
export default interviewReportSlice.reducer;
