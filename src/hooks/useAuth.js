import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUser } from '@/features/userSlice';
import {useRouter} from "next/router";
import {toast} from "react-toastify";
import {deleteCookie, getCookie, setCookie} from "cookies-next";
import process from "next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
export const useUserApi = () => {
    const dispatch = useDispatch();
    const router = useRouter();

    /**
     *
     * @param userData
     * @returns {Promise<void>}
     */
    const registerUser = async (userData) => {
        try {
            const response = await axios.post(`${apiUrl}/register`, userData);
            dispatch(setUser(response.data));
        } catch (error) {
            toast.warning(error.response?.data?.message || error?.message  || "something went wrong");
        }
    };
    /**
     *
     * @param loginData
     * @returns {Promise<void>}
     */
    const loginUser = async (loginData) => {
        try {
            const response = await axios.post(`${apiUrl}/login`, loginData);
            setCookie('authToken', response.data.user.token);
            dispatch(setUser(response.data));
            if (response.data.user) {
                router.push("/movies")
            }
        } catch (error) {
            toast.warning(error.response?.data?.message || error?.message  || "something went wrong");
        }
    };
    /**
     *
     * @param r
     * @returns {Promise<void>}
     */
    const logoutUser = async (r) => {
        try {
            let token = getCookie('authToken');
            const response = await axios.post(`${apiUrl}/logout`,{},{
                headers: {
                    'Content-Type': 'application/json' ,
                    'authorization': `Bearer ${token}`
                }
            });
            deleteCookie('authToken');
            dispatch(setUser({}));
            router.push('/login');
        } catch (error) {
            toast.warning(error.response?.data?.message || error?.message  || "something went wrong");
        }
    };

    return { registerUser, loginUser, logoutUser};
};
