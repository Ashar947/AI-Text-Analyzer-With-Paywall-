import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import { useNavigate } from "react-router-dom";
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import { Link } from 'react-router-dom';
// import { Detail } from '../Detail';
import { useEffect } from 'react';
import { useState } from 'react';

export const Content = () => {
  const [successAlert, setSuccessAlert] = useState(false);
  const [succesmsg,setSuccesmsg]=useState()
  const [errorAlert, setErrorAlert] = useState(false);
  
  const hideAlerts = async () => {
     setSuccessAlert(false);
     setErrorAlert(false);
  };


  const navigate = useNavigate();
  const [countBlogs, setcountBlogs] = useState(0);
  const [countUser,setcountUser]=useState(0);

  const dashBoard = async (event) => {
    try{
      console.log("intry")
    const response = await fetch('http://localhost:5000/api/admin/adminDashBoard', {
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
      setcountBlogs(data.BlogCount)
      setcountUser(data.UserCount)
      console.log("success")
    } else if (response.status === 505) {
      setSuccesmsg("Admin Not Login")
      setErrorAlert(true);
      setTimeout(hideAlerts, 3000);
         setTimeout(() => {
        navigate("/admin");
      }, 3000);
    } else {
      // window.alert(" .");
      setSuccesmsg("Please Try Again Later")
      setErrorAlert(true);
      setTimeout(hideAlerts, 2000);
      console.log("Please Try Again Later .");
    }
  }catch(error){
    window.alert("catch error")
  }
}


 
  useEffect(() => {
    dashBoard();
  }, []);
  return ( 
    <div className="bg-gray-100">
        {successAlert && (
          <div className="alert alert-success" role="alert">
         {succesmsg}
          </div>
        )}    {errorAlert && (
          <div className="alert alert-danger" role="alert">
{succesmsg}       </div>
        )}
      <div className="relative px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
        <div className="absolute inset-x-0 top-0 items-center justify-center hidden overflow-hidden md:flex md:inset-y-0">
          <svg
            viewBox="0 0 88 88"
            className="w-full max-w-screen-xl text-indigo-100"
          >
            <circle fill="currentColor" cx="44" cy="44" r="15.5" />
            <circle
              fillOpacity="0.2"
              fill="currentColor"
              cx="44"
              cy="44"
              r="44"
            />
            <circle
              fillOpacity="0.2"
              fill="currentColor"
              cx="44"
              cy="44"
              r="37.5"
            />
            <circle
              fillOpacity="0.3"
              fill="currentColor"
              cx="44"
              cy="44"
              r="29.5"
            />
            <circle
              fillOpacity="0.3"
              fill="currentColor"
              cx="44"
              cy="44"
              r="22.5"
            />
          </svg>
        </div>
        <div className="relative grid gap-5 sm:grid-cols-1 lg:grid-cols-2">
          <div className="flex flex-col justify-between overflow-hidden text-left transition-shadow duration-200 bg-white rounded shadow-xl group hover:shadow-2xl">
            <div className="p-5">
              <div className="flex items-center justify-center w-10 h-10 mb-4 rounded-full bg-indigo-50">
               <Inventory2Icon/>
              </div>
              <p className="mb-2 font-bold">Total No of Blogs </p>
              <p className=" mb-2 font-bold">
               {countBlogs}
              </p>
            </div>
            <div className="w-full h-1 ml-auto duration-300 origin-left transform scale-x-0 bg-deep-purple-accent-400 group-hover:scale-x-100" />
          </div>
          <div className="flex flex-col justify-between overflow-hidden text-left transition-shadow duration-200 bg-white rounded shadow-xl group hover:shadow-2xl">
            <div className="p-5">
              <div className="flex items-center justify-center w-10 h-10 mb-4 rounded-full bg-indigo-50">
             <PeopleAltIcon/>
              </div>
              <p className="mb-2 font-bold">
              Total no of Users 
              </p>
              <p className="mb-2 font-bold">{countUser}</p>
            </div>
            <div className="w-full h-1 ml-auto duration-300 origin-left transform scale-x-0 bg-deep-purple-accent-400 group-hover:scale-x-100" />
          </div>
        </div>
      </div>
    </div>
  );
};

const drawerWidth = 240;


function ResponsiveDrawer(props) {
  const navigate = useNavigate();
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(true);
  const logotAdmin = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/logout', {
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
        navigate('/admin');
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

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
      <ListItem>
          <Link className="nav-link" to="/admin/ViewAllBlog">
               <ProductionQuantityLimitsIcon/>  View All Blog
                </Link>
          </ListItem>
        <ListItem>
          <Link className="nav-link" to="/admin/Addblog">
               <ProductionQuantityLimitsIcon/>  Add New Blog
                </Link>
          </ListItem>
          <ListItem>
          <Link className="nav-link" to="/admin/ViewUser">
               <ManageAccountsIcon/>  User-Mangement
                </Link>
           </ListItem>
           <ListItem>
          <Link className="nav-link" to="/admin/Register">
               <ManageAccountsIcon/> Add New Admin
                </Link>
           </ListItem>
           <ListItem>
          <button onClick={logotAdmin} className="nav-link" to="/admin/Register">
               <ManageAccountsIcon/> Log out 
                </button>
           </ListItem>
      </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
        Admin Panel
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
<Content/>
      </Box>
    </Box>
  );
}

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default ResponsiveDrawer;