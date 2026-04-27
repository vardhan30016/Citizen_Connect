import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { updateAPI } from '../../api/api';

export const fetchUpdates = createAsyncThunk(
    'updates/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await updateAPI.getAll();
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch updates');
        }
    }
);

export const fetchMyUpdates = createAsyncThunk(
    'updates/fetchMyUpdates',
    async (_, { rejectWithValue }) => {
        try {
            const response = await updateAPI.getMyUpdates();
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch updates');
        }
    }
);

export const createUpdate = createAsyncThunk(
    'updates/create',
    async (updateData, { rejectWithValue }) => {
        try {
            const response = await updateAPI.create(updateData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create update');
        }
    }
);

const initialState = {
    updates: [],
    loading: false,
    error: null,
};

const updateSlice = createSlice({
    name: 'updates',
    initialState,
    reducers: {
        clearUpdateError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUpdates.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUpdates.fulfilled, (state, action) => {
                state.loading = false;
                state.updates = action.payload;
            })
            .addCase(fetchUpdates.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchMyUpdates.fulfilled, (state, action) => {
                state.updates = action.payload;
                state.loading = false;
            })
            .addCase(createUpdate.fulfilled, (state, action) => {
                state.updates.unshift(action.payload);
            });
    },
});

export const { clearUpdateError } = updateSlice.actions;
export default updateSlice.reducer;
