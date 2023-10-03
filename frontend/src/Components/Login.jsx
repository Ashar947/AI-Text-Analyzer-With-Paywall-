import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Navbar from './Header'
import Footer from './Footer';
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";


export default function Login() {
  const navigate = useNavigate();
  const [google, setgoogle] = useState({
    name: "",
    email: "",
    domain: "google",
    email_verified: false
  });
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


  const loginData = async (event) => {
    try {
      event.preventDefault();
      const { email, password } = inuser;
      const response = await fetch('http://localhost:5000/api/user/login', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ email: email, password: password })
      });
      const data = await response.json();
      console.log(data)
      console.log(response)
      console.log(response.status)
      if (response.status === 200) {
        const myCookie = response.headers.get('Set-Cookie');
        document.cookie = myCookie;
        setSuccesmsg(data.message)
        setSuccessAlert(true);
        setTimeout(hideAlerts, 1500);
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else if (response.status === 404) {
        setSuccesmsg(data.message)
        setErrorAlert(true)
        console.log(data.message)
      } else {
        setSuccesmsg(data.message)
        setErrorAlert(true)
        console.log("Please Try Again Later .");
      }
    } catch (error) {
      setSuccesmsg("error")
      setErrorAlert(true)
    }
  };


  const loginWithGoogle = async () => {
    try {
      console.log("in TRY")
      const { email } = google;
      const response = await fetch('http://localhost:5000/api/user/login_google', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ email: email })
      });
      console.log(response)
      const data = await response.json();
      console.log(data)
      console.log(response.status)
      if (response.status === 200) {
        const myCookie = response.headers.get('Set-Cookie');
        document.cookie = myCookie;
        // window.alert(data.message)
        setSuccesmsg(data.message)
        setSuccessAlert(true);
        setTimeout(hideAlerts, 2000);
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else if (response.status === 404) {
        setSuccesmsg(data.message)
        setErrorAlert(true)
        console.log(data.message)
      } else {
        setSuccesmsg("Please  Try again Later")
        setErrorAlert(true)
        console.log("Please Try Again Later .");
      }
    } catch (error) {
      window.alert(error)
    }
  }


  return (
    <>
      <Navbar />
      {successAlert && (
          <div className="alert alert-success" role="alert">
         {succesmsg}
          </div>
        )}    {errorAlert && (
          <div className="alert alert-danger" role="alert">
{succesmsg}       </div>
        )}
      <div>
        <div className="container my-5 h-[80vh] mt-24 items-center">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <h2 className="card-title text-center mb-4 ">Log in</h2>
                  <form>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email address</label>
                      <input type="email" className="form-control" id="email" name='email' autoComplete='off' value={inuser.email} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">Password</label>
                      <input type="password" className="form-control" id="password" name='password' autoComplete='off' value={inuser.password} onChange={handleChange} required />
                    </div>
                    <button className="btn greenbtn w-full" onClick={loginData}>Login</button>
                    <div class="flex items-center justify-between my-3">
                                <div class="flex items-center">
                                Donot have an Account? 
                                </div>
                                <Link className="underline" to="/Register">Register Now</Link>
                            </div>
                            {/*EnterIDHere*/}
                    <GoogleOAuthProvider clientId="EnterIDHere">
                      <GoogleLogin
                      width="400px"
                      size="large"
                        onSuccess={(credentialResponse) => {
                          var decoded = jwt_decode(credentialResponse.credential);
                          google.email = decoded.email;
                          google.email_verified = decoded.email_verified;
                          google.name = decoded.name
                          loginWithGoogle();
                          // if (google.email_verified) {
                          //   console.log(google);
                          //   loginWithGoogle();
                          // } else {
                          //   window.alert("Your Email is not Verified . Please Try Again Later")
                          // }
                        }}
                        onError={() => {
                          console.log("Login Failed");
                          setSuccesmsg("Login Failed")
                          setErrorAlert(true);
                          setTimeout(hideAlerts, 4000);
                        }}
                      />
                    </GoogleOAuthProvider>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
