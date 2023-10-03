import React, { useState, useEffect } from "react";
import Navbar from "../Components/Header";
import Footer from "../Components/Footer";
import PayPalButton from "../Components/Paypalbutton";
import SelectOption from "../Components/Select";
import { Select, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Checkbox, FormControlLabel } from "@mui/material";
import { Label } from "@mui/icons-material";

export default function Home() {
  const [successAlert, setSuccessAlert] = useState(false);
  const [succesmsg, setSuccesmsg] = useState()
  const [errorAlert, setErrorAlert] = useState(false);

  const navigate = useNavigate();
  const [userLogin, setuserLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [text, setText] = useState("");
  const [analyzedtext, setanalyzedText] = useState("");
  const [errorAlert2, setErrorAlert2] = useState(false);
  const [isChecked,setIsChecked] = useState(false)
  const hideAlerts = () => {
    setErrorAlert(false);
    setErrorAlert2(false);
  };

  const handleChange = (value) => {
    console.log(`selected ${value}`);
    console.log(text);
  };
  const handelonchange = (event) => {
    setText(event.target.value);
    // console.log(text)
  };
  const Cl = () => {
    let newtext = " ";
    setText(newtext);
  };
  const Res = () => {
    let newtext = text.split(/[ ]+/);
    setText(newtext.join(" "));
  };
  const Ct = () => {
    let newtext = document.getElementById("exampleFormControlTextarea1");
    newtext.select();
    navigator.clipboard.writeText(newtext.value);
  };
  const clearAnalyzedText =()=>{
    setanalyzedText("");
  }
  const getRefToken = async (event) => {
    try {
      console.log("intry");
      const response = await fetch(
        "http://localhost:5000/api/user/getReferalToken",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const data = await response.json();
      console.log(data);
      console.log(response.status);
      if (response.status === 200) {
        setuserLogin(data.status);
        setUsername(data.remainingWords);
        console.log("success");
      } else {
        setuserLogin(data.status);
        // window.alert("Please Try Again Later .");
        console.log("Please Try Again Later .");
      }
    } catch (error) {
      window.alert("catch error");
    }
  };
  const analyzeTextData = async (event) => {
    try {
      event.preventDefault();
      if(!isChecked){
        setSuccesmsg("Please Agree To Terms and Condition First ")
        setErrorAlert(true);
        setTimeout(hideAlerts, 2000);
        return;
      }
      // const { name, phone, referral, email, password } = text;
      const response = await fetch(
        "http://localhost:5000/api/user/textAnalyser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ text: text }),
        }
      );
      const data = await response.json();
      console.log(data);
      console.log(response.status);
      if (response.status === 200) {
        setanalyzedText(data.message);
        getRefToken();
      } else if (response.status === 505) {
        setSuccesmsg("User Not Logged In")
        setErrorAlert(true);
        setTimeout(hideAlerts, 2000);
        setTimeout(() => {
          navigate('/Login');
        }, 3000);
      } else if (response.status === 250) {
        setSuccesmsg(`${data.message} \n Remaining Limit : ${data.limitRemaining}`)
        setErrorAlert(true);
        setTimeout(hideAlerts, 2000);
      } else if (response.status === 403) {
        setSuccesmsg(`${data.message} \n Remaining Limit : ${data.limitRemaining}`)
        setErrorAlert(true);
        setTimeout(hideAlerts, 2000);
      } else if (response.status === 404) {
        setSuccesmsg(data.message)
        setErrorAlert(true);
        setTimeout(hideAlerts, 2000);
        console.log(data.message);
      } else{
        setSuccesmsg(data.message)
        setErrorAlert(true);
        setTimeout(hideAlerts, 2000);
      }
    } catch (error) {
      console.log(error);
      setSuccesmsg("Text Length Exceding ")
      setErrorAlert(true);
      setTimeout(hideAlerts, 2000);
    }
  };
  useEffect(() => {
    getRefToken();
  }, []);
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
    {(() => {
        if (userLogin) {
          return (
        <div className=" d-flex align-items-center  my-2 justify-content-center custom"><button className="btn greenbtn">Remaining Words : {username} </button></div> 
          );
        }
      })()}
      <div className=" 
      container tableRsponsive d-flex align-items-center w-100  justify-content-center centering-content-mobile ">
     
        <div
          className="d-flex align-items-center w-100 justify-content-center centering-content-mobile mx-1"
          style={{ maxWidth: "850px" }}
        >
          <div
            className="w-100 text-center fw-bold bg-gray-100 p-4 rounded-4"
            style={{ maxWidth: "850px" }}
          >
            <div className="d-flex justify-content-between custom-home-div">
              <div className="d-flex justify-content-between custom-home-div ">
                <div className="d-flex custom">
                  <div
                    htmlFor="select1"
                    className="d-flex  align-items-center justify-content-center"
                  >
                    READABILITY
                  </div>
                  <Select
                    defaultValue="lucy"
                    className="mx-2 rounded-pill home-select"
                    style={{
                      width: 120,
                    }}
                    onChange={handleChange}
                    options={[
                      {
                        value: "1",
                        label: "1",
                      },
                      {
                        value: "Marketing",
                        label: "Marketing",
                      },
                      {
                        value: "2",
                        label: "2",
                      },
                      {
                        value: "3",
                        label: "3",
                      },
                    ]}
                  />
                </div>
                <div className="d-flex custom">
                  <div
                    htmlFor="select1"
                    className="d-flex align-items-center  justify-content-center"
                  >
                    PURPOSE
                  </div>
                  <Select
                    className="mx-2 rounded-pill home-select"
                    defaultValue="lucy"
                    style={{
                      width: 120,
                    }}
                    onChange={handleChange}
                    options={[
                      {
                        value: "1",
                        label: "1",
                      },
                      {
                        value: "General Writing",
                        label: "General Writing",
                      },
                      {
                        value: "2",
                        label: "2",
                      },
                      {
                        value: "3",
                        label: "3",
                      },
                    ]}
                  />
                </div>
              </div>
            </div>
       
            <div className="d-flex justify-content-between">
              <h1 className="btn btn-transparent">
                0/{text.length} CHARS = {text.split(" ").length} WORDS
              </h1>
            </div>
            <textarea
              className="form-control my-3"
              id="exampleFormControlTextarea2"
              onChange={handelonchange}
              value={text}
              placeholder="ENTER TEXT TO ANAYLIZE"
              rows="6"
            ></textarea>
            <div className="d-flex my-2"> <FormControlLabel onChange={((e)=> setIsChecked(e.target.checked))} control={<Checkbox />} label="Agreee to terms and Condition ?" /></div>
            <div className="d-flex justify-content-between">
              <div className="d-flex justify-content-center">
                <Link to="/Pricing" className="btn greenbtn" >Upgrade Now </Link>
              </div>
              <div className="">
                <button className="btn greenbtn buttons mx-2" onClick={analyzeTextData}>
                Humanize
                </button>
                <button className="btn greenbtn buttons">    Check For AI</button>
                </div>
            </div>
          </div>
        </div>
     
        <div
          className="w-100 mt-10 d-flex align-items-center justify-content-center centering-content-mobile mx-1 "
          style={{ maxWidth: "600px" }}
        >
          <div
            className="w-100 text-center fw-bold bg-gray-100 p-4 rounded-4"
            style={{ maxWidth: "700px" }}
          >
            <h1>YOUR ANAYLIZE TEXT</h1>
            <textarea
              className="form-control my-3"
              value={analyzedtext}
              id="exampleFormControlTextarea1"
              rows="6"
            ></textarea>
            <button className="btn greenbtn mx-2" onClick={Ct}>
              Copy Text
            </button>
            <button className="btn greenbtn mx-2" onClick={clearAnalyzedText}>
              Clear Text
            </button>
          </div>
        </div>
      </div>
      {/* <h1>React PayPal Integration</h1>
      <PayPalButton /> */}
      <Footer />
    </>
  );
}
