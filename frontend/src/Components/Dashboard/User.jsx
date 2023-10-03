import React , {useState,useEffect} from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom";

export default function User() {
  const [successAlert, setSuccessAlert] = useState(false);
  const [succesmsg,setSuccesmsg]=useState()
  const [errorAlert, setErrorAlert] = useState(false);
  
  const hideAlerts = async () => {
     setSuccessAlert(false);
     setErrorAlert(false);
  };
  const navigate = useNavigate();
  const [allUser,setallUser] = useState([]);
  const getAllUsers = async (event) => {
    try{
    const response = await fetch('http://localhost:5000/api/admin/getallUsers', {
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
      setallUser(data.users);
    } else if (response.status === 505) {
      window.alert("Admin Not Logged In")
      navigate('/admin');
    } else {
      window.alert("Unable To Fetch Users Please Try Again Later ...");
      console.log("Unable To Fetch Users Please Try Again Later ...");
    }
  }catch(error){
    window.alert("Catch Error")
  }
}
const deleteData = async (id) => {
  console.log(id, "==== deleteData ====");
  try{
    console.log("intry")
  const response = await fetch(`http://localhost:5000/api/admin/deleteUser/${id}`, {
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
    getAllUsers();
    setSuccesmsg("User Deleted")
    setSuccessAlert(true);
    setTimeout(hideAlerts, 2000);
  }else {
    setSuccesmsg("Unable to Delete User ")
    setErrorAlert(true);
    setTimeout(hideAlerts, 2000);
  }
}catch(error){
  window.alert("catch error")
}
};

console.log(allUser)
useEffect(() => {
  getAllUsers();
}, []);

  return (
    <div>
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
      <div className='head' style={{display: "flex", justifyContent: "space-between",  alignItems: "center"}}>
      <Link to='/admin/Dashboard' className="btn btn-lg btn-primary">Back to Dashboard</Link>
        <h1 className='title float-right'>Here Is the All Registerd Users on Website</h1>
      </div>
    <div className="row py-2">
    <div className="col-md-12">
    <table className="table table-bordered">
      <thead>
        <tr>
          <th scope="col" style={{ alignSelf: "center" }}>Name</th>
          <th scope="col" style={{ alignSelf: "center" }}>E-Mail</th>
          <th scope="col" style={{ alignSelf: "center" }}>Phone</th>
          <th scope="col" style={{ alignSelf: "center" }}>On Trial</th>
          <th scope="col" style={{ alignSelf: "center" }}>Is Paid</th>
          <th scope="col" style={{ alignSelf: "center" }}>Remaining Words</th>
          <th scope="col" style={{ alignSelf: "center" }}>Actions</th>
        </tr>
      </thead>
      <tbody >
    {allUser.map((element) => (
    <tr key="0">
         <td >
      {element.fullName}
    </td>
    <td >
      {element.email}
    </td>
   <td >
      {element.phone}
    </td>
    <td >
      {element.isTrial? 'Yes':'No'}
    </td>
    <td >
      {element.isPaid? 'Yes':'No'}
    </td>
    <td className='p-2'>
      <div >
        <span  style={{ verticalAlign: "middle", textAlign: "center" }}>{element.wordLimit}</span>
      </div>
    </td>
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
    </div>
  )
}
