import React, { Fragment, useState, useEffect } from "react";
import { logout } from "../../actions/userAction";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import { clearErrors, getUserDetails } from "../../actions/userAction";
import UserList from "./UserList";

const Admin = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const alert = useAlert();

  function logoutUser() {
    dispatch(logout());
    alert.success("Logout Successfully");
    navigate("/");
  }

  // Get all users tab

  // const { error, loading, users } = useSelector((state) => state.userDetails);

  // console.log("users:", users);

  // useEffect(() => {
  //   if (error) {
  //     alert.error(error);
  //     dispatch(clearErrors);
  //   }

  //   dispatch(getUserDetails());

  //   // if (isAuthenticated === false) {
  //   //   navigate("/");
  //   // }
  // }, [dispatch, error, navigate, alert]);

  return (
    <Fragment>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Admin
            </Typography>
            <Button color="inherit" onClick={logoutUser}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>
      </Box>

      <React.Fragment>
        <CssBaseline />
        <Container maxWidth="false">
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            sx={{ height: "80vh" }}
          >
            <Typography variant="h5" gutterBottom component="div" mb={5}>
              USERS LIST
            </Typography>
            <UserList />

          </Box>
        </Container>
      </React.Fragment>
    </Fragment>
  );
};

export default Admin;
