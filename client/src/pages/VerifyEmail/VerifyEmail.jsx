import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import axios from "axios"
import "./verifyEmail.css"

const VerifyEmail = () => {
    const {token} = useParams()
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    const [message, setMessage] = useState("Verifying...")
    const [verified, setVerified] = useState(false)
    const [resendDisable, setResendDisable] = useState(false)
    const [countdown, setCountdown] = useState(0)
    const [email, setEmail] = useState("")

    // Get email from search params
    useEffect(() => {
        const emailFromQuery = searchParams.get("email")
        if (emailFromQuery) {
            setEmail(emailFromQuery)
        }
    })


    // If token is present in URL, attempt to verify
    useEffect(() => {
        const verify = async () => {
            if (!token) return

            try {
                const res = await axios.get(`/api/auth/verify-email/${token}`)
                setMessage(res.data.message)
                setVerified(true)
                
            } catch (err) {
                setMessage(err.response?.data?.error || "Verification failed")
            }
        }

        verify()
    }, [token])

    // If redirected with email in query string, auto-resend
    useEffect(() => {
        const autoResend = async () => {
            if (!token && email) {
                try {
                    await axios.post("/api/resend-verification", {email})
                    setMessage("A new verification email has been sent")
                    setResendDisable(true)
                    setCountdown(50)
                } catch (err) {
                    setMessage(err.response?.data?.error || "Failed to resend verification email")
                }
            }
        }

        autoResend()
    }, [email, token])

    // Countdown for resend button
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

    // Redirect after successful verification
    useEffect(() => {
        if (verified) {
            const timer = setTimeout(() => navigate("/login"), 3000)
            return () => clearTimeout(timer)
        }
    }, [verified, navigate])

    // Manual resend
    const handleResend = async () => {
        if (!email) {
            setMessage("Please enter a valid email address")
            return
        }

        try {
            await axios.post("/api/auth/resend-verification", {email})
            setMessage("Verification email resent")
            setResendDisable(true)
            setCountdown(60)
        } catch (err) {
            setMessage(err.response?.data?.error || "Resend failed")
        }
    }

    return (
        <div className="verify-email-container">
            {/* <h2 className="verify-message">{message}</h2> */}

            {verified && <p>Redirecting to login...</p>}

            {!verified && (
                <div className="resend-section">
                    <h2 className="verify-message">An email has been sent to your email for verification</h2>
                    <p>If you have not received this message, please re-enter your email below and request a new link</p>
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
