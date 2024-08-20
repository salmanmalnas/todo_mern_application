import { Link } from "react-router-dom";

export function UserError(){
    return(
        <div className="text-end m-4">
            <h1 className="text-danger pt-4 me-4">Invalid Credentials</h1>
            <Link to='/login' className="btn btn-warning me-4 text-center"> Try Again</Link>
        </div>
    );
}