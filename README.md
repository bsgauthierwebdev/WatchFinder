# 🕵️‍♂️ Watch Finder App

A full-stack PERN (PostgreSQL, Express.js, React, Node.js) application that helps users search, save, and track luxury watch listings based on personalized preferences.

## 📌 Features

- 🔐 User Authentication (Register/Login with JWT)
- ⚙️ Set Custom Preferences (brand, size, strap, movement, price, etc.)
- 🔍 Scraped Listings from third-party watch marketplaces
- 💡 Matched Results generated based on user preferences
- ❤️ Add/Remove Favorites
- 📥 Save listings and receive updates
- 🧰 Modular backend with controllers and middleware

## 🛠️ Technologies Used

- **Frontend:** React (Vite), CSS Modules
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Authentication:** bcrypt, JWT
- **Web Scraping:** Python with BeautifulSoup / Selenium
- **Scheduling:** node-cron
- **Testing Tools:** Postman

## 📁 Project Structure

/client # React frontend /server ├── controllers # Route logic (auth, favorites, preferences, etc.) ├── middleware # Authentication & utility middleware ├── routes # Express route handlers ├── db.js # PostgreSQL connection pool ├── server.js # App entry point


## 🚀 Getting Started

### Prerequisites

- Node.js + npm
- PostgreSQL database
- Python (for scraping)
- Environment variables configured in `.env`

### Installation

1. Clone the repo:
   ```bash
   git clone https://github.com/yourusername/watch-finder.git
   cd watch-finder
2. Install backend dependencies
   cd server
   npm install
3. Set up the PostgreSQL database and .env file
   DATABASE_URL=your_postgres_connection_string
   JWT_SECRET=your_secret_key
4. Run the server
   npm run dev
5. (Optional) Start frontend and scraping service separately

.

🧪 API Endpoints
Auth
POST /api/auth/register – Register new user

POST /api/auth/login – Login and receive token

Preferences
POST /api/preferences – Add new preference

GET /api/preferences – Fetch user's preferences

Listings
GET /api/listings – View available listings

Favorites
POST /api/favorites – Add listing to favorites

GET /api/favorites – Get all favorites

DELETE /api/favorites/:listing_id – Remove from favorites

Matched Results
GET /api/matches – View matched listings

DELETE /api/matches/:match_id – Remove a match

🔒 Security
Passwords hashed with bcrypt

JWT-based authentication

Route protection via middleware

📅 Future Improvements
Email alerts when new matched listings appear

Mobile responsiveness for the frontend

Admin dashboard for managing listings

👨‍💻 Author
Brent Gauthier
Full-Stack Developer | PERN Stack | Watch fan


