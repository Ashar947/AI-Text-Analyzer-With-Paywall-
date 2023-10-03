import "./App.css";
import Login from "./Components/Login";
import Register from "./Components/Register";
import RegisterGoogle from "./Components/RegisterGoogle";
import { Route, Routes, Outlet } from "react-router-dom";
import Home from "./Pages/Home";
import Pricing from "./Components/Pricing";
import Blog from "./Components/Blog";
import SuccessStripe from "./Components/SuccesStripe";
import ReferralPage from "./Components/Earn";
import ResponsiveDrawer from "./Components/Dashboard/Main";
import Addblog from "./Components/Dashboard/Addblog";
import BlogDetail from "./Components/BlogDetail";
import AllBlog from "./Pages/AllBlog";
import AllBlogAdmin from "./Components/Dashboard/AllBlogAdmin";
import User from "./Components/Dashboard/User";
import AdminLogin from './Components/Dashboard/AdminLogin'
import AdminRegister from "./Components/Dashboard/AdminRegister";
import ErrorPage from "./Components/ErrorPage";
import Detail from "./Pages/Detail";

function App() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/Register" element={<AdminRegister />} />
      <Route path="/admin/Dashboard" element={<ResponsiveDrawer />} />
      <Route path="/admin/Addblog" element={<Addblog />} />
      <Route path="/admin/ViewAllBlog" element={<AllBlogAdmin />} />
      <Route path="/admin/ViewUser" element={<User />} />
      <Route path="/" element={<Home />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Register" element={<Register />} />
      <Route path="/Register-Google" element={<RegisterGoogle />} />
      <Route path="/Pricing" element={<Pricing />} />
      <Route path="/Blog" element={<AllBlog />} />
      <Route path='/BlogDetail/:id' element={<BlogDetail/>}/>
      <Route path="/Earn" element={<ReferralPage />} />
      <Route path="/success" element={<SuccessStripe />} />
      <Route path="/cancel" element={<ErrorPage />} />
      <Route path="/Detail" element={<Detail />} />
    </Routes>
  );
}

export default App;
