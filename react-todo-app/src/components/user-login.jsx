import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { useFormik } from "formik";
import axios from "axios";
import { useState } from "react";
import { useCookies } from "react-cookie";

export function UserLogin() {
    const [cookies, setCookie] = useCookies(['userid']);
    const [userIdError, setUserIdError] = useState({ display: 'none', color: 'red' });
    const [passwordError, setPasswordError] = useState({ display: 'none', color: 'red' });
    let navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            UserId: '',
            Password: ''
        },
        onSubmit: (formdata) => {
            axios.get('http://127.0.0.1:6600/get-users')
                .then((response) => {
                    var user = response.data.find(user => user.UserId === formdata.UserId);
                    if (user) {
                        if (user.Password === formdata.Password) {
                            setCookie('userid', formdata.UserId);
                            navigate('/dashboard');
                        } else {
                            navigate('/error');
                        }
                    } else {
                        navigate('/error');
                    }
                });
        }
    });

    const handleUserIdChange = (e) => {
        formik.handleChange(e);
        if (e.target.value === "") {
            setUserIdError({ display: 'block', color: 'red' });
        } else {
            setUserIdError({ display: 'none' });
        }
    };

    const handlePasswordChange = (e) => {
        formik.handleChange(e);
        if (e.target.value === "") {
            setPasswordError({ display: 'block', color: 'red' });
        } else {
            setPasswordError({ display: 'none' });
        }
    };

    return (
        <div style={{ height: '400px' }} className="me-4 pe-4 d-flex justify-content-end align-items-center">
            <div>
                <h1 className="text-white bi bi-person-fill">User Login</h1>
                <form onSubmit={formik.handleSubmit} className="bg-white text-dark p-4">
                    <dl>
                        <dt>User Id</dt>
                        <dd>
                            <input type="text" name="UserId" onChange={handleUserIdChange} className="form-control" required />
                            <div style={userIdError}>User ID is required</div>
                        </dd>
                        <dt>Password</dt>
                        <dd>
                            <input type="password" name="Password" onChange={handlePasswordChange} className="form-control" required />
                            <div style={passwordError}>Password is required</div>
                        </dd>
                    </dl>
                    <Button type="submit" variant="contained" color="info" className="w-100"> Login </Button>
                    <Link className="btn btn-link w-100 mt-2" to='/register'>New User? Register</Link>
                </form>
            </div>
        </div>
    );
}
