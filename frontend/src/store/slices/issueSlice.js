import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { issueAPI } from '../../api/api';

// Async thunks
export const fetchIssues = createAsyncThunk(
    'issues/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await issueAPI.getAll();
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch issues');
        }
    }
);

export const fetchMyIssues = createAsyncThunk(
    'issues/fetchMyIssues',
    async (_, { rejectWithValue }) => {
        try {
            const response = await issueAPI.getMyIssues();
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch issues');
        }
    }
);

export const fetchAssignedIssues = createAsyncThunk(
    'issues/fetchAssigned',
    async (_, { rejectWithValue }) => {
        try {
            const response = await issueAPI.getAssigned();
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch issues');
        }
    }
);

export const createIssue = createAsyncThunk(
    'issues/create',
    async (issueData, { rejectWithValue }) => {
        try {
            const response = await issueAPI.create(issueData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create issue');
        }
    }
);

export const fetchIssueStats = createAsyncThunk(
    'issues/fetchStats',
    async (_, { rejectWithValue }) => {
        try {
            const response = await issueAPI.getStats();
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats');
        }
    }
);

const initialState = {
    issues: [],
    currentIssue: null,
    stats: null,
    loading: false,
    error: null,
};

const issueSlice = createSlice({
    name: 'issues',
    initialState,
    reducers: {
        setCurrentIssue: (state, action) => {
            state.currentIssue = action.payload;
        },
        clearIssueError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchIssues.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchIssues.fulfilled, (state, action) => {
                state.loading = false;
                state.issues = action.payload;
            })
            .addCase(fetchIssues.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchMyIssues.fulfilled, (state, action) => {
                state.issues = action.payload;
                state.loading = false;
            })
            .addCase(fetchAssignedIssues.fulfilled, (state, action) => {
                state.issues = action.payload;
                state.loading = false;
            })
            .addCase(createIssue.fulfilled, (state, action) => {
                state.issues.unshift(action.payload);
            })
            .addCase(fetchIssueStats.fulfilled, (state, action) => {
                state.stats = action.payload;
            });
    },
});

export const { setCurrentIssue, clearIssueError } = issueSlice.actions;
export default issueSlice.reducer;
