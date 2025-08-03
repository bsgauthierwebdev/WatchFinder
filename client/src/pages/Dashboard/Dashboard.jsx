import { useAuth } from "../../context/AuthContext"
import DashboardPreferenceCard from '../../components/Dashboard/DashboardPreferences/DashboardPreferencesCard';
import DashboardMatchesCard from "../../components/Dashboard/DashboardMatches/DashboardMatchesCard"
import DashboardFavoritesCard from "../../components/Dashboard/DashboardFavorites/DashboardFavoritesCard";
import DashboardUserCard from "../../components/Dashboard/DashboardUserCard/DashboardUserCard";
import "./dashboard.css"


const Dashboard = () => {
  const {userData, loading} = useAuth()

  if (loading) return <p>Loading...</p>
  if (!userData) return <p>You must be logged in to view the Dashboard</p>

  const {user, preferences, matched_results, favorites} = userData

  // console.log("Image source: ", `http://localhost:8800${user.profile_img}`)

  return (
    <div className="dashboard-container">
      <div className="dashboard__user-section">
        <DashboardUserCard />
      </div>

      <div className="dashboard__favorites-section">
        <DashboardFavoritesCard favorites = {favorites ?? []} />
      </div>

      <div className="dashboard__matches-section">
        <DashboardMatchesCard matchedResults = {matched_results ?? []} />
      </div>
      
      <div className="dashboard__preferences-section">
        <DashboardPreferenceCard {...preferences} />
      </div>
    </div>
  )
}

export default Dashboard