import {Link} from "react-router-dom"
import { useAuth } from './../context/AuthContext';
import "../styles/navbar.css"

const Navbar = () => {
    const {user, logout} = useAuth()

    return (
        <nav className="navbar-container">
            <div className="navbar-logo">
                <Link to = "/dashboard">WatchFinder</Link>
            </div>
            <div className="navbar-links">
                {user ? (
                    <>
                        <span>Welcome, {user.username}</span>
                        <Link to = "/favorites">Favorites</Link>
                        <Link to = "/matched-listings">Matches</Link>
                        <Link to = "/preferences">Preferences</Link>
                        <button onClick = {logout}>Logout</button>
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