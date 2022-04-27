import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import PropTypes from "prop-types";
import {
  Link as RouterLink,
  MemoryRouter,
  useNavigate,
} from "react-router-dom";
import { StaticRouter } from "react-router-dom/server";
import { useDispatch, useSelector } from "react-redux";
import { Fragment, useRef, useState, useEffect } from "react";
import { clearErrors, resetPassword } from "../actions/userAction";
import { useAlert } from "react-alert";
import { useParams } from "react-router-dom";

const LinkBehavior = React.forwardRef((props, ref) => {
  const { href, ...other } = props;
  // Map href (MUI) -> to (react-router)
  return (
    <RouterLink data-testid="custom-link" ref={ref} to={href} {...other} />
  );
});

LinkBehavior.propTypes = {
  href: PropTypes.oneOfType([
    PropTypes.shape({
      hash: PropTypes.string,
      pathname: PropTypes.string,
      search: PropTypes.string,
    }),
    PropTypes.string,
  ]).isRequired,
};

function Router(props) {
  const { children } = props;
  if (typeof window === "undefined") {
    return <StaticRouter location="/">{children}</StaticRouter>;
  }

  return <MemoryRouter>{children}</MemoryRouter>;
}

Router.propTypes = {
  children: PropTypes.node,
};

const theme = createTheme({
  components: {
    MuiLink: {
      defaultProps: {
        component: LinkBehavior,
      },
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehavior,
      },
    },
  },
});

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="#">
        Zenkoders
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const ResetPassword = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  let { token } = useParams();
  const navigate = useNavigate();

  const { error, success, loading } = useSelector(
    (state) => state.forgotPassword
  );

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!password || !confirmPassword) {
      alert.error("Please enter the both password & confirm password");
    } else {
      if (password !== confirmPassword) {
        alert.error("Password and confirm password doesn't match");
      }
      else if (checkPassword(password)) {
        dispatch(resetPassword(token, password, confirmPassword));
      }
    }
  };

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

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      alert.success("Password Updated Successfully");
      navigate("/user");
    }
  }, [dispatch, error, alert, navigate, success]);

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Reset Password
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 5, width: "100%" }}
          >
            <Typography variant="subtitle1" gutterBottom component="div">
              Please enter the new password
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              id="password"
              label="Password"
              type="password"
              name="password"
              autoComplete="new-password"
              autoFocus
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              autoComplete="new-password"
              autoFocus
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Confirm
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/" variant="body2">
                  Sign in again?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
};

export default ResetPassword;
