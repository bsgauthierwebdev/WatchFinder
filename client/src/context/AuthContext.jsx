import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"
import { getToken, setToken, removeToken } from "../utils/auth"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(() => {
    const stored = localStorage.getItem("userData")
    return stored ? JSON.parse(stored) : null
  })
  const [loading, setLoading] = useState(true)

  const fetchUser = async () => {
    const token = getToken()
    if (!token) {
      setLoading(false)
      return
    }

    try {
      const res = await axios.get("/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setUserData(res.data)
    } catch (err) {
      console.error("Error fetching user:", err.message)
      removeToken()
      setUserData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  const register = async (userData) => {
    const res = await axios.post("/api/auth/register", userData)
    const {token} = res.data

    setToken(token)
    await fetchUser()
  }

  const login = async (email, password) => {
    const res = await axios.post("/api/auth/login", { email, password })
    const token = res.data.token
    setToken(token)
    await fetchUser()
    return userData
  }

  const logout = () => {
    removeToken()
    setUserData(null)
  }

  const refreshUserData = async () => {
    try {
      const res = await axios.get("/api/users/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      setUserData(res.data)
    } catch (err) {
      console.error("Failed to refresh user data: ", err.message)
    }
  }

  return (
    <AuthContext.Provider value={{ userData, register, login, logout, refreshUserData, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
