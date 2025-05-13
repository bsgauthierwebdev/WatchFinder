import "../styles/Footer.css"

const Footer = () => {
    return (
        <footer className="footer-container">
            &copy; {new Date().getFullYear()} WatchFinder. All rights reserved
        </footer>
    )
}

export default Footer