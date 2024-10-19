import { BrowserRouter as  Router, Routes, Route,Navigate} from 'react-router-dom'
import React from 'react'

import Login from './pages/Auth/login.jsx';
import SignUp from './pages/Auth/signup.jsx';
import Home from './pages/Home/home.jsx';

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/dashboard" exact element={<Home />}/>
          <Route path="/login" exact element={<Login />}/>
          <Route path="/signup" exact element={<SignUp />}/>

        </Routes>
      </Router>
    </div>
  )
}

//Define the Root component to handle the initial redirect
const Root = () => {
  //Checkif token exists in localStorage
  const isAuthenticated = !!localStorage.getItem("token");

  //Redirect to dashboard if authenticated, otherwise to login
  return isAuthenticated ? (
    <Navigate to = "/dashboard" />
  ): (
    <Navigate to="/login" />
  );
};

export default App
