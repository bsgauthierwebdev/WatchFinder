import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Login from "./pages/Login/Login"
import Register from "./pages/Register/Register"
import Dashboard from "./pages/Dashboard/Dashboard"
import Landing from "./pages/Landing"
import Listings from "./pages/Listings"
import Preferences from "./pages/Preferences"
import Favorites from "./pages/Favorites"
import MatchedResults from "./pages/MatchedResults"
import Navbar from "./components/Navbar/Navbar"
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute"
import backgroundImg from "./assets/background.png"
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword"
import ResetPassword from "./pages/ResetPassword/ResetPassword"
import Profile from "./pages/Profile/Profile"
import VerifyEmail from "./pages/VerifyEmail/VerifyEmail"
import Verified from "./pages/Verified/Verified"
import "./App.css"

const App = () => {
  return (
    <div className = "main-content">
      <img 
        src = {backgroundImg}
        alt = "logo"
        className = "background-img" 
      />
      <Router>
        <Navbar />
        <Routes>
          <Route path = "/" element = {<Landing />} />
          <Route path = "/login" element = {<Login />} />
          <Route 
            path = "/dashboard" 
            element = {
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route 
            path = "/profile"
            element = {
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path = "/register" element = {<Register />} />
          <Route path = "/verify-email/" element = {<VerifyEmail />} />
          <Route path = "/verify-email/:token" element = {<VerifyEmail />} />
          <Route path = "/verified" element = {<Verified />} />
          <Route path = "/listings" element = {<Listings />} />
          <Route path = "/preferences" element = {<Preferences />} />
          <Route path = "/favorites" element = {<Favorites />} />
          <Route path = "/matches" element = {<MatchedResults />} />
          <Route path = "/forgot-password" element = {<ForgotPassword />} />
          <Route path = "/reset-password/:token" element = {<ResetPassword />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
