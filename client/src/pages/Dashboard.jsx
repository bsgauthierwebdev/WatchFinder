import { useAuth } from "../context/AuthContext"
import DashboardPreferenceCard from '../components/DashboardPreferencesCard';
import DashboardMatchesCard from "../components/DashboardMatchesCard"
import "../styles/dashboard.css"

const Dashboard = () => {
  const {userData, loading} = useAuth()

  if (loading) return <p>Loading...</p>
  if (!userData) return <p>You must be logged in to view the Dashboard</p>

  const {user, preferences, matched_results, favorites} = userData

  console.log("Image source: ", `http://localhost:8800${user.profile_img}`)

  return (
    <div className="dashboard-container">
      <h1>Welcome, {user?.username}!</h1>
      
      <div className="dashboard__profile-info">
        <p><strong>Email: </strong>{user.email}</p>
        {user.profile_img && (
          <img 
            src = {`http://localhost:8800${user.profile_img}`}
            alt = {user.profile_img} 
            className = "dashboard__profile-img" 
          />
        )}
      </div>

      {preferences ? (
        <DashboardPreferenceCard {...preferences} />
      ) : (
        <p>No preferences saved yet</p>
      )}

      {matched_results && matched_results.length > 0 ? (
        <DashboardMatchesCard matchedResults = {matched_results.slice(0, 20)} />
      ) : (
        <p>No matches yet</p>
      )}

      <div className="dashboard__favorites-section">
        <a href = "/favorites">View all of your favorites</a>
      </div>
    </div>
  )
}

export default Dashboard