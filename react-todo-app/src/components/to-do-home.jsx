import { Link } from "react-router-dom";

export function ToDoHome(){
    return(
        <div>
            <h2 className="text-end me-4 pt-4">Your Appointment - To-Do</h2>
            <main style={{height:'400px'}} className="me-4 pe-4 d-flex justify-content-end align-items-center">
                <Link to='/register' className="btn btn-light me-2"> New User Register</Link>
                <Link to='/login' className="btn btn-warning">User Login</Link>
            </main>
        </div>
    );
}