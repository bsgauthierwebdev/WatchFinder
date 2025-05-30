import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "./dashboardMatchesCard.css"

const DashboardMatchesCard = ({matchedResults}) => {
    if (!matchedResults || matchedResults.length === 0) {
        return <p>No matched results yet</p>
    }
    // console.log("Matched Results Count: ", matchedResults.length)

    return (
        <div className="dashboard-matches-container">
            <div className="dashboard-matches-header">
                <h3>Your Matched Listings</h3>
            </div>

            <Swiper
                modules = {[Navigation, Pagination]}
                spaceBetween={20}
                slidesPerView={3}
                navigation
                pagination = {{clickable: true}}
                breakpoints = {{
                    640: {slidesPerView: 1},
                    768: {slidesPerView: 2},
                    1024: {slidesPerView: 3}
                }}
            >
                {matchedResults.map(match => (
                    <SwiperSlide key = {match.match_id}>
                        <div 
                            className="match-card"
                            // onClick = {() => {
                            //     window.location.href = `/listing/${match.listing_id}`
                            // }}
                        >
                            {match.image_url && (
                                <img src = {match.image_url} alt = {match.title} className = "match-card-img" />
                            )}
                            <div className="match-card-info">
                                <p><strong>Brand: </strong>{match.brand}</p>
                                <p><strong>Price: </strong>{match.price}</p>
                                <p>{match.title}</p>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            <div className="dashboard-matches-footer">
                <a href = "/matches" className = "view-all-link">View All Matches</a>
            </div>
        </div>
    )
}

export default DashboardMatchesCard