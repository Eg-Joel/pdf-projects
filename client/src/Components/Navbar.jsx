import React from 'react'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import axios from '../utils/axios'
import { useDispatch, useSelector } from 'react-redux';
import { deleteUserFailure, deleteUserSuccess, signOutUserStart } from '../redux/userSlice';


function Navbar() {
  const userDetails =useSelector((state)=>state.user)
  let user = userDetails?.currentUser?.rest
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await axios.get('/auth/logout');
     
      const data = res.data;
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(data.message));
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
    <AppBar position="static">
      <Toolbar>
      
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
         PDFs
        </Typography>
       
       {user && <Button onClick={handleLogout} color="inherit">Logout</Button>}
      
      </Toolbar>
    </AppBar>
  </Box>
  )
}

export default Navbar