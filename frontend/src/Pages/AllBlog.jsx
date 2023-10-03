import React, { useEffect, useState } from "react";
// import Blog from "../Components/Blog";
import { NavLink } from "react-router-dom";
import Navbar from "../Components/Header";
import Footer from "../Components/Footer";

export default function AllBlog() {
  const [blog, setBlog] = useState([]);

  const getAllBlogs = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/blog/user/view', {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await response.json();
      console.log(data)
      console.log(response.status);
      if (response.status === 200) {
        console.log("success")
        setBlog(data.blogs);
      } else {
        window.alert("Please Try Again Later .");
        console.log("Please Try Again Later .");
      }
    } catch (error) {
      window.alert("Unable To Fetch Blog Please Try Again Later ......");
    }
  }

  console.log(blog);


  useEffect(() => {
    getAllBlogs();
  }, []);
  const linkStyles = {
    textDecoration: "none",
  };
  return (
    <div>
      <Navbar />
      <div className="container px-2 py-12 mx-auto">
        <div className="centering-content-mobile">
          <h1 className="sm:text-center display-4  py-2 fw-bold text-dark">
            {" "}
            Our Latest Blog
          </h1>
          <h1 className="sm:text-center py-4 ">
            Our latest updates and blogs about managing your team
          </h1>
        </div>
        <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-3 sm:max-w-sm sm:mx-auto lg:max-w-full">
             {Array.isArray(blog) && blog.map((e) => (
              <NavLink to={`/BlogDetail/${e._id}`} style={linkStyles}>
                <div className="overflow-hidden transition-shadow duration-300 bg-white rounded shadow-sm">
                  <img
                    src={e.image}
                    className="object-cover w-full h-64"
                    alt=""
                  />
                  <div className="p-3  border border-t-0">
                    <p className="mb-3 text-xs font-semibold tracking-wide uppercase">
                      <a
                        href="/"
                        className="transition-colors duration-200 text-blue-gray-900 hover:text-deep-purple-accent-700 "
                        aria-label="Category"
                        title="traveling"
                      >
                        {e.category}
                      </a>
                      <span className="text-gray-600 mx-2">{e.createdOn}</span>
                    </p>
                    <a
                      href="/"
                      aria-label="Category"
                      title="Visit the East"
                      className="inline-block mb-3 text-2xl font-bold leading-5 transition-colors duration-200 hover:text-deep-purple-accent-700"
                    >
                      {e.title.slice(0, 40)}...
                    </a>
                    <p className="mb-2 text-gray-700">{e.content.slice(0, 300)}...</p>
                    <a
                      href="/"
                      aria-label=""
                      className="inline-flex items-center font-semibold transition-colors duration-200 text-deep-purple-accent-400 hover:text-deep-purple-800"
                    >
                      Learn more
                    </a>
                  </div>
                </div>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
