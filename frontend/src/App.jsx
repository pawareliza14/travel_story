import { BrowserRouter as  Router, Routes, Route,Navigate} from 'react-router-dom'
import React from 'react'

import Login from './pages/Auth/login.jsx';
import SignUp from './pages/Auth/signup.jsx';
import Home from './pages/Home/Home.jsx';

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

export default App
