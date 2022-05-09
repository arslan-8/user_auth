import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { FormControlLabel, IconButton } from "@mui/material";
import { blue, red } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import {
  clearErrors,
  updateUser,
  deleteUser,
  getUserDetails,
  loadUserAdmin,
} from "../../actions/userAction";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";

const MatEdit = ({ index }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleEditClick = () => {
    dispatch(loadUserAdmin(index));

    navigate(`user/update/${index}`);
  };

  return (
    <FormControlLabel
      control={
        <IconButton
          color="secondary"
          aria-label="add an alarm"
          onClick={handleEditClick}
        >
          <EditIcon style={{ color: blue[500] }} />
        </IconButton>
      }
    />
  );
};

const MatDelete = ({ index }) => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { error, loading } = useSelector((state) => state.profile);

  console.log("loading:", loading);

  const handleEditClick = () => {
    console.log("delete index:", index);
    dispatch(deleteUser(index));
    if (!loading) {
      alert.success("User deleted successfully");
      // dispatch(getUserDetails());
    }
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors);
    }
  }, [dispatch, error, alert, loading]);

  return (
    <FormControlLabel
      control={
        <IconButton
          color="secondary"
          aria-label="add an alarm"
          onClick={handleEditClick}
        >
          <DeleteIcon style={{ color: red[500] }} />
        </IconButton>
      }
    />
  );
};

const UserList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, loading, users } = useSelector((state) => state.userDetails);

  console.log("users:", users);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors);
    }

    dispatch(getUserDetails());

    // if (isAuthenticated === false) {
    //   navigate("/");
    // }
  }, [dispatch, error, navigate, alert]);

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "name",
      headerName: "Name",
      width: 150,
      editable: false,
    },
    {
      field: "email",
      headerName: "Email",
      width: 150,
      editable: false,
    },
    {
      field: "role",
      headerName: "Role",
      width: 150,
      editable: false,
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      width: 150,
      disableClickEventBubbling: true,
      renderCell: (params) => {
        return (
          <div style={{ display: "flex" }}>
            <div
              className="d-flex justify-content-between"
              style={{ cursor: "pointer" }}
            >
              <MatEdit index={params.row.id} />
            </div>
            <div
              className="d-flex justify-content-between"
              style={{ cursor: "pointer" }}
            >
              <MatDelete index={params.row.id} />
            </div>
          </div>
        );
      },
    },
  ];

  console.log("users from list:", users);

  let rows = [];

  if (users) {
    rows = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }));
  }

  console.log("rows:", rows);

  return (
    <div style={{ height: 500, width: "60%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        checkboxSelection
        disableSelectionOnClick
      />
    </div>
  );
};

export default UserList;
