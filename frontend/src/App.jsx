
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SignUp from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import ClientDashboard from './pages/ClientDashboard.jsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/client-dashboard" element={<ClientDashboard />} />
      </Routes>
    </Router>
  )
}

export default App
