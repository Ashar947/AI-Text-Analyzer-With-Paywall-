import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

export default function AllBlogAdmin() {
  const navigate = useNavigate();
  const [allBlogs, setallBlogs] = useState([]);
  const [successAlert, setSuccessAlert] = useState(false);
  const [succesmsg,setSuccesmsg]=useState()
  const [errorAlert, setErrorAlert] = useState(false);
  
  const hideAlerts = async () => {
     setSuccessAlert(false);
     setErrorAlert(false);
  };

  const getAllBlogs = async (event) => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/getAllBlogs', {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await response.json();
      console.log(response.status)
      if (response.status === 200) {
        setallBlogs(data.blogs);
        console.log(allBlogs, "here is your bblog")
      } else if (response.status === 505) {
        setSuccesmsg("Admin Not Login")
        setErrorAlert(true);
        setTimeout(hideAlerts, 2000);
           setTimeout(() => {
          navigate("/admin");
        }, 4000);
      } else {
        setSuccesmsg("Please Try Again Later")
      setErrorAlert(true);
      setTimeout(hideAlerts, 2000);
        console.log("Unable To Fetch Users Please Try Again Later ...");
      }
    } catch (error) {
      window.alert("Catch Error")
    }
  }
  const deleteData = async (id) => {
    console.log(id, "==== deleteData ====");
    try{
    const response = await fetch(`http://localhost:5000/api/blog/admin/deleteBlog/${id}`, {
      method: "DELETE",
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
      getAllBlogs();
      setSuccesmsg("Blog Deleted")
      setSuccessAlert(true);
      setTimeout(hideAlerts, 2000);
      console.log("success")
    }else {
      setSuccesmsg("Please Try Again Later")
      setErrorAlert(true);
      setTimeout(hideAlerts, 2000);
    }
  }catch(error){
    setSuccesmsg("Please Try Again Later . C")
      setErrorAlert(true);
      setTimeout(hideAlerts, 2000);
  }
  };
  // console.log(allBlogs)
  useEffect(() => {
    getAllBlogs();
  }, []);
  return (
    <div>
        {successAlert && (
          <div className="alert alert-success" role="alert">
         {succesmsg}
          </div>
        )}    {errorAlert && (
          <div className="alert alert-danger" role="alert">
{succesmsg}       </div>
        )}
      <div className='container py-5'>
        <div className='head' style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link to='/admin/Dashboard' className="btn btn-primary">Back to Dashboard</Link>
          <h1 className='title'>Here Is the Listed Blogs on Website</h1>
          <Link to="/admin/Addblog" className='btn btn-primary'>Add New Blog</Link>
        </div>
        <div className="row py-2">
          <div className="col-md-12">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th scope="col" style={{ alignSelf: "center" }}>IMG</th>
                  <th scope="col" style={{ alignSelf: "center" }}>Title</th>
                  <th scope="col" style={{ alignSelf: "center" }}>Catogory</th>
                  <th scope="col" style={{ alignSelf: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody >
              {Array.isArray(allBlogs) && allBlogs.map((element) => (
  <tr key={element._id}>
    <td>
      <img
        src={element.image}
        style={{ maxHeight: "120px" }}
        alt="Product"
      />
    </td>
    <td>{element.title.slice(0, 40)}</td>
    <td>{element.category}</td>
    <td style={{ verticalAlign: "middle", textAlign: "center" }}>
    <button className='btn btn-danger' onClick={() => deleteData(element._id)}>Remove</button>
    </td>
  </tr>
))}

              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
