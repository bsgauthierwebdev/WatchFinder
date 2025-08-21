import { useAuth } from '../../context/AuthContext'
import FavoritesCard from '../../components/FavoritesCard/FavoritesCard'
import "./favorites.css"

const Favorites = () => {
  const {userData, loading} = useAuth()

  if (loading) return <p>Loading...</p>
  if (!userData) return <p>You must be logged in to view this page</p>

  const {favorites} = userData

  return (
    <div className="favorites-container">
      <div className="favorites-header">
          <h2 className="favorites-title">Your Saved Listings</h2>
      </div>
      <div className="favorites-display">
        <FavoritesCard favorites = {favorites ?? []} />
      </div>
    </div>
  )
}

export default Favorites
