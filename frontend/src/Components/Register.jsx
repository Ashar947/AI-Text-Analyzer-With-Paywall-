import React, { useState , useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Navbar from './Header'
import Footer from './Footer';
import { Link } from 'react-router-dom';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import {GoogleLoginButton } from 'react-social-login-buttons'

export default function Signup() {
  const navigate = useNavigate();
  const [fingerprint, setFingerprint] = useState('');
  const [successAlert, setSuccessAlert] = useState(false);
  const [succesmsg,setSuccesmsg]=useState()
  const [errorAlert, setErrorAlert] = useState(false);
  
  const hideAlerts = () => {
    setSuccessAlert(false);
    setErrorAlert(false);
  };

  let value_finger;
  const [inuser, setInuser] = useState({
    name: "", phone: "", email: "", password: "", referral: ""
  })
  let name, value;
  const handleChange = (event) => {
    name = event.target.name;
    value = event.target.value;
    setInuser({ ...inuser, [name]: value })
    console.log(inuser);
  }



  const registerData = async (event) => {
    try {
      event.preventDefault();
      const { name, phone, referral, email, password } = inuser;
      const response = await fetch('http://localhost:5000/api/user/register', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ fullName: name, phone: phone, referedBy: referral, email: email, password: password ,fingerprint:fingerprint })
      });
      const data = await response.json();
      console.log(data)
      console.log(response.status)
      if (response.status === 200) {
        setTimeout(() => {
          hideAlerts();
        }, 2000);
        console.log(data.message);
        navigate('/Login'); // Redirect to Login page after registration
    
      } else if (response.status === 404) {
          setSuccesmsg(data.message)
          setErrorAlert(true);
          setTimeout(hideAlerts, 4000);
          console.log(data.message)
      } else {
        setSuccesmsg("Please Try Again Later")
        setErrorAlert(true);
        setTimeout(hideAlerts, 4000);
        console.log("Please Try Again Later .");
      }
    } catch (error) {
      window.alert("catch error")
    }
  };




  useEffect(() => {

       const setFp = async () => {
      const fp = await FingerprintJS.load();
      const { visitorId } = await fp.get();
      console.log(visitorId)
      setFingerprint(visitorId);
    };
  setFp();
  }, []);

  return (
    <>
    <Navbar/>
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
                <h2 className="card-title text-center mb-4">Sign Up</h2>
                <form>
                  <div className="mb-3 row ">
                    <div className="col">
                      <label htmlFor="firstName" className="form-label">Name</label>
                      <input type="text" className="form-control" id="name" name='name' autoComplete='off' value={inuser.name} onChange={handleChange} />
                    </div>
                  </div>
                      <input type="text" hidden className="form-control" value={fingerprint} />
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
                  <div className="mb-3">
                    <label htmlFor="referal" className="form-label">Referal Code  ( optional )</label>
                    <input type="text" className="form-control" id="referral" name='referral' autoComplete='off' value={inuser.referral} onChange={handleChange} />
                  </div>
                  <button className="btn w-100 greenbtn btn-block" onClick={registerData}>Sign Up</button>
                  <br/>
                  <br/>
                  <Link to='/Register-Google' className="btn text-center w-100 btn-block"><GoogleLoginButton >
  <span className='text-center d-flex justify-content-center'>Signup With Google</span>
</GoogleLoginButton ></Link>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
     <Footer/>
     </>
  )
}
