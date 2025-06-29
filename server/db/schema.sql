-- Create the database
CREATE DATABASE watch_tracker_dev;

-- Navigate to the dB
\c watch_tracker_dev

-- Enable UUID support
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Schema (same as production)
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reset_token TEXT,
    reset_token_expires TIMESTAMP,
    profile_img_url VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    email_verification_token TEXT,
    email_verification_expires TIMESTAMP
);

CREATE TABLE preferences (
    preference_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id),
    platforms TEXT[],
    brands TEXT[],
    case_size_min INT,
    case_size_max INT,
    strap_styles TEXT[],
    movements TEXT[],
    watch_styles TEXT[],
    price_min INT,
    price_max INT,
    seller_location TEXT,
    condition TEXT[],
    dial_colors TEXT[],
    frequency TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE listings (
    listing_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform TEXT,
    title TEXT,
    url TEXT UNIQUE,
    -- image_url TEXT,
    price INT,
    brand TEXT,
    case_size INT,
    strap_style TEXT,
    movement TEXT,
    watch_style TEXT,
    seller_location TEXT,
    condition TEXT,
    dial_color TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    scraped_at TIMESTAMP
);

CREATE TABLE listing_images (
    image_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID REFERENCES listings(listing_id) ON DELETE CASCADE,
    image_url TEXT NOT NULL
)

CREATE TABLE favorites (
    user_id UUID REFERENCES users (user_id),
    listing_id UUID REFERENCES listings(listing_id),
    favorited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY key (user_id, listing_id)
);

CREATE TABLE matched_results (
    match_id UUID DEFAULT uuid_generate_v4(),
    preference_id UUID REFERENCES preferences(preference_id),
    user_id UUID REFERENCES users(user_id),
    listing_id UUID REFERENCES listings(listing_id),
    matched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (match_id)
);