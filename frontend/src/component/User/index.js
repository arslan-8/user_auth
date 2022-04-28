import React, { Fragment, useState, useEffect } from "react";
import { clearErrors, logout, loadUser } from "../../actions/userAction";
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
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Zoom from "@mui/material/Zoom";
import Fab from "@mui/material/Fab";
import EditIcon from "@mui/icons-material/Edit";
import Loader from "../Loader/Loader";
import MyProfile from "./MyProfile";
import UpdateProfile from "./UpdateProfile";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`action-tabpanel-${index}`}
      aria-labelledby={`action-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `action-tab-${index}`,
    "aria-controls": `action-tabpanel-${index}`,
  };
}

const fabStyle = {
  position: "absolute",
  bottom: 16,
  right: 16,
};

const User = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const alert = useAlert();

  function logoutUser() {
    dispatch(logout());
    alert.success("Logout Successfully");
    navigate("/");
  }

  // My Profile Tab

  const { error, loading, isAuthenticated, user } = useSelector(
    (state) => state.user
  );
  const [name, setName] = useState("");
  const [email, setEmial] = useState("");
  const [role, setRole] = useState("");

  const useMountEffect = (fun) => useEffect(fun, []);
  useMountEffect(() => {
    if (isAuthenticated) {
      dispatch(loadUser());
    }
    if (user) {
      setName(user.name);
      setEmial(user.email);
      setRole(user.role);
    }
  });

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors);
    }

    // if (isAuthenticated === false) {
    //   navigate("/");
    // }
  }, [dispatch, error, alert, navigate]);

  // Update Profile Tab

  const [updateName, setUpdateName] = useState("");
  const [updateEmail, setUpdateEmail] = useState("");
  const [updatePassword, setUpdatePassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!updateName || !updateEmail || !updatePassword) {
      alert.error("Please provide all the fields");
    } else {
      validateEmail(updateEmail);
      checkPassword(updatePassword);
    }
  };

  function validateEmail(email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return true;
    }
    alert.info("You have entered an invalid email address!");
    return false;
  }

  function checkPassword(password) {
    let passw = /^[A-Za-z]\w{7,14}$/;
    if (password.match(passw)) {
      return true;
    } else {
      alert.info(
        "Password length (6-20) & it must contain one numeric digit, one uppercase and one lowercase letter"
      );
      return false;
    }
  }

  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  const fabs = [
    {
      color: "primary",
      sx: fabStyle,
      icon: <EditIcon />,
      label: "Add",
    },
  ];

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
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
                  User
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
                sx={{ height: "60vh" }}
              >
                {/* <Typography variant="h4" gutterBottom component="div">
                  USER DETAILS
                </Typography> */}

                <Box
                  sx={{
                    mt: 20,
                    bgcolor: "background.paper",
                    width: 500,
                    position: "relative",
                    minHeight: 200,
                    border: 1,
                    borderColor: "lightgrey",
                    borderBottomLeftRadius: 15,
                    borderBottomRightRadius: 15,
                  }}
                >
                  <AppBar position="static" color="default">
                    <Tabs
                      value={value}
                      onChange={handleChange}
                      indicatorColor="primary"
                      textColor="primary"
                      variant="fullWidth"
                      aria-label="action tabs example"
                    >
                      <Tab label="My Profile" {...a11yProps(0)} />
                      <Tab label="Update Profile" {...a11yProps(1)} />
                    </Tabs>
                  </AppBar>
                  <SwipeableViews
                    axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                    index={value}
                    onChangeIndex={handleChangeIndex}
                  >
                    <TabPanel value={value} index={0} dir={theme.direction}>
                      <MyProfile name={name} email={email} role={role} />
                    </TabPanel>
                    <TabPanel value={value} index={1} dir={theme.direction}>
                      <UpdateProfile
                        name={updateName}
                        email={updateEmail}
                        funcSubmit={handleSubmit}
                        funcName={setUpdateName}
                        funcEmail={setUpdateEmail}
                        funcPassword={setUpdatePassword}
                      />
                    </TabPanel>
                  </SwipeableViews>
                  {fabs.map((fab, index) => (
                    <Zoom
                      key={fab.color}
                      in={value === index}
                      timeout={transitionDuration}
                      style={{
                        transitionDelay: `${
                          value === index ? transitionDuration.exit : 0
                        }ms`,
                      }}
                      unmountOnExit
                    >
                      <Fab
                        sx={fab.sx}
                        aria-label={fab.label}
                        color={fab.color}
                        onClick={() => handleChangeIndex(1)}
                      >
                        {fab.icon}
                      </Fab>
                    </Zoom>
                  ))}
                </Box>
              </Box>
            </Container>
          </React.Fragment>
        </Fragment>
      )}
    </Fragment>
  );
};

export default User;
