import { useState } from 'react';
import axios from 'axios';
import "./forgotPassword.css"

const ForgotPassword = () => {
    const [email, setEmail] = useState("")
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setMessage("")
        setError("")

        try {
            console.log("Requested email: ", email)
            const res = await axios.post("/api/users/forgot-password", {email})
            setMessage(res.data.message || "Check your email for reset instructions")
        } catch (err) {
            console.error("Forgot Password Error: ", err.message)
            setError(err.response?.data?.error || "Something went wrong")
        }
    }

    return (
        <div className="forgot-password-container">
            <form className="forgot-password-form" onSubmit = {handleSubmit}>
                <div className="forgot-password-title">
                    <h2>Forgot Your Password</h2>
                    <p>Enter your email to reset your password</p>
                </div>
                <div className="forgot-password-inputs">
                    <input 
                        type = "email"
                        placeholder = "Email"
                        value = {email}
                        onChange = {(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="forgot-password-btn">
                    <button className="forgot-password-submit" type = "submit">Reset Password</button>
                </div>
                <div className="forgot-password-alerts">
                    {message && <p className = "success-message">{message}</p>}
                    {error && <p className = "error-message">{error}</p>}
                </div>
            </form>
        </div>
    )
}

export default ForgotPassword