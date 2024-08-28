import { configureStore } from '@reduxjs/toolkit';
import movieReducer from '@/features/movieSlice';
import userReducer from '@/features/userSlice';

export const store = configureStore({
    reducer: {
        movies: movieReducer,
        user: userReducer,
    },
});
