import "../styles/Register.css"

const Register = () => {
  return (
    <div className="register-container">
      <h1>Register</h1>
      <form className="auth-form">
        <label htmlFor = "email">Email</label>
        <input type="email" id = "email" placeholder = "Enter your email" />

        <label htmlFor="password">Password</label>
        <input type = "password" id = "password" placeholder = "Enter your password" />
      
        <button type = "submit">Register</button>
      </form>
    </div>
  )
}

export default Register
