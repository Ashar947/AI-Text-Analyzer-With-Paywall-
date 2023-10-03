import { Fragment, useState, useEffect } from 'react'
import { Dialog, Disclosure, Popover, Transition } from '@headlessui/react'
import {
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom";



export default function Example() {
  const navigate = useNavigate();
  const [userLogin, setuserLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  const logotUser = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/user/logout', {
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
        getRefToken();
        navigate('/');
        console.log(data.message);
      } else if (response.status === 404) {
        console.log(data.message);
      } else {
        // window.alert("Please Try Again Later .");
        console.log("Please Try Again Later .");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getRefToken = async (event) => {
    try {
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
        setuserLogin(data.status);
        setUsername(data.name);
        console.log("success")
      } else {
        setuserLogin(data.status);
        // window.alert("Please Try Again Later .");
        console.log("Please Try Again Later .");
      }
    } catch (error) {
      window.alert("catch error")
    }
  }
  useEffect(() => {
    getRefToken();
  }, []);
  return (
    <header className="bg-white shadow mb-8">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5 flex" >
            <img className="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="" />
            <span className="sr-only">Your Company</span>

          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <Popover.Group className="hidden lg:flex lg:gap-x-12">
          <Link to="/Pricing" className="text-sm font-semibold leading-6 text-gray-900" >
            PRICING
          </Link>
          {/* <Link to="/Dashboard" className="text-sm font-semibold leading-6 text-gray-900" >
            API
          </Link> */}
          <Link to="/Blog" className="text-sm font-semibold leading-6 text-gray-900" >
            BLOG
          </Link>
          <Link to="/Earn" className="text-sm font-semibold leading-6 text-gray-900" >
            EARN
          </Link>

        </Popover.Group>
        {(() => {
          if (userLogin) {
            return (<div className="hidden lg:flex lg:flex-1 lg:justify-end">
              <div class="dropdown">
                <a class="btn text-sm rounded-full font-semibold leading-6 text-gray-900  mx-4 dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
             Welcome {username}
                </a>

                <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                  <Link to="/Detail"><a class="dropdown-item" href="#">About</a></Link>       
                </ul>
              </div>
              <Link className=""  >
              
              </Link>
              <button onClick={logotUser} className="text-sm font-semibold leading-6 text-gray-900" >
                Logout
              </button>
            </div>)
          } else {
            return (<div className="hidden lg:flex lg:flex-1 lg:justify-end">
              <Link to="/Login" className="text-sm font-semibold leading-6 text-gray-900  mx-4" >
                Log in
              </Link>
              <Link to="/Register" className="text-sm font-semibold leading-6 text-gray-900" >
                Register
              </Link>
            </div>)
          }
        })()}

      </nav>
      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link to="" className="-m-1.5 p-1.5" >
              <span className="sr-only ">Your djeisjdc</span>
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                alt=""
              />
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">

                <Link
                  to="Pricing"
                  onClick={closeMobileMenu}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  PRICING
                </Link>
                <Link
                  to="/Earn"
                  onClick={closeMobileMenu}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  EARN
                </Link>

                <Link
                  to="/Blog"
                  onClick={closeMobileMenu}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  BLOG
                </Link>
              </div>
              <div className="py-6">
                <Link
                  to="/Login"
                  onClick={closeMobileMenu}
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Log in
                </Link>
                <Link
                  to="/Register"
                  onClick={closeMobileMenu}
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Register
                </Link>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  )
}
