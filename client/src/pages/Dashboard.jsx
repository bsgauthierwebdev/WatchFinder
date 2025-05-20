import { useEffect, useState } from "react"
import {useNavigate} from "react-router-dom"
import {getToken} from "../utils/auth"

const Dashboard = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUser = async () => {
      const token = getToken()
      if (!token) {
        navigate("/login")
        return
      }
      
      try {
        const res = await fetch("http://localhost:8800/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (!res.ok) {
          throw new Error("Unauthorized")
        }

        const data = await res.json()
        setUser(data)

      } catch (err) {
        console.error(err.message)
        navigate("/login")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [navigate])

  if (loading) return <p>Loading dashboard...</p>
  if (!user) return <p>User not found</p>

  return (
    <div className="dashboard-container">
      <h1>Welcome, {user.username}!</h1>
      <p>Email: {user.email}</p>

      <hr />

      <div className="dashboard-preferences">
        <h2>Your Preferences</h2>
        <p>(Preferences UI will go here)</p>
      </div>

      <div className="dashboard-listings">
        <h2>Match Listings</h2>
        <p>(Listings UI will go here)</p>
      </div>

      <div className="dashboard-favorites">
        <h2>Favorites</h2>
        <p>(Favorites UI will go here)</p>
      </div>

      <div className="dashboard-matches">
        <h2>Matched Results</h2>
        <p>(Matched Results UI will go here)</p>
      </div>
    </div>
  )
}

export default Dashboard
