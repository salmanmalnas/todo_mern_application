import axios from "axios";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export function UserDashBoard() {
    const [cookies, setCookie, removeCookie] = useCookies(['userid']);
    const [appointments, setAppointments] = useState([]);
    const [editAppointment, setEditAppointment] = useState(null);
    let navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            Appointment_Id: 0,
            Title: '',
            Description: '',
            Date: '',
            UserId: cookies['userid']
        },
        onSubmit: appointment => {
            axios.post('http://127.0.0.1:6600/add-task', appointment)
                .then(() => {
                    alert('Task Added Successfully...');
                    LoadAppointments();
                    formik.resetForm(); 
                    document.getElementById('closeAddTaskModal').click();
                });
        }
    });

    const editFormik = useFormik({
        initialValues: {
            Appointment_Id: editAppointment ? editAppointment.Appointment_Id : 0,
            Title: editAppointment ? editAppointment.Title : '',
            Description: editAppointment ? editAppointment.Description : '',
            Date: editAppointment ? editAppointment.Date : '',
            UserId: cookies['userid']
        },
        enableReinitialize: true,
        onSubmit: appointment => {
            axios.put(`http://127.0.0.1:6600/edit-task/${appointment.Appointment_Id}`, appointment)
                .then(() => {
                    alert('Update Successfully...');
                    LoadAppointments();
                    setEditAppointment(null);
                    const modalElement = document.getElementById('EditTask');
                    if (modalElement) {
                        const bootstrapModal = new window.bootstrap.Modal(modalElement);
                        bootstrapModal.hide();
                    }
                });
        }
    });

    useEffect(() => {
        LoadAppointments();
    }, []);

    function LoadAppointments() {
        axios.get(`http://127.0.0.1:6600/get-appointments/${cookies['userid']}`)
            .then(response => {
                setAppointments(response.data);
            });
    }

    function handleSignout() {
        removeCookie('userid');
        navigate('/');
    }

    function handleRemoveClick(id) {
        axios.delete(`http://127.0.0.1:6600/delete-task/${id}`)
            .then(() => {
                alert('Task Removed');
                LoadAppointments();
            });
    }

    function handleEditClick(appointment) {
        setEditAppointment(appointment);
        const modalElement = document.getElementById('EditTask');
        if (modalElement) {
            const bootstrapModal = new window.bootstrap.Modal(modalElement);
            bootstrapModal.show();
        }
    }

    return (
        <div className="row d-flex">
            <div className="col-7">
                <button data-bs-target="#AddTask" data-bs-toggle="modal" style={{ marginLeft: '240px', marginTop: '300px' }} className="bi bi-calendar btn btn-warning"> Add Appointment</button>

                <div className="modal fade" id="AddTask" tabIndex="-1" aria-labelledby="AddTaskLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content" style={{ width: '85%' }}>
                            <form onSubmit={formik.handleSubmit}>
                                <div className="modal-header">
                                    <h2>Add New Appointment</h2>
                                    <button type="button" className="btn btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <dl>
                                        <dt>Appointment Id</dt>
                                        <dd><input type="number" className="form-control" name="Appointment_Id" onChange={formik.handleChange} value={formik.values.Appointment_Id} /></dd>
                                        <dt>Title</dt>
                                        <dd><input type="text" name="Title" className="form-control" onChange={formik.handleChange} value={formik.values.Title} /></dd>
                                        <dt>Description</dt>
                                        <dd><textarea className="form-control" name="Description" onChange={formik.handleChange} value={formik.values.Description} rows="3"></textarea></dd>
                                        <dt>Date</dt>
                                        <dd><input type="date" className="form-control" name="Date" onChange={formik.handleChange} value={formik.values.Date} /></dd>
                                    </dl>
                                </div>
                                <div className="modal-footer">
                                    <button type="submit" className="bi bi-calendar-date btn btn-info">Add Task</button>
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" id="closeAddTaskModal" style={{ display: 'none' }}>Close</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-5">
                <h3>{cookies['userid']} - Dashboard. <button onClick={handleSignout} className="btn btn-danger">Signout</button></h3>
                <div className="mt-4">
                    {appointments.map(appointment => (
                        <div key={appointment.Appointment_Id} className="alert alert-success alert-dismissible">
                            <button onClick={() => { handleRemoveClick(appointment.Appointment_Id) }} className="btn-close" aria-label="Close"></button>
                            <h3 className="alert-title" style={{marginTop: '-5px'}}>{appointment.Title}</h3>
                            <p className="alert-text" style={{marginTop: '-5px'}}>{appointment.Description}</p>
                            <p style={{marginTop: '-10px'}}>{appointment.Date}</p>
                            <button data-bs-target="#EditTask" data-bs-toggle="modal" onClick={() => handleEditClick(appointment)} className="btn btn-warning" style={{marginTop: '-10px'}}> Edit Task <span className="bi bi-pen-fill"></span></button>
                        </div>
                    ))}
                </div>
            </div>

            {editAppointment && (
                <div className="modal fade" id="EditTask" tabIndex="-1" aria-labelledby="EditTaskLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content" style={{ width: '85%' }}>
                            <form onSubmit={editFormik.handleSubmit}>
                                <div className="modal-header">
                                    <h2>Edit Appointment</h2>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <dl>
                                        <dt>Appointment Id</dt>
                                        <dd><input type="number" className="form-control" name="Appointment_Id" onChange={editFormik.handleChange} value={editFormik.values.Appointment_Id} disabled /></dd>
                                        <dt>Title</dt>
                                        <dd><input type="text" name="Title" className="form-control" onChange={editFormik.handleChange} value={editFormik.values.Title} /></dd>
                                        <dt>Description</dt>
                                        <dd><textarea className="form-control" name="Description" onChange={editFormik.handleChange} value={editFormik.values.Description} rows="3"></textarea></dd>
                                        <dt>Date</dt>
                                        <dd><input type="date" className="form-control" name="Date" onChange={editFormik.handleChange} value={editFormik.values.Date} /></dd>
                                    </dl>
                                </div>
                                <div className="modal-footer">
                                    <button type="submit" className="bi bi-calendar-date btn btn-info">Save Changes</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
