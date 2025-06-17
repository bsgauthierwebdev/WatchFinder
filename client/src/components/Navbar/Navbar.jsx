import { useEffect } from "react";
import {Link, useNavigate} from "react-router-dom"
import { useAuth } from '../../context/AuthContext';
import "./navbar.css"

const Navbar = () => {
    const {userData, logout} = useAuth()
    const navigate = useNavigate()

    const user = userData?.user

    useEffect(() => {
        if (!userData) {
            navigate("/login")
        }
    }, [userData, navigate])
    
    const handleLogout = () => {
        logout()
    }

    return (
        <nav className="navbar-container">
            <div className="navbar-logo">
                <Link to = "/">WatchFinder</Link>
            </div>
            <div className="navbar-links">
                {user ? (
                    <>
                        <div className="navbar__user-info">
                            <img src = {`http://localhost:8800${user.profile_img}`} alt = {user.username} className="userinfo__img" />
                            <span className = "userinfo__greeting">Welcome, {user.username}</span>
                        </div>
                        <div className="navbar__nav-links">
                            <Link to = "/favorites">Favorites</Link>
                            <Link to = "/matched-listings">Matches</Link>
                            <Link to = "/preferences">Preferences</Link>
                            <button className = "navbar-logoutbtn" onClick = {handleLogout}>Logout</button>
                        </div>
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