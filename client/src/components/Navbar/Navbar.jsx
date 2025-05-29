import {Link, useNavigate} from "react-router-dom"
import { useAuth } from '../../context/AuthContext';
import "./navbar.css"

const Navbar = () => {
    const {user, logout} = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate("/login")
    }

    return (
        <nav className="navbar-container">
            <div className="navbar-logo">
                <Link to = "/">WatchFinder</Link>
            </div>
            <div className="navbar-links">
                {user ? (
                    <>
                        <span>Welcome, {user.username}</span>
                        <Link to = "/favorites">Favorites</Link>
                        <Link to = "/matched-listings">Matches</Link>
                        <Link to = "/preferences">Preferences</Link>
                        <button className = "navbar-logoutbtn" onClick = {handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to = "/login">Login</Link>
                        <Link to = "/register">Register</Link>
                    </>
                    
                )}
            </div>
        </nav>
    )
}

export default Navbar