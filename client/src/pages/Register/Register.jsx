import { useState } from "react"
import {useNavigate, Link} from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import "./register.css"

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const {register} = useAuth()

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    try {
      console.log("Form data being submitted: ", form)
      await register(form)
      navigate("/verify-email")
    } catch (err) {
      console.error("Registration error: ", err)
      setError(err.response?.data?.error || "Registration failed")
    }
  }

  return (
    <div className="register-container">
      <form className="register-form" onSubmit = {handleSubmit}>
        <div className="register-title">
          <h2 className="title-text">Create Your Account</h2>
        </div>
        <div className="register-inputs">
          <input 
            type = "text"
            name = "username"
            placeholder = "Username"
            onChange = {handleChange}
            required
          />
          <input 
            type = "email"
            name = "email"
            placeholder = "Email"
            onChange = {handleChange}
            required
          />
          <input 
            type = "password"
            name = "password"
            placeholder = "Password"
            onChange = {handleChange}
            required
          />
          <input 
            type = "password"
            name = "confirmPassword"
            placeholder = "Confirm Password"
            onChange = {handleChange}
            required
          />
        </div>
        <div className="register-errors">
          {error && <p className = "error">{error}</p>}
        </div>
        <div className="register-submit">
          <button className="register-btn">Register</button>
        </div>
      </form>
      <div className="register-redirect">
        <p>Already have an account? <Link to = "/login" className = "register-redirect-link">Log in</Link></p>
      </div>
    </div>
  )
}

export default Register
