import React from 'react'
import { Link } from 'react-router-dom'
import "../styles/Navbar.css"

const Navbar = () => {
  return (
    <nav className="navbar-container">
      <div className="navbar-logo">Watch Finder</div>
      <ul className="navbar-links">
        <li><Link to = "/dashboard">Dashboard</Link></li>
        <li><Link to = "/listings">Listings</Link></li>
        <li><Link to = "/favorites">Favorites</Link></li>
        <li><Link to = "/preferences">Preferences</Link></li>
        <li><Link to = "/matched-results">Matched Results</Link></li>
        <li><Link to = "/login">Login</Link></li>
        <li><Link to = "/register">Register</Link></li>
      </ul>
    </nav>
  )
}

export default Navbar
