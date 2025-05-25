import { useEffect, useState } from "react"
import {useNavigate} from "react-router-dom"
import {getToken} from "../utils/auth"
import "../styles/dashboard.css"
import DashboardPreferencesCard from "../components/DashboardPreferencesCard"

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
        const res = await fetch("http://localhost:8800/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (!res.ok) {
          throw new Error("Unauthorized")
        }

        const data = await res.json()
        // console.log(data)
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
      <div className="dashboard-preferences">
        <DashboardPreferencesCard 
          case_size_min={user.case_size_min}
          case_size_max={user.case_size_max}
          price_min={user.price_min}
          price_max={user.price_max}
          movements={user.movements}
          strap_styles={user.strap_styles}
          watch_styles={user.watch_styles}
          dial_colors={user.dial_colors}
          condition={user.condition}
          platforms={user.platforms}
          brands={user.brands}
          seller_location={user.seller_location}
          frequency={user.frequency}
        />
      </div>
    </div>
  )
}

export default Dashboard
