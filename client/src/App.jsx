import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Listings from "./pages/Listings"
import Preferences from "./pages/Preferences"
import Favorites from "./pages/Favorites"
import MatchedResults from "./pages/MatchedResults"
import Navbar from "./components/Navbar"
import ProtectedRoute from "./components/ProtectedRoute"

const App = () => {
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route 
            path = "/" 
            element = {
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path = "/login" element = {<Login />} />
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
