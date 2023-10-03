import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";


export default function Addblog() {
  const navigate = useNavigate();
  const [successAlert, setSuccessAlert] = useState(false);
  const [succesmsg,setSuccesmsg]=useState()
  const [errorAlert, setErrorAlert] = useState(false);
  
  const hideAlerts = async () => {
     setSuccessAlert(false);
     setErrorAlert(false);
  };
  const [blog, setBlog] = useState({
    title: "",
    des: "",
    cat: "",
    img: "",
    youtubeUrl: "",
  });
  let value, name;
  const getUserdata = (e) => {
    name = e.target.name;
    value = e.target.value;
    setBlog({ ...blog, [name]: value });
    console.log(blog);
  };
  const sendData = async (e) => {
    e.preventDefault();
    const { title, des, cat, img, youtubeUrl } = blog;
    const formData = new FormData();
    formData.append("title", title);
    formData.append("des", des);
    formData.append("cat", cat);
    formData.append("img", img);
    formData.append("youtubeUrl", youtubeUrl);

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: formData,
    };
    if (title && des && cat) {
      const response = await fetch(
        "",
        options
      );
      console.log(response);
      if (response) {
        alert("Blog has been added ");

      }
    } else {
      alert("Blog not added ");
    }
  };
  const UploadBlog = async (event) => {
    try {
      event.preventDefault();
      const { title, des, cat, img, youtubeUrl } = blog;
      const response = await fetch('http://localhost:5000/api/blog/admin/uploadBlog', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ title:title, category:cat, content:des, videoURL:youtubeUrl, image:img })
      });
      const data = await response.json();
      console.log(data)
      console.log(response.status)
      if (response.status === 200) {
        setSuccesmsg(data.message)
        setSuccessAlert(true);
        setTimeout(hideAlerts, 2000);
         setTimeout(() => {
          navigate('/admin/ViewAllBlog');
      }, 3000);
      } else if (response.status === 404) {
        setSuccesmsg(data.message)
        setErrorAlert(true);
        setTimeout(hideAlerts, 2000);
      } else if (response.status===505){
        setSuccesmsg(data.message)
        setErrorAlert(true);
        setTimeout(hideAlerts, 2000);
        // window.alert("Please Login As Admim");
        setTimeout(() => {
          navigate('/admin');
      }, 3000);
      }
    } catch (error) {
      window.alert("catch error")
    }
  }
  return (
    <div>
      <div className="container px-2 py-12 mx-auto">
      {successAlert && (
          <div className="alert alert-success" role="alert">
         {succesmsg}
          </div>
        )}    {errorAlert && (
          <div className="alert alert-danger" role="alert">
{succesmsg}       </div>
        )}
        <div className='head' style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link to='/admin/Dashboard' className="btn btn-lg btn-primary">Back to Dashboarb</Link>
          <Link to="/admin/ViewAllBlog" className='btn btn-lg btn-primary'>View All Blog</Link>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h2 className="card-title text-center mb-4 ">Add New Blog</h2>
                <form onSubmit={sendData} method="POST">
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input className="form-control" id="title" onChange={getUserdata} name='title' value={blog.title} type="text" />
                  </div>
                  <div className="mb-3 ">
                    <label htmlFor="category" className="form-label">Category</label>
                    <input onChange={getUserdata} name='cat' value={blog.cat} type="text" className="form-control" id="cat" required />
                  </div>
                  <div className="mb-3 ">
                    <label htmlFor="youtubeUrl" className="form-label">Youtube Video Url</label>
                    <input onChange={getUserdata} name='youtubeUrl' value={blog.youtubeUrl} type="text" className="form-control" id="youtubeUrl" required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="floatingTextarea2" className="form-label">Description</label>
                    <textarea class="form-control" onChange={getUserdata} name='des' value={blog.des} placeholder="Leave a comment here" id="floatingTextarea2" style={{ height: "200px" }}></textarea>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="img" className="d-block form-label"> Blog Image Url</label>
                    <input onChange={getUserdata} name='img' id='img' className="form-control" type="text" required />
                  </div>
                  <button type="submit" className="w-full btn btn-primary" onClick={UploadBlog}>Add New Blog</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
