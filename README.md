# 🏨 HostelHive

HostelHive is a full-stack web application that allows users to list hostels, explore available stays, and leave reviews. It features secure authentication, listing ownership, and a modern UI inspired by Airbnb-style platforms.

---

## 🚀 Features

### 🔐 Authentication & Authorization
- User Signup & Login (Passport.js)
- Session-based authentication
- Flash messages for feedback
- Protected routes for listings & reviews

### 🏡 Listings
- Create, Edit, Delete hostel listings
- Image support for listings
- Owner-based edit/delete permissions
- Location, price, and description support

### ⭐ Reviews & Ratings
- Add reviews with **star-based rating**
- Display all reviews with author names
- Delete reviews (only by review author)
- Stars UI instead of numeric rating

### 👤 Ownership Rules
- Only listing owners can edit/delete their listings
- Only review authors can delete their reviews

### 🎨 UI & UX
- Bootstrap responsive design
- Star rating UI
- Flash success & error messages
- Clean and modern listing cards

---

## 🛠️ Tech Stack

**Frontend**
- EJS
- Bootstrap 5
- Font Awesome

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- Passport.js

**Other Tools**
- Joi Validation
- Method Override
- Express Flash

---
