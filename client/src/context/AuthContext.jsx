import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"
import { getToken, setToken, removeToken } from "../utils/auth"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null)
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

  const login = async (email, password) => {
    const res = await axios.post("/api/auth/login", { email, password })
    const token = res.data.token
    setToken(token)
    await fetchUser()
  }

  const logout = () => {
    removeToken()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ userData, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
