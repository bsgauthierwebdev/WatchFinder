import {Link} from "react-router-dom"
import "../styles/Header.css"

const Header = () => {
  return (
    <header className="header-container">
        <div className="header-logo">WatchFinder</div>
        <nav className="header-nav">
            <Link to = "/">Home</Link>
            <Link to = "/login">Login</Link>
            <Link to = "/register">Register</Link>
        </nav>
    </header>
  )
}

export default Header