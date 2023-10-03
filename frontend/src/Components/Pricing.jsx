import React, { useState } from "react";
// import Slideer from "./Slider";
import { loadStripe } from '@stripe/stripe-js';
import { Slider } from "@mui/material";
import Navbar from './Header'
import Footer from './Footer';
import { useNavigate } from "react-router-dom";


export default function Pricing() {
  const navigate = useNavigate();
  const [successAlert, setSuccessAlert] = useState(false);
  const [succesmsg, setSuccesmsg] = useState()
  const [errorAlert, setErrorAlert] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  
  const hideAlerts = async () => {
    setSuccessAlert(false);
    setErrorAlert(false);
  };
  // Define the minimum and maximum price for monthly subscription
  const minMonthlyPrice = 9.99;
  const maxMonthlyPrice = 209.0;
  const monthlyStep = 40000;
  
  // Calculate the monthly price based on selected words
  const calculateMonthlyPrice = (words) => {
    const numberOfSteps = Math.ceil((words - 10000) / monthlyStep);
    const price = minMonthlyPrice + numberOfSteps * 20.0;
    return price.toFixed(2); // Format to two decimal places
  };

    // Define the minimum and maximum price for monthly subscription
    const minyearPrice = 120.00;
    const maxyearPrice = 1250.00;
    const yearStep = 40000;
    
    // Calculate the monthly price based on selected words
    const calculateYearPrice = (words) => {
      const numberOfSteps = Math.ceil((words - 10000) / yearStep);
      const price = minyearPrice + numberOfSteps * 10.0;
      return price.toFixed(2); // Format to two decimal places
    };

    const handleClosePopup = () => {
      setShowPopup(false);
    };
  
    const handleOpenPopup = () => {
      setShowPopup(true);
    };
  const makePayment_m = async () => {
    try {
      // EnterIDHere
      const stripe = await loadStripe('EnterkeyHere');
      const price = calculateMonthlyPrice(selectedMonthWords)
      const response = await fetch('http://localhost:5000/api/user/create-payment-stripe', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ words: selectedMonthWords, price , duration: "m", currency: selectedMonthCurrency.toLowerCase() })
      });
      if (response.status === 505) {
        setSuccesmsg("User Not Login")
        setErrorAlert(true);
        setTimeout(hideAlerts, 2000);
      }
      const session = await response.json();
      console.log(session);
      console.log("session");
      const result = stripe.redirectToCheckout({
        sessionId: session.id
      });
      console.log("result")
      console.log(result)
      if (result.error) {
        console.log("error");
      }
    } catch (error) {
      console.log("Catch Error")
      console.log(error)
    }

  }

  const makePayment_y = async () => {
    try {
      // EnterIDHere
      const stripe = await loadStripe('');
      const price = calculateYearPrice(selectedYearWords)
      const response = await fetch('http://localhost:5000/api/user/create-payment-stripe', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ words: selectedYearWords, price , duration: "y", currency: selectedYearCurrency.toLowerCase() })
      });
      if (response.status === 505) {
        setSuccesmsg("User Not Logged In")
        setErrorAlert(true);
        setTimeout(hideAlerts, 2000);
        setTimeout(() => {
          navigate('/Login');
        }, 3000);
      }
      const session = await response.json();
      console.log("session");
      console.log(session);
      const result = stripe.redirectToCheckout({
        sessionId: session.id
      });
      console.log("result")
      console.log(result)
      if (result.error) {
        console.log("error");
      }
    } catch (error) {
      console.log("error catch")
      console.log(error)
    }

  }

  const [selectedMonthWords, setSelectedMonthWords] = useState(10000);
  const [selectedYearWords, setSelectedYearWords] = useState(150000);
  const [selectedMonthCurrency, setSelectedMonthCurrency] = useState('usd');
  const [selectedYearCurrency, setSelectedYearCurrency] = useState('usd');

  const handleSliderChange = (event, newValue) => {
    setSelectedMonthWords(newValue);
    console.log(selectedMonthWords)
  };

  const handleCurrencyChange = (event) => {
    setSelectedMonthCurrency(event.target.value);
    console.log(selectedMonthCurrency)
  };

  const handleyearSliderChange = (event, newValue) => {
    setSelectedYearWords(newValue);
    console.log(selectedYearWords)
  };

  const handleyearCurrencyChange = (event) => {
    setSelectedYearCurrency(event.target.value);
    console.log(selectedYearCurrency)
  };
  return (
    <div>
      <Navbar />
      {showPopup && (
    <div className="overlay">
      <div className="popup d-flex justify-content-center flex-col">
        <h1 className="fw-bold text-center mb-3" >Please E-Mail US  </h1>
     <p  className="d-flex justify-content-center" >Due to high volume of enquiries please contact us directly via email for a discouted pricing plan </p>
     <p className="d-flex justify-content-center my-3">You can reach us at : eample@gmail.com</p>
     <h1 className="d-flex justify-content-center fw-bold ">THANK YOU </h1>
        <button className="d-flex justify-content-center my-3 btn  btn-danger "  onClick={handleClosePopup}>Close</button>
      </div>
    </div>
  )}
      {successAlert && (
        <div className="alert alert-success" role="alert">
          {succesmsg}
        </div>
      )}    {errorAlert && (
        <div className="alert alert-danger" role="alert">
          {succesmsg}       </div>
      )}
      <section>
        <div className="relative  items-center w-full mx-auto centering-content-mobile md:px-12 lg:px-16 max-w-8xl">
          <h1 className='sm:text-center display-4  py-2 fw-bold text-dark '> Pricing</h1>
          <h1 className='sm:text-center py-4 '>For Custom or Bussines  purpose  Contact our managing team managing  team</h1>
          <div>
            <div className="relative p-10 space-y-12 overflow-hidden lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8 rounded-xl">
              <div className="relative flex flex-col p-3 bg-white border-3 rounded-1 border-secondary">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-neutral-600 text-center">
                    Monthly
                  </h3>
                  <p className="mt-6 text-gray-500 text-center">
                    The essentials to provide your best work for clients.
                  </p>
                  <p className="flex items-baseline mt-2 text-neutral-600  space-y-4 border-t justify-content-center">
                    <span className="text-xl font-extrabold tracking-tight">
                    ${calculateMonthlyPrice(selectedMonthWords)}
                    </span>
                    <span className="ml-1 text-xl font-semibold">/month</span>
                  </p>
                  <Slider
                    id="monthWords"
                    value={selectedMonthWords}
                    onChange={handleSliderChange}
                    aria-labelledby="monthWords"
                    valueLabelDisplay="auto"
                    step={40000}
                    min={10000}
                    max={380000}
                  />
                  <div className=' text-xl font-semibold text-neutral-600 text-center'>{selectedMonthWords} words/mon</div>
                  <div className="mt-4">
                    <label htmlFor="monthCurrency">Select Currency:</label>
                    <select
                      id="monthCurrency"
                      value={selectedMonthCurrency}
                      onChange={handleCurrencyChange}
                    >
                      <option value="usd">USD</option>
                      <option value="eur">EUR</option>
                    </select>
                  </div>
                  <div className="mt-6 d-flex justify-content-center ">
                    <button
                      href="#"
                      type="highlight"
                      onClick={makePayment_m}
                      className=" items-center block px-5 py-3.5  font-medium text-center text-white  rounded-2"
                      style={{ backgroundColor: "#00CF83" }}
                    >
                      {" "}
                      Get Started{" "}
                    </button>
                  </div>
                  <div className="mt-2 d-flex justify-content-center ">
                    <button
                      href="#"
                      type="highlight"
                      className=" items-center block px-2 py-1  font-medium text-center text-gray-500  rounded-pill border border-2  bg-transparent"
                    >
                      {" "}
                      Cancel Any time{" "}
                    </button>
                  </div>
                  <h2 className="text-center my-3 font-medium" style={{ color: "#FAB515" }}>10% Discount (If Applicable)</h2>
                  <ul role="list" className=" space-y-3 ">
                    <span className="text-lg font-semibold text-neutral-600">
                      Quick Look at Features :
                    </span>

                    <li className="flex">
                      <div className="inline-flex items-center w-6 h-6 bg-blue-600 rounded-xl">
                        <svg
                          className="flex-shrink-0 w-4 h-4 mx-auto text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      </div>
                      <span className="ml-3 text-neutral-600">
                        Up to 10 credit cards
                      </span>
                    </li>

                    <li className="flex">
                      <div className="inline-flex items-center w-6 h-6 bg-blue-600 rounded-xl">
                        <svg
                          className="flex-shrink-0 w-4 h-4 mx-auto text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      </div>
                      <span className="ml-3 text-neutral-600">
                        Up to 1,000 credits
                      </span>
                    </li>

                    <li className="flex">
                      <div className="inline-flex items-center w-6 h-6 bg-blue-600 rounded-xl">
                        <svg
                          className="flex-shrink-0 w-4 h-4 mx-auto text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      </div>
                      <span className="ml-3 text-neutral-600">Tacky wallet</span>
                    </li>

                    <li className="flex">
                      <div className="inline-flex items-center w-6 h-6 bg-blue-600 rounded-xl">
                        <svg
                          className="flex-shrink-0 w-4 h-4 mx-auto text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      </div>
                      <span className="ml-3 text-neutral-600">
                        Personal profile only
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="relative flex flex-col p-3 bg-white border-3 rounded-1 border-secondary">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-neutral-600 text-center">
                    Yearly
                  </h3>
                  <p className="mt-6 text-gray-500 text-center">
                    The essentials to provide your best work for clients.
                  </p>
                  <p className="flex items-baseline mt-2 text-neutral-600  space-y-4 border-t justify-content-center">
                    <span className="text-xl font-extrabold tracking-tight">
                    $ {calculateYearPrice(selectedYearWords)}
                    </span>
                    <span className="ml-1 text-xl font-semibold">/year</span>
                  </p>
                  <Slider
                    id="monthWords"
                    value={selectedYearWords}
                    onChange={handleyearSliderChange}
                    aria-labelledby="monthWords"
                    valueLabelDisplay="auto"
                    step={40000}
                    min={120000}
                    max={4560000}
                  />
                  <div className=' text-xl font-semibold text-neutral-600 text-center'>{selectedYearWords} words/year</div>
                  <div className="mt-4">
                    <label htmlFor="yearCurrency">Select Currency:</label>
                    <select
                      id="yearCurrency"
                      value={selectedYearCurrency}
                      onChange={handleyearCurrencyChange}
                    >
                      <option value="usd">USD</option>
                      <option value="eur">EUR</option>
                    </select>
                  </div>

                  <div className="mt-6 d-flex justify-content-center ">
                    <button
                      href="#"
                      type="highlight"
                      onClick={makePayment_y}

                      className=" items-center block px-5 py-3.5  font-medium text-center text-white  rounded-2"
                      style={{ backgroundColor: "#00CF83" }}
                    >
                      {" "}
                      Get Started Yearly{" "}
                    </button>
                  </div>
                  <div className="mt-2 d-flex justify-content-center ">
                    <button
                      href="#"
                      type="highlight"
                      className=" items-center block px-2 py-1  font-medium text-center text-gray-500  rounded-pill border border-2  bg-transparent"
                    >
                      {" "}
                      Cancel Any time{" "}
                    </button>
                  </div>
                  <h2 className="text-center mt-3 font-medium" style={{ color: "#FAB515" }}>10% Discount (If Applicable)</h2>
                  {/* <h2 className="font-medium text-center mt-2 mb-3 text-gray-500">Charged Annualy 60.00$</h2> */}
                  <br />
                  <ul role="list" className=" space-y-3 ">
                    <span className="text-lg font-semibold text-neutral-600">
                      Quick Look at Features :
                    </span>

                    <li className="flex">
                      <div className="inline-flex items-center w-6 h-6 bg-blue-600 rounded-xl">
                        <svg
                          className="flex-shrink-0 w-4 h-4 mx-auto text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      </div>
                      <span className="ml-3 text-neutral-600">
                        Up to 10 credit cards
                      </span>
                    </li>

                    <li className="flex">
                      <div className="inline-flex items-center w-6 h-6 bg-blue-600 rounded-xl">
                        <svg
                          className="flex-shrink-0 w-4 h-4 mx-auto text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      </div>
                      <span className="ml-3 text-neutral-600">
                        Up to 1,000 credits
                      </span>
                    </li>

                    <li className="flex">
                      <div className="inline-flex items-center w-6 h-6 bg-blue-600 rounded-xl">
                        <svg
                          className="flex-shrink-0 w-4 h-4 mx-auto text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      </div>
                      <span className="ml-3 text-neutral-600">Tacky wallet</span>
                    </li>

                    <li className="flex">
                      <div className="inline-flex items-center w-6 h-6 bg-blue-600 rounded-xl">
                        <svg
                          className="flex-shrink-0 w-4 h-4 mx-auto text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      </div>
                      <span className="ml-3 text-neutral-600">
                        Personal profile only
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="relative flex flex-col p-3 bg-white border-3 rounded-1 border-secondary">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-neutral-600 text-center">
                    For Bussiness
                  </h3>
                  <p className="mt-6 text-gray-500 text-center">
                    The essentials to provide your best work for clients.
                  </p>
                  <p className="flex items-baseline mt-2 text-neutral-600  space-y-4 border-t justify-content-center">

                  </p>
                  <div className="justify-content-center flex flex-col ">
                    <h2 className="text-medium mt-2 font-bold text-neutral-600 text-center">How many words dou you need ?</h2>
                    <input className="border-2 border-gray my-3 px-2" placeholder="E.g 50000" type="number" />
                    <h2 className="text-medium font-bold text-neutral-600 text-center">Our team is here to help you</h2>
                    <div className="mt-6 d-flex justify-content-center ">
                      <button
                        href="#"
                        type="highlight"
                        className=" items-center block px-5 py-3.5  font-medium text-center text-white  rounded-2"
                        style={{ backgroundColor: "#00CF83" }}
                        onClick={handleOpenPopup}
                      >
                        {" "}
                        Get Started{" "}
                      </button>
                    </div>
                    <h2 className="text-center my-3 font-medium" style={{ color: "#FAB515" }}>Custom Discount</h2>
                  </div>
                  <ul role="list" className=" space-y-3 ">
                    <span className="text-lg font-semibold text-neutral-600">
                      Quick Look at Features :
                    </span>

                    <li className="flex">
                      <div className="inline-flex items-center w-6 h-6 bg-blue-600 rounded-xl">
                        <svg
                          className="flex-shrink-0 w-4 h-4 mx-auto text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      </div>
                      <span className="ml-3 text-neutral-600">
                        Up to 10 credit cards
                      </span>
                    </li>

                    <li className="flex">
                      <div className="inline-flex items-center w-6 h-6 bg-blue-600 rounded-xl">
                        <svg
                          className="flex-shrink-0 w-4 h-4 mx-auto text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      </div>
                      <span className="ml-3 text-neutral-600">
                        Up to 1,000 credits
                      </span>
                    </li>

                    <li className="flex">
                      <div className="inline-flex items-center w-6 h-6 bg-blue-600 rounded-xl">
                        <svg
                          className="flex-shrink-0 w-4 h-4 mx-auto text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      </div>
                      <span className="ml-3 text-neutral-600">Tacky wallet</span>
                    </li>

                    <li className="flex">
                      <div className="inline-flex items-center w-6 h-6 bg-blue-600 rounded-xl">
                        <svg
                          className="flex-shrink-0 w-4 h-4 mx-auto text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      </div>
                      <span className="ml-3 text-neutral-600">
                        Personal profile only
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
