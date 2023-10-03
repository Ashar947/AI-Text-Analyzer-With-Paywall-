import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";


export default function Login() {
  const navigate = useNavigate();
  const [inuser, setInuser] = useState({
    email: "", password: ""
  })
  const [successAlert, setSuccessAlert] = useState(false);
  const [succesmsg,setSuccesmsg]=useState()
  const [errorAlert, setErrorAlert] = useState(false);

  const hideAlerts = () => {
    setSuccessAlert(false);
    setErrorAlert(false);
  };


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
      const { email, password } = inuser;
      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ email: email, password: password })
      });
      const data = await response.json();
      console.log(data)
      console.log(response.status)
      if (response.status === 200) {
    
          navigate("/admin/Dashboard");

      } else if (response.status === 404) {
        setSuccesmsg(data.message)
        setErrorAlert(true);
        setTimeout(hideAlerts, 4000);
        console.log(data.message)
      } else {
        setSuccesmsg("Please Try Again Later")
        setErrorAlert(true);
        setTimeout(hideAlerts, 2000);
        console.log("Please Try Again Later .");
      }
    } catch (error) {
      setErrorAlert(true);
      setTimeout(hideAlerts, 4000);
    }
  }


  return (
    <>
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
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <h1 className="card-title text-center mb-4 fw-bold fs-4">Welcome to Admin Panel </h1>
                  <form>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email address</label>
                      <input type="email" className="form-control" id="email" name='email' autoComplete='off' value={inuser.email} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">Password</label>
                      <input type="password" className="form-control" id="password" name='password' autoComplete='off' value={inuser.password} onChange={handleChange} required />
                    </div>
                    <button className="btn btn-primary w-full" onClick={registerAdmin}>Login</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
