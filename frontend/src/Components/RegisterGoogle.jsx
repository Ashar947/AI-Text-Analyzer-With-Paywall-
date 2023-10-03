import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Navbar from './Header'
import Footer from './Footer';
import { Link } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import jwt_decode from "jwt-decode";

export default function RegisterGoogle() {
    const [google, setgoogle] = useState({
        name: "",
        email: "",
        domain: "google",
        email_verified: false
    });
    const navigate = useNavigate();
    const [fingerprint, setFingerprint] = useState('');

    const [successAlert, setSuccessAlert] = useState(false);
    const [succesmsg, setSuccesmsg] = useState()
    const [errorAlert, setErrorAlert] = useState(false);
  
    const hideAlerts = async () => {
      setSuccessAlert(false);
      setErrorAlert(false);
    };
    let value_finger;
    const [inuser, setInuser] = useState({
        phone: "", referral: ""
    })
    let name, value;
    const handleChange = (event) => {
        name = event.target.name;
        value = event.target.value;
        setInuser({ ...inuser, [name]: value })
        console.log(inuser);
    }

    const RegisterGoogle = async () => {
        try {
            const { phone, referral } = inuser;
            console.log("in TRY")
            const { name, email, domain, email_verified } = google;
            const response = await fetch('http://localhost:5000/api/user/register_google', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ fullName: name, email: email, email_verified: email_verified, phone: phone, referedBy: referral, fingerprint: fingerprint })
            });
            console.log(response)
            const data = await response.json();
            console.log(data)
            console.log(response.status)
            if (response.status === 200) {
                setSuccesmsg(data.message)
                setSuccessAlert(true);
                setTimeout(hideAlerts, 2000);
                setTimeout(() => {
                  navigate('/Login');
                }, 3000);
            } else if (response.status === 404) {
                setSuccesmsg(data.message)
        setErrorAlert(true);
        setTimeout(hideAlerts, 2000);
                console.log(data.message)
            } else {
                setSuccesmsg('Please Try Again Later ')
                setErrorAlert(true);
                setTimeout(hideAlerts, 2000);
                console.log("Please Try Again Later .");
            }
        } catch (error) {
            window.alert(error)
        }
    }






    console.log(fingerprint);
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
            <Navbar />
            <div>
            {successAlert && (
          <div className="alert alert-success" role="alert">
            {succesmsg}
          </div>
        )}    {errorAlert && (
          <div className="alert alert-danger" role="alert">
            {succesmsg}       </div>
        )}
                <div className="container mt-16 w-100 h-[80vh] ">
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <div className="card">
                                <div className="card-body">
                                    <h2 className="card-title text-center mb-4">Sign Up With Google</h2>
                                    <form>
                                        <input type="text" hidden className="form-control" value={fingerprint} />
                                        <div className="mb-3">
                                            <label htmlFor="phone" className="form-label">Phone Number</label>
                                            <input type="phone" className="form-control" id="phone" name='phone' autoComplete='off' value={inuser.phone} onChange={handleChange} />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="referal" className="form-label">Referal Code  ( optional )</label>
                                            <input type="text" className="form-control" id="referral" name='referral' autoComplete='off' value={inuser.referral} onChange={handleChange} />
                                        </div>
                                        {/* Enter Key Here */}
                                        <GoogleOAuthProvider clientId="EnterAPIHere">
                                            <GoogleLogin
                                            text="signup_with"
                                                onSuccess={(credentialResponse) => {
                                                    var decoded = jwt_decode(credentialResponse.credential);
                                                    google.email = decoded.email;
                                                    google.email_verified = decoded.email_verified;
                                                    google.name = decoded.name
                                                    if (google.email_verified) {
                                                        console.log(google);
                                                        RegisterGoogle();
                                                    } else {
                                                        window.alert("Your Email is not Verified . Please Try Again after Contacting with Google ")
                                                    }
                                                }}
                                                onError={() => {
                                                    console.log("Login Failed");
                                                    window.alert("Login Failed . Please Try Again Later ...");
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
