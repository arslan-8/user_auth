import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import { clearErrors, updateUser } from "../../actions/userAction";

import { useAlert } from "react-alert";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Fragment, useRef, useState, useEffect } from "react";

const UpdateUser = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  let { id } = useParams();
  const navigate = useNavigate();

  const { error, loading, isUpdated } = useSelector((state) => state.profile);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = React.useState("user");

  const handleChange = (event) => {
    setRole(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!name || !email || !role) {
      alert.error("Please enter the both password & confirm password");
    } else {
      dispatch(updateUser());
    }
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      alert.success("User Updated Successfully");
      navigate("/admin");
    }
  }, [dispatch, error, alert, navigate, isUpdated]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        mt: 20,
      }}
    >
      <Typography variant="h5" gutterBottom component="div" mb={5}>
        Update User
      </Typography>
      <Box
        component="form"
        //onSubmit={props.funcSubmit}
        noValidate
        sx={{
          display: "flex",
          flexWrap: "wrap",
          "& > :not(style)": {
            m: 1,
            width: 400,
            height: 320,
          },
        }}
      >
        <Paper elevation={3} sx={{ padding: "40px" }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Name"
            id="updateName"
            name="updateName"
            //value={props.name}
            autoFocus
            //onChange={(e) => props.funcName(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email"
            id="updateEmail"
            name="updateEmail"
            //value={props.email}
            autoComplete="email"
            //onChange={(e) => props.funcEmail(e.target.value)}
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="role-select">Role</InputLabel>
            <Select
              labelId="role-select"
              id="demo-simple-select"
              required
              value={role}
              label="Role"
              onChange={handleChange}
            >
              <MenuItem value={"user"}>User</MenuItem>
              <MenuItem value={"admin"}>Admin</MenuItem>
            </Select>
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Update
          </Button>
        </Paper>
      </Box>
    </Box>
  );
};

export default UpdateUser;
