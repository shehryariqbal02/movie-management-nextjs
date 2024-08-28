import { createSlice } from '@reduxjs/toolkit';

const movieSlice = createSlice({
    name: 'movie',
    initialState: { movies: [] },
    reducers: {
        setMovies: (state, action) => {
            state.movies = action.payload;
        },
        addMovie: (state, action) => {
            state.movies.push(action.payload);
        },
        updateMovie: (state, action) => {
            const { id, updatedMovie } = action.payload;
            console.log({id, updatedMovie});
            return {...state,movies: state.movies.map((movie) => {
                    if(movie.id === id){
                        movie = {...updatedMovie};
                    }
                    return movie;
                })
            };
        },
        deleteMovie: (state, action) => {
            const id = action.payload;
            state.movies = state.movies.filter((movie) => movie.id !== id);
        },
    },
});

export const { setMovies, addMovie, updateMovie, deleteMovie } = movieSlice.actions;
export default movieSlice.reducer;
