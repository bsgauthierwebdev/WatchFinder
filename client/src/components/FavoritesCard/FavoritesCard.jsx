import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import './favoritesCard.css'

const FavoritesCard = ({favorites}) => {
    const hasFavorites = Array.isArray(favorites) && favorites.length > 0

    return (
        <div className="favorites-card-container">

            {hasFavorites ? (
                <div className="favorites-card-listings">
                    {favorites.map((fav, idx) => (
                        <div key = {idx}className="favorites-card-wrapper">

                            <Swiper
                                modules = {[Navigation, Pagination]}
                                spaceBetween = {20}
                                slidesPerView = {1}
                                navigation
                                pagination = {{clickable: true}}
                            >
                                {fav.images?.map((img, i) => (
                                    <SwiperSlide key = {i}>
                                        <div className="favorites-card">
                                            <img 
                                                src = {img}
                                                alt = {`${fav.title} - ${idx + 1}`}
                                                className = "favorites-card-img" 
                                            />

                                            
                                        </div>
                                    </SwiperSlide>
                                ))}
                                
                            </Swiper>
                            <div className="favorites-card-info">
                                <h4>{fav.title}</h4>
                                <p><strong>Brand: </strong>{fav.brand}</p>
                                <p><strong>Price: </strong>{fav.price}</p>
                                <p><strong>Platform: </strong>{fav.platform}</p>
                            </div>
                        </div>

                    ))}
                </div>
            ) : (
                <div className="favorites-card-no-listings-msg">
                    You haven't saved any matches yet
                </div>
            )}
        </div>
    )
}

export default FavoritesCard
