import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

export default function AdminRegister() {
  const [successAlert, setSuccessAlert] = useState(false);
  const [succesmsg, setSuccesmsg] = useState()
  const [errorAlert, setErrorAlert] = useState(false);

  const hideAlerts = async () => {
    setSuccessAlert(false);
    setErrorAlert(false);
  };
  const navigate = useNavigate();
  const [inuser, setInuser] = useState({
    name: "", phone: "", email: "", password: ""
  })
  let name, value;
  const handleChange = (event) => {
    name = event.target.name;
    value = event.target.value;
    setInuser({ ...inuser, [name]: value })
    console.log(inuser);
  }
  const registerAdmin = async (event) => {
    try {
      event.preventDefault();
      const { name, phone, email, password } = inuser;
      const response = await fetch('http://localhost:5000/api/admin/register', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ fullName: name, phone: phone, email: email, password: password })
      });
      const data = await response.json();
      console.log(data)
      console.log(response.status)
      if (response.status === 200) {
        console.log(data.message);
        setSuccesmsg(data.message)
        setSuccessAlert(true);
        setTimeout(hideAlerts, 2000);
        setTimeout(() => {
          navigate('/admin/Dashboard');
        }, 3000);
      } else if (response.status === 404) {
        setSuccesmsg(data.message)
        setErrorAlert(true);
        setTimeout(hideAlerts, 2000);
      } else if (response.status === 505) {
        console.log("Admin Must Be Logged In To Register New Admin .");
        setSuccesmsg(data.message)
        setErrorAlert(true);
        setTimeout(hideAlerts, 2000);
        setTimeout(() => {
          navigate('/admin');
        }, 3000);
      }
    } catch (error) {
      window.alert("catch error")
    }
  }
  return (
    <div>
      <div>
        {successAlert && (
          <div className="alert alert-success" role="alert">
            {succesmsg}
          </div>
        )}    {errorAlert && (
          <div className="alert alert-danger" role="alert">
            {succesmsg}       </div>
        )}
        <div className="container my-5">
          <div className='head' style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Link to='/admin/Dashboard' className="btn btn-primary">Back to Dashboard</Link>
          </div>
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <h2 className="card-title text-center mb-4 fw-bold fs-4">Add New Admin</h2>
                  <form>
                    <div className="mb-3 row ">
                      <div className="col">
                        <label htmlFor="firstName" className="form-label">Name</label>
                        <input type="text" className="form-control" id="name" name='name' autoComplete='off' value={inuser.name} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email address</label>
                      <input type="email" className="form-control" id="email" name='email' autoComplete='off' value={inuser.email} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">Password</label>
                      <input type="password" className="form-control" id="password" name='password' autoComplete='off' value={inuser.password} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="phone" className="form-label">Phone Number</label>
                      <input type="phone" className="form-control" id="phone" name='phone' autoComplete='off' value={inuser.phone} onChange={handleChange} />
                    </div>
                    <button className="btn w-100 btn-primary btn-block" onClick={registerAdmin} >Assinge New Admin</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  )
}
