import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import "./login.css"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const {login} = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    try {
      await login(email, password)
      navigate("/dashboard")

    } catch (err) {
      console.error("Login failed: ", err)
      setError("Invalid credentials")
    }
  }

  return (
    <div className="login-container">
      <h2 className = "login-title">Login</h2>
      <form onSubmit = {handleSubmit} className="login-form">
        <label htmlFor = "email" className = "login-label">Email</label>
        <input 
          className = "login-input"
          id = "email"
          type="email"
          value = {email}
          onChange = {(e) => setEmail(e.target.value)}
          required 
        />
        <label htmlFor = "password" className = "login-label">Password</label>
        <input 
          className = "login-input"
          id = "password"
          type="password"
          value = {password}
          onChange = {(e) => setPassword(e.target.value)}
          required 
        />

        {error && <p className = "login-error">{error}</p>}

        <button type = "submit" className = "login-btn">Log In</button>
      </form>
      <div className="login-redirect">
        <p>Don't have an account yet? <Link to = "/register" className = "login-redirect-link">Register your account</Link></p>
      </div>
    </div>
  )
}

export default Login