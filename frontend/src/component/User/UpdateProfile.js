import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const UpdateProfile = (props) => {
  
  return (
    <Box
      component="form"
      onSubmit={props.funcSubmit}
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
        value={props.name}
        // autoFocus
        onChange={(e) => props.funcName(e.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        label="Email"
        id="updateEmail"
        name="updateEmail"
        value={props.email}
        autoComplete="email"
        onChange={(e) => props.funcEmail(e.target.value)}
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
        onChange={(e) => props.funcPassword(e.target.value)}
      />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Update
      </Button>
    </Box>
  );
};

export default UpdateProfile;
