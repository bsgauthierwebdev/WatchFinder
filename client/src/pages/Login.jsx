import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

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
      <h2>Login</h2>
      <form onSubmit = {handleSubmit} className="login-form">
        <label>Email</label>
        <input 
          type="email"
          value = {email}
          onChange = {(e) => setEmail(e.target.value)}
          required 
        />
        <input 
          type="password"
          value = {password}
          onChange = {(e) => setPassword(e.target.value)}
          required 
        />
        {error && <p className = "error">{error}</p>}
        <button type = "submit">Log In</button>
      </form>
    </div>
  )
}

export default Login