import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import "./login.css"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const {login, resendVerification} = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    try {
      await login(email, password)
      navigate("/dashboard")

    } catch (err) {
      console.error("Login failed: ", err?.response || err)

      const reason = err?.response?.data?.reason
      if (reason === "unverified") {
        try {
          await resendVerification(email)

          navigate("/verify-email", {
            state: {
              email,
              message: "Your account isn't verified. We've send you a new verification email"
            }
          })
        } catch (err) {
          console.error("Failed to resend verification email: ", err)
          setError("Couldn't resend verification email. Please try again later")
        }
      } else {
        setError("Invalid credentials")
      }
    }
  }

  return (
    <div className="login-container">
      <form onSubmit = {handleSubmit} className="login-form">
        <div className="login-title">
          <h2 className = "login-title">Login</h2>
        </div>
        <div className="login-inputs">
          {/* <label htmlFor = "email" className = "login-label">Email</label> */}
          <input 
            className = "login-input"
            id = "email"
            type="email"
            value = {email}
            placeholder = "Email Address"
            onChange = {(e) => setEmail(e.target.value)}
            required 
          />
          {/* <label htmlFor = "password" className = "login-label">Password</label> */}
          <input 
            className = "login-input"
            id = "password"
            type="password"
            value = {password}
            placeholder = "Password"
            onChange = {(e) => setPassword(e.target.value)}
            required 
          />
        </div>
        <div className="login-errors">
          {error && <p className = "error">{error}</p>}
        </div>
        <div className="login-submit">
          <button type = "submit" className = "login-btn">Log In</button>
        </div>
        <div className="forgot-password-link">
          <Link to = "/forgot-password">Forgot password?</Link>
        </div>
      </form>
      <div className="login-redirect">
        <p>Don't have an account yet? <Link to = "/register" className = "login-redirect-link">Register your account</Link></p>
      </div>
    </div>
  )
}

export default Login
