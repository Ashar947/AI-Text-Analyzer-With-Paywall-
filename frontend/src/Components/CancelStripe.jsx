import React from "react";
import { useNavigate } from "react-router-dom";



export default function CancelStripe() {
    const navigate = useNavigate();
    window.alert('Payment Cancelled . Please Try Again Later ');
    navigate('/');
    return (
        <div>
            <h1>Payment Cancelled</h1>
        </div>
    );
}