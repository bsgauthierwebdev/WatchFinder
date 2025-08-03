import {Swiper, SwiperSlide} from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "./dashboardFavoritesCard.css"

const DashboardFavoritesCard = ({favorites}) => {
  const hasFavorites = Array.isArray(favorites) && favorites.length > 0

  return (
    <div className="dashboard-favorites-container">
      <div className="dashboard-favorites-header">
          <h3>Your Favorite Listings</h3>
      </div>
      
      {hasFavorites ? (
        <Swiper
          modules = {{Navigation, Pagination}}
          spaceBetween = {20}
          slidesPerView = {3}
          navigation
          pagination = {{clickable: true}}
          breakpoint = {{
            640: {slidesPerView: 1},
            768: {slidesPerView: 2},
            1024: {slidesPerView: 3}
          }}
        >
          {favorites.map((fav) => (
            <SwiperSlide key = {fav.id}>
              <div className="dashboard-favorite-card">
                {fav.images?.length > 0 && (
                  <img 
                    src = {fav.images[0]} 
                    alt = {fav.title}
                    className="favorite-img" 
                  />
                )}
                
                <div className="dashboard-favorite-card-info">
                  <h4>{fav.title}</h4>
                  <p><strong>Brand: </strong>{fav.brand}</p>
                  <p><strong>Price: </strong>{fav.price}</p>
                  <p><strong>Platform: </strong>{fav.platform}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="dashboard-no-favorites-message">
          You haven't saved any matches yet
        </div>
      )}
      
      {hasFavorites ? (
        <div className="dashboard-favorites-footer">
            <a href = "/matches" className = "view-all-link">View All Favorites</a>
        </div>
      ) : (
        null
      )}
      
    </div>
  )
}

export default DashboardFavoritesCard
