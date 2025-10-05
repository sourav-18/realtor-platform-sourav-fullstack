# Real Estate Property Listing Platform

A fullstack web application where property owners can list their properties, and customers can browse, search, and view details. Built as part of the **Fullstack Assignment**.

---

## 🚀 Tech Stack

**Backend**
- Node.js (Express.js)  
- PostgreSQL  
- Sequelize ORM  
- JWT Authentication  

**Frontend**
- React  
- Tailwind CSS (UI styling)  
- React Router DOM  

**Other**
- Figma (UI Wireframes)  
- Cloudinary (Image upload)  
- Docker (Optional setup)  

---

## ✨ Features

### 🔑 Authentication
- User registration with role selection (Owner / Customer)  
- Login with JWT authentication  
- Protected routes  

### 🏡 Property Management
- Owners can **add, edit, delete** their properties  
- Image upload for properties  
- CRUD operations with ownership validation  

### 🔎 Search & Filter
- Search by location, price range  
- Filter by property type, bedrooms, Listing Type, Property Type, etc.  
- Sorting options (price: high ,low)  

### 👤 User Roles
- **Guest**: Browse properties, but cannot see owner contact details  
- **Customer**: Browse properties, view owner contact  
- **Owner**: Manage (create, update, delete) their own properties  

---

## Database setup
create database (any name)

## Backend Setup
- cd backend
- cp .env.example .env
- npm install
- npm run dev  

## Frontend Setup
- cd ../frontend
- cp .env.example .env
- npm install
- npm run dev

🌐 Links

- GitHub Repository: https://github.com/sourav-18/realtor-platform-sourav-fullstack
- Demo Video: ""
- Live App URL: https://realtor-platform-sourav-git-437eec-sourav-das-projects-6a1e3176.vercel.app/
- Live Api URL: https://realtor-platform-sourav-fullstack.onrender.com/api/v1

