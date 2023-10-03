import React , {useState,useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import Navbar from './Header'
import Footer from './Footer';


function ReferralPage() {
  const [successAlert, setSuccessAlert] = useState(false);
  const [succesmsg, setSuccesmsg] = useState()
  const [errorAlert, setErrorAlert] = useState(false);

  const hideAlerts = async () => {
    setSuccessAlert(false);
    setErrorAlert(false);
  };
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    token: "",
  });
  const getRefToken = async (event) => {
    try{
      console.log("intry")
    const response = await fetch('http://localhost:5000/api/user/getReferalToken', {
      method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
    const data = await response.json();
    console.log(data)
    console.log(response.status)
    if (response.status === 200) {
      setUserData(data);
      console.log("success")
    } else if (response.status === 505) {
      setSuccesmsg(data.message)
        setErrorAlert(true);
        setTimeout(hideAlerts, 2000);
        setTimeout(() => {
          navigate('/Login');
        }, 2000);
    } else {
      setSuccesmsg(data.message)
        setErrorAlert(true);
        setTimeout(hideAlerts, 2000);
      console.log("Please Try Again Later .");
    }
  }catch(error){
    setSuccesmsg("Please Try Again Later .")
    setErrorAlert(true);
    setTimeout(hideAlerts, 2000);
  console.log("Please Try Again Later .");
  }
}
useEffect(() => {
  getRefToken();
}, []);
  const Ct = () => {
    try {
      const newtext = document.getElementById("link");
      const range = document.createRange();
      range.selectNode(newtext);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      document.execCommand("copy");
      setSuccesmsg("Link Copied To Clipboard")
      setSuccessAlert(true);
      setTimeout(hideAlerts, 2000);
    } catch (error) {
      console.error("Error copying link to clipboard:", error);
    }
  };

  return (
    <>
    <Navbar/>
    {successAlert && (
          <div className="alert alert-success" role="alert">
            {succesmsg}
          </div>
        )}    {errorAlert && (
          <div className="alert alert-danger" role="alert">
            {succesmsg}       </div>
        )}
    <div className="container mt-5">
      <div className="row justify-content-center">
        <h1 className="sm:text-center display-5 py-2 fw-bold text-dark centering-content-mobile">Share And Get 10% Commision </h1>
        <div className="col-md-6 mt-4 d-flex flex-col justify-content-center items-center">
            <h2 className='text-center fw-bold  mb-4'> Here is your Referal Code . Use when Creating Account .
            </h2>
          <div className="alert alert-success text-center" id="link" role="alert">
             {userData.token}
          </div>
          <button onClick={Ct} className="btn text-white w-40 " style={{backgroundColor:"#00CF83"}}>
            Copy Link
          </button>
  </div>
        </div>
       
      </div>
      <Footer/>
      </>
  );
}

export default ReferralPage;
