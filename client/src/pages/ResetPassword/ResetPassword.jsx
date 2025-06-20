import { useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import "./resetPassword.css"

const ResetPassword = () => {
    const {token} = useParams()
    const navigate = useNavigate()

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setMessage("")

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        try {
            console.log("Token: ", token)
            console.log("Password: ", password)
            console.log("Confirm Password: ", confirmPassword)
            const res = await axios.post(`/api/users/reset-password/${token}`, {password, confirmPassword})
            setMessage("Password reset successfully. Redirecting to login...")
            setTimeout(() => navigate("/login"), 3000)
        } catch (err) {
            console.error("Reset Password Error: ", err.message)
            setError (err.response?.data?.error || "Failed to reset password")
        }
    }

    return (
        <div className="reset-password-container">
            <form className="reset-password-form" onSubmit = {handleSubmit}>
                <div className="reset-password-title">
                    <h2>Reset Your Password</h2>
                </div>
                <div className="reset-password-inputs">
                    <input 
                        type = "password"
                        placeholder = "New Password"
                        value = {password}
                        onChange = {(e) => setPassword(e.target.value)}
                        required
                    />
                    <input 
                        type = "password"
                        placeholder = "Confirm Password"
                        value = {confirmPassword}
                        onChange = {(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="forgot-password-btn">
                    <button className="forgot-password-submit" type = "submit">Reset Password</button>
                </div>
                <div className="reset-password-alerts">
                    {message && <p className = "success-message">{message}</p>}
                    {error && <p className = "error-message">{error}</p>}
                </div>
            </form>
        </div>
    )
}

export default ResetPassword
