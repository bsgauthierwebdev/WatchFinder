import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import axios from "axios"
import "./verifyEmail.css"

const VerifyEmail = () => {
    const {token} = useParams()
    const navigate = useNavigate()

    const [message, setMessage] = useState("Verifying...")
    const [verified, setVerified] = useState(false)
    const [resendDisable, setResendDisable] = useState(false)
    const [countdown, setCountdown] = useState(0)
    const [email, setEmail] = useState("")

    useEffect(() => {
        const verify = async () => {
            try {
                const res = await axios.get(`/api/auth/verify-email/${token}`)
                setMessage(res.data.message)
                
                if (res.data.message === "Email verified successfully") {
                    setTimeout(() => navigate("/login"), 3000)
                }
                
            } catch (err) {
                setMessage(err.response?.data?.error || "Verification failed")
            }
        }
        verify()
    }, [token, navigate])

    useEffect(() => {
        if (verified) {
            const timer = setTimeout(() => navigate("/login"), 3000)
            return () => clearTimeout(timer)
        }
    }, [verified, navigate])

    const handleResend = async () => {
        try {
            await axios.post("/api/auth/resend-verification", {email})
            setMessage("Verification email resent")
            setResendDisable(true)
            setCountdown(60)
        } catch (err) {
            setMessage(err.response?.data?.error || "Resend failed")
        }
    }

    useEffect(() => {
        if (resendDisable && countdown > 0) {
            const interval = setInterval(() => {
                setCountdown(prev => prev - 1)
            }, 1000)

            return () => clearInterval(interval)
        } else if (countdown <= 0) {
            setResendDisable(false)
        }
    }, [resendDisable, countdown])

    return (
        <div className="verify-email-container">
            <h2 className="verify-message">{message}</h2>

            {!verified && (
                <div className="resend-section">
                    <input 
                        className="resend-input"
                        type = "email"
                        placeholder = "Enter your email"
                        value = {email}
                        onChange = {(e) => setEmail(e.target.value)}
                        required 
                    />
                    <button className="resend-btn" onClick = {handleResend} disabled = {resendDisable}>
                        {resendDisable ? `Resend in ${countdown} seconds` : "Resend Verification Email"}
                    </button>
                </div>
            )}
        </div>
    )
}

export default VerifyEmail
