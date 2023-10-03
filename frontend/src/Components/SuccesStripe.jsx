import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";



export default function SuccessStripe() {
  const navigate = useNavigate();
    const [text, setText] = useState("");
    const [confirm, setConfirm] = useState("");

    const checkUserPermission = async (event) => {
      try{
        console.log("intry")
      const response = await fetch('http://localhost:5000/api/user/checkPaymentPageForStripe', {
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
        setConfirm(data.message);
        confirmPayment();
      } else if (response.status === 505) {
        window.alert("User Not Logged In")
        navigate('/Login');
        // console.log(data.message)
      } else if (response.status === 404) {
        window.alert("User Not Allowed On This Page ............");
        console.log("User Not Allowed On This Page ..............");
        navigate('/');
      }
    }catch(error){
      window.alert("catch error")
    }
  }


    const confirmPayment = async (event) => {
        try{
          console.log("intry")
        const response = await fetch('http://localhost:5000/api/user/subscribe', {
          method: "POST",
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
          setText(data.message);
          console.log("success")
          navigate('/');
        } else if (response.status === 505) {
          window.alert("User Not Logged In")
          navigate('/Login')
          // console.log(data.message)
        } else {
          navigate('/');
        }
      }catch(error){
        window.alert("catch error")
        navigate('/');
      }
    }
    useEffect(() => {
      checkUserPermission();
      }, []);
    return(
        <div>
            <h1>Please Wait While Payment Is Being Processed</h1>
            <br/>
            <br/>
            <h3>{confirm}</h3>
            <br/>
            <br/>
            <h3>{text}</h3>
        </div>
    );
}