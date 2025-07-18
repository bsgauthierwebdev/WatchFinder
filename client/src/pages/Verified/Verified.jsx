import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { useEffect } from "react"
import "./verified.css"

const Verified = () => {
    const navigate = useNavigate()
    const {userData} = useAuth()
    
    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/login")
        }, 5000)

        return () => clearTimeout(timer)
    }, [navigate])

    return (
        <div className="verified-container">
            <h2 className="verified-header">
                Welcome{userData?.username ? `, ${userData.username}` : ""}!
            </h2>
            <p className="verified-confirmation">Your email has been verified successfully</p>
            <p className="verified-auto-redirect">You will be redirected to the login page shortly</p>
            <p className="verified-manual-redirect">If you are not automatically redirected, please click <Link to = "/login">here</Link> to go to the login page</p>
        </div>
    )
}

export default Verified
