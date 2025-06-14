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
          <Route path = "/register" element = {<Register />} />
          <Route path = "/listings" element = {<Listings />} />
          <Route path = "/preferences" element = {<Preferences />} />
          <Route path = "/favorites" element = {<Favorites />} />
          <Route path = "/matches" element = {<MatchedResults />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
