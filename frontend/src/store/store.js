import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import issueReducer from './slices/issueSlice';
import updateReducer from './slices/updateSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        issues: issueReducer,
        updates: updateReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export default store;
