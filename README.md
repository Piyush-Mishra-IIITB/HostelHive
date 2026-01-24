# 🏡 StayNext

**StayNext** is a full-stack accommodation listing web application inspired by platforms like Airbnb.  
It allows users to explore stays, filter by categories, search by location, create listings, and leave reviews — all with secure authentication and cloud-based image storage.

---

## 🚀 Features

### 🔍 Explore Listings
- View all available stays with images, price, and location
- Responsive card-based UI

### 🗂️ Category Filtering
- Browse stays by categories:
  - Trending
  - Iconic Cities
  - Mountains
  - Amazing Pools
  - Beach
  - Countryside
  - Luxe
  - Heritage
  - Farm Stay
  - Camping

### 🔎 Search
- Search listings by **location** (case-insensitive)

### 👤 Authentication & Authorization
- User signup & login (Passport.js)
- Only logged-in users can:
  - Create listings
  - Add reviews
- Only owners can:
  - Edit or delete their listings
- Only review authors can:
  - Delete their reviews

### 📝 Reviews & Ratings
- Star-based rating system ⭐
- Reviews linked to authenticated users

### 🖼️ Image Upload
- Image upload using **Multer**
- Cloud storage via **Cloudinary**

### 🔐 Secure Sessions
- Sessions stored in **MongoDB Atlas** using `connect-mongo`
- Flash messages for better UX

---

## 🛠️ Tech Stack

### Frontend
- EJS (with EJS-Mate layouts)
- Bootstrap 5
- Font Awesome
- Custom CSS

### Backend
- Node.js
- Express.js
- MongoDB & Mongoose
- Passport.js (Local Strategy)

### Cloud & Storage
- MongoDB Atlas
- Cloudinary (image hosting)

---

