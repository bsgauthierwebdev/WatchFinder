import {Swiper, SwiperSlide} from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "./dashboardFavoritesCard.css"

const DashboardFavoritesCard = ({favorites}) => {
  return (
    <div className="dashboard-favorites-container">
      <div className="dashboard-favorites-header">
          <h3>Your Favorite Listings</h3>
      </div>
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
            <div className="favorite-card">
              <img 
                src = {fav.image_url} 
                alt = {fav.title}
                className="favorite-img" 
              />
              <div className="favorite-card-info">
                <h4>{fav.title}</h4>
                <p><strong>Brand: </strong>{fav.brand}</p>
                <p><strong>Price: </strong>{fav.price}</p>
                <p><strong>Platform: </strong>{fav.platform}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="dashboard-favorites-footer">
                <a href = "/matches" className = "view-all-link">View All Favorites</a>
            </div>
    </div>
  )
}

export default DashboardFavoritesCard
