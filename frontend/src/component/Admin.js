import React, { Fragment, useState, useEffect } from "react";
import { logout } from "../actions/userAction";
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
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import { clearErrors, getUserDetails } from '../actions/userAction'

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

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

  const { error, loading, users } = useSelector((state) => state.userDetails);

  

  console.log('users:', users)

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors);
    }

    if (!loading) {
      dispatch(getUserDetails())
    }

    // if (isAuthenticated === false) {
    //   navigate("/");
    // }
  }, [dispatch, error, navigate, alert]);

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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
        <Container maxWidth="sm">
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ height: "80vh" }}
          >
            <Card 
            sx={{ minWidth: 600 }}>
              
                <Box
                  sx={{
                    flexGrow: 1,
                    bgcolor: "background.paper",
                    display: "flex",
                    height: 500,
                  }}
                >
                  <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={value}
                    onChange={handleChange}
                    aria-label="Vertical tabs example"
                    sx={{ borderRight: 1, borderColor: "divider" }}
                  >
                    <Tab label="All Users" {...a11yProps(0)} />
                    <Tab label="Add User" {...a11yProps(1)} />
                    <Tab label="Update User" {...a11yProps(2)} />
                    <Tab label="Delete User" {...a11yProps(3)} />
                    <Tab label="Get a user" {...a11yProps(4)} />
                  </Tabs>
                  <TabPanel value={value} index={0}>
                    Item One
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                    Item Two
                  </TabPanel>
                  <TabPanel value={value} index={2}>
                    Item Three
                  </TabPanel>
                  <TabPanel value={value} index={3}>
                    Item Four
                  </TabPanel>
                  <TabPanel value={value} index={4}>
                    Item Five
                  </TabPanel>
                </Box>
             
            </Card>
          </Box>
        </Container>
      </React.Fragment>
    </Fragment>
  );
};

export default Admin;
