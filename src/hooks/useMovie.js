import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setMovies, addMovie, updateMovie, deleteMovie } from '@/features/movieSlice';
import {toast} from "react-toastify";
import {getCookie} from "cookies-next";
import process from "next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss";

/**
 *
 * @returns {{createMovie: ((function(*): Promise<boolean>)|*), editMovie: ((function(*, *): Promise<boolean>)|*), fetchMovies: ((function(): Promise<void>)|*), removeMovie: ((function(*): Promise<void>)|*)}}
 */
export const useMovieApi = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const dispatch = useDispatch();
    const token = getCookie('authToken');
    const config = {
        headers: {
            'Content-Type': 'application/json' ,
                'authorization': `Bearer ${token}`
        }
    }
    /**
     *
     * @returns {Promise<void>}
     */
    const fetchMovies = async () => {
        try {

            const response = await axios.get(`${apiUrl}/movies`,config);
            dispatch(setMovies(response.data.data));
        } catch (error) {
            toast.warning(error.response?.data?.message || error?.message  || "something went wrong");
        }
    };
    /**
     *
     * @param movieData
     * @returns {Promise<boolean>}
     */
    const createMovie = async (movieData) => {
        try {
            const response = await axios.post(`${apiUrl}/movies`, movieData,{
                headers: {
                    'authorization': `Bearer ${token}`
                }
            });
            dispatch(addMovie(response.data.data));
            return true;
        } catch (error) {
            toast.warning(error.response?.data?.message || error?.message  || "something went wrong");
            return false;
        }
    };
    /**
     *
     * @param id
     * @param movieData
     * @returns {Promise<boolean>}
     */
    const editMovie = async (id, movieData) => {
        try {
            const response = await axios.post(`${apiUrl}/movies/${id}`, movieData,{
                headers: {
                    'authorization': `Bearer ${token}`
                }
            });
            dispatch(updateMovie({ id : Number(id), updatedMovie: response.data.data }));
            return true;
        } catch (error) {
            toast.warning(error.response?.data?.message || error?.message  || "something went wrong");
            return false;
        }
    };
    /**
     *
     * @param id
     * @returns {Promise<void>}
     */
    const removeMovie = async (id) => {
        try {
            await axios.delete(`${apiUrl}/movies/${id}`,config);
            dispatch(deleteMovie(id));
        } catch (error) {
            toast.warning(error.response?.data?.message || error?.message  || "something went wrong");
        }
    };

    return { fetchMovies, createMovie, editMovie, removeMovie };
};
