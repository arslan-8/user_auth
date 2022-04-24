import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WebFont from "webfontloader";
import React from "react";
// import Header from "./component/layout/Header/Header";
// import Footer from "./component/layout/Footer/Footer";
import Login from './component/login'
import store from "./store";
import { loadUser } from "./actions/userAction";
import { useSelector } from "react-redux";

function App() {

  // const { isAuthenticated, user } = useSelector((state) => state.user);

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
      {/* <Header /> */}

      {/* {isAuthenticated && <UserOptions user={user} />} */}

      <Routes>
        <Route path="/" exact element={<Login />} />
      </Routes>

      {/* <Footer /> */}
    </Router>
  );
}

export default App;
