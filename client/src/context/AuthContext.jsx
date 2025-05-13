import {createContext, useContext, useState, useEffect} from "react"

const AuthContext = createContext()

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(localStorage.getItem("token"))

    useEffect(() => {
        if (token) {
            // Fetch user info from backend using token
            setUser({email: "placeholder@test.com"})
        } else {
            setUser(null)
        }
    }, [token])

    const login = (jwt) => {
        localStorage.setItem("token", jwt)
        setToken(jwt)
    }

    const logout = () => {
        localStorage.removeItem("token")
        setToken(null)
    }

    return (
        <AuthContext.Provider value = {{user, token, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)