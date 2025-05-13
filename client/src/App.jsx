import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import Navbar from "./components/Navbar"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Listings from "./pages/Listings"
import Favorites from "./pages/Favorites"
import Preferences from "./pages/Preferences"
import MatchedResults from "./pages/MatchedResults"
import ProtectedRoute from "./components/ProtectedRoute"
import Layout from "./components/Layout"
import "./App.css"

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path = "/login" element = {<Login />}/>
            <Route path = "/register" element = {<Register />}/>
            <Route 
              path = "/dashboard"
              element = {
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route 
              path = "/listings"
              element = {
                <ProtectedRoute>
                  <Listings />
                </ProtectedRoute>
              }
            />
            <Route 
              path = "/favorites"
              element = {
                <ProtectedRoute>
                  <Favorites />
                </ProtectedRoute>
              }
            />
            <Route 
              path = "/preferences"
              element = {
                <ProtectedRoute>
                  <Preferences />
                </ProtectedRoute>
              }
            />
            <Route 
              path = "/matched-results"
              element = {
                <ProtectedRoute>
                  <MatchedResults />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  )
}

export default App
