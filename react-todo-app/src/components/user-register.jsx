import { useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";


export function UserRegister(){

    const [error, setError] = useState('');
    const [errorClass, setErrorClass] = useState('');
    
    let navigate= useNavigate();
    const formik = useFormik({
        initialValues: {
            UserId:'',
            UserName:'',
            Password:'',
            Email:'',
            Mobile:''
        },
        onSubmit : (user =>{
          axios.post('http://127.0.0.1:6600/register-user', user)
          .then(()=>{
            alert('Registered Succesfully...');
            navigate('/login') ;
          })  
        })
    })

    function VerifyUserId(e){
        axios.get('http://127.0.0.1:6600/get-users')
        .then(response=>{
            for(var user of response.data)
                {
                    if (user.UserId===e.target.value){
                        setError('User Id Taken - Try Another');
                        setErrorClass('text-danger');
                        break;
                    } else{
                        setError('User Id Available');
                        setErrorClass('text-success');
                    }
                }
        })
    }

    return(
        <div className="d-flex justify-content-end">
            <form onSubmit={formik.handleSubmit} className="m-4 p-4 text-dark border border-2">
                <h3>Register User</h3>
                <dl>
                    <dt>UserId</dt>
                    <dd><input type="text" onKeyUp={VerifyUserId} name="UserId" onChange={formik.handleChange} required /></dd>
                    <dd className={errorClass}> {error} </dd>
                    <dt>User Name</dt>
                    <dd><input type="text" name="UserName" onChange={formik.handleChange} required/></dd>
                    <dt>Password</dt>
                    <dd><input type="password" name="Password" onChange={formik.handleChange} required /></dd>
                    <dt>Email</dt>
                    <dd><input type="email" name="Email" onChange={formik.handleChange} required /></dd>
                    <dt>Mobile</dt>
                    <dd><input type="text" name="Mobile" onChange={formik.handleChange} required /></dd>
                </dl>
                <button className="w-100">Register</button>
                <Link className=" mt-4 btn btn-link" style={{ marginRight: '-70px', color: 'black' }} to="/login"> Have Account? Login</Link>
            </form>
        </div>
    )
}