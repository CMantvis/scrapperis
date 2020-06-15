import React, { useState, useEffect } from 'react';
import './App.css';
import jwtDecode from "jwt-decode";
import Navbar from './components/navbar';
import { Switch, Route, Redirect } from "react-router-dom";
import Jobs from "./components/jobs";
import Login from "./components/login";
import Logout from './components/logout';
import Register from "./components/register";
import UserPosts from './components/userPosts';
import Profile from './components/profile';
import ProtectedRoute from './components/protectedRoute';


function App() {

  const [user, setUser] = useState();

  useEffect(() => {
    try {
      const jwt = localStorage.getItem("token");
      const user = jwtDecode(jwt);
      setUser(user);
    } catch (ex) { }
  }, []);

  return (
    <React.Fragment>
      <Navbar user={user} />
      <Switch>
        <Route path="/jobs" render={props => <Jobs {...props} user={user} />} />
        <Route path="/login" component={Login} />
        <Route path="/logout" component={Logout} />
        <Route path="/register" exact component={Register} />
        <ProtectedRoute path="/posts" component={UserPosts} />
        <ProtectedRoute path="/profile" component={Profile} />
        <Redirect from="/" exact to="/jobs" />
      </Switch>
    </React.Fragment>
  );
}

export default App;
