import { useUserApi } from '@/hooks/useAuth';
import {Form, Button} from 'react-bootstrap';
import {useEffect, useState} from 'react';
import {getCookie} from "cookies-next";
import {useRouter} from "next/router";
import {toast} from "react-toastify";

/**
 *
 * @returns {JSX.Element}
 * @constructor
 */
export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);

    const token= getCookie('authToken')
    const { loginUser } = useUserApi();

    const router = useRouter();
    useEffect(() => {
        if(token){
            router.push('/movies');
        }
    }, [token]);
    /**
     * Login Submit
     * @param e
     * @returns {Promise<boolean>}
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (email === ""){
            toast.error("Email is required");
            return false;
        }
        if (password === ""){
            toast.error("Password is required");
            return false;
        }
        await loginUser({ email, password });
    };
    return (
        <section className="loginWrapper">
            <h1 className="loginWrapper__title">Sign In</h1>
            <Form className="pb-5" onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                    <Form.Control type="email" value={email} placeholder="Email"
                                  onChange={(e) => setEmail(e.target.value)}/>
                </Form.Group>
                <Form.Group className="mb-4">
                    <Form.Control type="password" value={password} placeholder="Password"
                                  onChange={(e) => setPassword(e.target.value)}/>
                </Form.Group>
                <Form.Group className="d-flex justify-content-center gap-2 mb-4">
                    <Form.Check
                        type="checkbox"
                        id={'remember'}
                        checked={remember}
                        onChange={ _ => setRemember(!remember)}
                        label="Remember me"
                    />
                </Form.Group>
                <Button type="submit" variant="secondary" className="w-100">Login</Button>
            </Form>
        </section>
    )
}

/**
 *
 * @param context
 * @returns {Promise<{props: {}}>}
 */
export async function getServerSideProps(context) {
    const authToken = context.req.cookies['authToken'];
    if (authToken) {
        context.res.writeHead(307, { Location: "/movies" });
        context.res.end();
        return { props: {} };

    } else {
        return {
            props: {},
        };
    }
}