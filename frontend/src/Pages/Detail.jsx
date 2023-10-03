import { PaperClipIcon } from '@heroicons/react/20/solid'
import Footer from '../Components/Footer'
import Header from '../Components/Header'
import { useEffect, useState } from 'react'

export default function Detail() {
    const [about, setAbout] = useState("")
    const [orderdetail, setOrderdetail] = useState([])

    const getRefToken = async (event) => {
        try {
            console.log("intry")
            const response = await fetch('http://localhost:5000/api/user/about', {
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
                setAbout(data.user)
                setOrderdetail(data.orderDetails)
                // setuserLogin(data.status);
                // setUsername(data.name);
                console.log("success")
            } else if (response.status === 505) {
                window.alert("User Not Logged In")
            } else {
                console.log("error")
            }
        } catch (error) {
            window.alert("catch error")
        }
    }
    useEffect(() => {
        getRefToken();
    }, []);
    return (

        <>
            <Header />
            <div className='container my-16  '>
                <div className="row justify-content-center">
                    <div className="col-md-8 border border-2 rounded  shadow p-2 ">
                        <div className="px-4 sm:px-0">
                            <h3 className="text-base font-semibold leading-7 text-gray-900">User  Information</h3>
                            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Personal details </p>
                        </div>
                        <div className="mt-6 border-t border-gray-100">
                            <div className="divide-y divide-gray-100">
                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                    <dt className="text-sm font-medium leading-6 text-gray-900">Full Name </dt>
                                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{about.fullName}</dd>
                                </div>
                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                    <dt className="text-sm font-medium leading-6 text-gray-900">Phone Number</dt>
                                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{about.phone}</dd>
                                </div>
                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                    <dt className="text-sm font-medium leading-6 text-gray-900">Email address</dt>
                                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{about.email}</dd>
                                </div>
                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                    <dt className="text-sm font-medium leading-6 text-gray-900">Remaining Words </dt>
                                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{about.wordLimit}</dd>
                                </div>
                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                    <dt className="text-sm font-medium leading-6 text-gray-900">Subscriptoin Start Date</dt>
                                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{about.subscriptionStartDate}</dd>
                                </div>
                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                    <dt className="text-sm font-medium leading-6 text-gray-900">Subscriptoin End  Date</dt>
                                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{about.subscriptionEndDate}</dd>
                                </div>
                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                    <dt className="text-sm font-medium leading-6 text-gray-900">Refered By </dt>
                                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{about.referedBy?  about.referedBy : "None "}</dd>
                                </div>
                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                    <dt className="text-sm font-medium leading-6 text-gray-900">Referal Token</dt>
                                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{ about.referalToken }</dd>
                                </div>
                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                    <dt className="text-sm font-medium leading-6 text-gray-900"> NO of Referal Token use </dt>
                                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{ about.referalTokenUse }</dd>
                                </div>
                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                    <dt className="text-sm font-medium leading-6 text-gray-900">Order Detail</dt>
                                    <dd>
                                        {orderdetail.map((e) => (
                                            <div className="  mt-1 font-medium  text-sm leading-6 text-gray-900 sm:col-span-2 sm:mt-0">
                                                Plan : Subscription for {e.plan} Words <br/>
                                                Discount Availed : {e.discountUse ? "Yes" : "No"} <br/>
                                                Amount Deducted : {e.price} <br/>
                                                Order Complete : {e.success ? "Yes" : "No"} <br/> 
                                                {/* Reference ID : {e.payment_response} <br/> */}
                                                <br></br>
                                            </div>
                                        ))}
                                    </dd>
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

