import React, { useEffect, useState } from 'react';
import Navbar from './Header'
import Footer from './Footer';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

export default function BlogDetail() {
  const navigate = useNavigate();

  const { id } = useParams();
  const [singleBlog, setsingleBlog] = useState(null);
  
  const getOneBlog = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/blog/user/view/${id}`, {
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
        setsingleBlog(data.data);
      } else {
        navigate('/Blog');
      }
    } catch (error) {
      navigate('/Blog');
    }
  };
  const DynamicVideoPlayer = ({ src }) => {
    return (
      <iframe
        src={src}
        title="Dynamic video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  };
  console.log(singleBlog)
  useEffect(() => {
    getOneBlog(); // Fetch data when the component mounts
  }, []);
  return (
    <>
      <Navbar />
      <div className=' mb-5 lg:h-[120vh] d-flex justify-content-center'>
        <div className='row blogdetail  h-100 lg:m-4   lg:p-3 sm:p-1' style={{ maxWidth: "1150px" }}>
          <div className=" mb-3 col-sm-12 col-lg-8">
            <p
              aria-label="Category"
              title={singleBlog?.title || 'Loading...'}
              className=" my-3 text-2xl font-bold "
            >
              {singleBlog?.title || 'Loading...'}
            </p>
            <img src={singleBlog?.image || "Loading"} className="card-img-top object-cover w-full h-100 my-3" alt="..." style={{ maxHeight: "40vh" }} />
            <div className="p-2  border-t-0">
              <p className="mb-3  text-xs font-semibold tracking-wide uppercase">
                <a
                  href="/"
                  className="transition-colors duration-200 text-blue-gray-900 hover:text-deep-purple-accent-700"
                  aria-label="Category"
                  title="traveling"
                >
                  {singleBlog?.category || 'Loading...'}
                </a>
              </p>

              <p className="mb-2 text-gray-700">
                {singleBlog?.content || 'Loading...'}
              </p>
            </div>
          </div>
          <div className='mt-3 col-sm-12 col-lg-4'>
            <div className='d-flex flex-col  justify-content-center items-center'>
              {/* <h2 className='my-4 font-medium' >Socail Links</h2>
              <a className='w-full bg-primary mx-2 rounded-2 my-1 py-3 font-medium text-center  text-white'>Facebook</a>
              <a className='w-full bg-danger  mx-2 rounded-2 my-1 py-3 font-medium text-center text-white'>Youtube</a>
              <a className='w-full bg-primary mx-2 rounded-2 my-1 py-3 font-medium text-center  text-white'>Twitter</a> */}
              {/* <DynamicVideoPlayer src={singleBlog?.videoURL || 'Loading...'} />
               */}
               <iframe
        src={singleBlog?.videoURL || "error"}
        title="Dynamic video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />

            </div>
          </div>
        </div>
      </div>
      <Footer />

    </>

  );
}
