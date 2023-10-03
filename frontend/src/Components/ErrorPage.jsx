import React from "react";
import { useNavigate } from "react-router-dom";



export default function ErrorPage() {
  const navigate = useNavigate();
  setTimeout(() => {
    navigate('/');
  }, 1500);
    return(
        <div className="container ">
        <h1 className="fs-1 fw-bold"> PAYMENT FAILED </h1>
        </div>
    );
}