import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios"
import "./verifyEmail.css"

const VerifyEmail = () => {
    const {token} = useParams()
    const navigate = useNavigate()
    const [message, setMessage] = useState("Verifying...")

    useEffect(() => {
        const verify = async () => {
            try {
                const res = await axios.get(`/api/auth/verify-email/${token}`)
                setMessage(res.data.message)
                setTimeout(() => navigate("/login"), 3000)
            } catch (err) {
                setMessage(err.response?.data?.error || "Verification failed")
            }
        }
        verify()
    }, [token, navigate])

    return (
        <div className="verify-email-container">
            <h2 className = "verify-message">{message}</h2>
        </div>
    )
}

export default VerifyEmail
