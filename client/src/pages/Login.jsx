import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import axiosInstance from "../api/axiosInstance"
import "../styles/Login.css"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const {login} = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    
    try {
      const res = await axiosInstance.post("/auth/login", {email, password})
      // login(res.data.token)
      console.log(res.data)
      alert("Login successful")
      // navigate("/dashboard")
    } catch (err) {
      console.error(err.message)
      setError(err.response?.data?.message || "Login failed")
    }
  }

  return (
    <div className = "login-container">
      <h2 className="login-title">Login</h2>
      {error && <div className = "login-error">{error}</div>}
      <form className="login-form" onSubmit = {handleSubmit}>
        <input 
          type = "email"
          placeholder = "Email"
          className = "login-input"
          value = {email}
          onChange = {(e) => setEmail(e.target.value)}
        />
        <input 
          type = "password"
          placeholder = "Password"
          className = "login-input"
          value = {password}
          onChange = {(e) => setPassword(e.target.value)}
        />
        <button type = "submit" className="login-button">
          Login
        </button>
      </form>
    </div>
  )
}

export default Login
