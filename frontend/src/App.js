import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WebFont from "webfontloader";
import React from "react";
import SignIn from './component/SignIn'
import SignUp from './component/SignUp'
import ForgotPassword from "./component/ForgotPassword";
import ResetPassword from "./component/ResetPassword";
import Admin from "./component/Admin";
import User from "./component/User";
import UpdateUser from "./component/Admin/UpdateUser";
import store from "./store";
import { loadUser } from "./actions/userAction";


function App() {

  React.useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });
    store.dispatch(loadUser());
  }, []);

  return (
    <Router>

      <Routes>
        <Route path="/" exact element={<SignIn />} />
        <Route path="/register" exact element={<SignUp />} />
        <Route path="/password/forgot" exact element={<ForgotPassword />} />
        <Route path="/password/reset/:token" exact element={<ResetPassword />} />
        <Route path="/admin" exact element={<Admin />} />
        <Route path="/user" exact element={<User />} />
        <Route path="/admin/user/update/:id" exact element={<UpdateUser />} />
      </Routes>

    </Router>
  );
}

export default App;
