import React, { Fragment, useState, useEffect } from "react";
import { clearErrors, logout, loadUser } from "../actions/userAction";
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
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import GroupIcon from "@mui/icons-material/Group";
import Divider from "@mui/material/Divider";
import Loader from "./Loader/Loader";

import TextField from "@mui/material/TextField";

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

  const useMountEffect = (fun) => useEffect(fun, [])
  useMountEffect(() => {
    if (isAuthenticated) {
      dispatch(loadUser());
    }
  })

  console.log("user", user);

  const name = "name";
  const email = "email";
  const role = "role";

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
    }
  };

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
                      <List
                        sx={{
                          width: "100%",
                          maxWidth: 360,
                          bgcolor: "background.paper",
                        }}
                      >
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar>
                              <PersonIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText primary="Name" secondary={name} />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar>
                              <EmailIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText primary="Email" secondary={email} />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar>
                              <GroupIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText primary="Role" secondary={role} />
                        </ListItem>
                      </List>
                    </TabPanel>
                    <TabPanel value={value} index={1} dir={theme.direction}>
                      <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{ width: "100%" }}
                      >
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          label="Name"
                          id="updateName" 
                          name="updateName"
                          // autoFocus
                          onChange={(e) => setUpdateName(e.target.value)}
                        />
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          label="Email"
                          id="updateEmail"
                          name="updateEmail"
                          autoComplete="email"
                          onChange={(e) => setUpdateEmail(e.target.value)}
                        />
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          label="Password"
                          id="updatePassword"
                          type="password"
                          name="updatePasword"
                          autoComplete="new-password"
                          onChange={(e) => setUpdatePassword(e.target.value)}
                        />
                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          sx={{ mt: 3, mb: 2 }}
                        >
                          Update
                        </Button>
                      </Box>
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
