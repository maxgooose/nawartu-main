# Nawartu - A Modern Home Rental Platform (Damascus Edition)

![Nawartu Homepage](https://i.imgur.com/your-screenshot-url.png) <!-- Add a screenshot of your application -->

Nawartu is a full-stack home rental application inspired by Airbnb, tailored for discovering and booking unique homes in Damascus. It features a modern, intuitive user interface built with React and a robust backend powered by Node.js, Express, and MongoDB.

[**Live Demo (Coming Soon!)**](#)

---

## ✨ Features

**Frontend (Client-Side):**
- **Modern & Responsive Design:** Beautifully crafted with Tailwind CSS for a seamless experience on any device.
- **Interactive Property Map:** (Future goal) Visualize property locations.
- **Property Search & Filtering:** Easily search for listings by neighborhood or other criteria.
- **Detailed Property Pages:** View high-resolution images, amenities, host information, and pricing.
- **Seamless Booking Flow:** An intuitive modal for selecting dates and confirming bookings.
- **User Authentication:** Secure login and registration modals.
- **User Dashboard:**
    - **My Trips:** View and manage your upcoming and past trips.
    - **My Listings:** (For Hosts) Manage your properties and view incoming booking requests.
- **Toast Notifications:** Real-time feedback for user actions.

**Backend (Server-Side):**
- **RESTful API:** A well-structured API built with Express.js.
- **JWT Authentication:** Secure, token-based authentication with user roles (guest, host, admin).
- **Mongoose Models:** Robust schemas for Users, Properties, and Bookings.
- **CRUD Operations:** Full support for creating, reading, updating, and deleting properties and bookings.
- **Advanced Search:** Backend logic for filtering and searching properties.
- **Image Uploads:** Local storage for property images via `multer`.
- **Environment Management:** Securely manage keys and database URIs.
- **Seeder Script:** Easily populate the database with sample data for development.

---

## 🚀 Tech Stack

- **Frontend:**
  - **React 18** & React Router v6
  - **Tailwind CSS** for styling
  - **Lucide-React** for icons
  - **React-Toastify** for notifications
  - **React Datepicker** for selecting booking dates
- **Backend:**
  - **Node.js** & **Express.js**
  - **MongoDB** with **Mongoose**
  - **JSON Web Tokens (JWT)** for authentication
  - **Bcrypt.js** for password hashing
  - **Multer** for file uploads
  - **Dotenv** for environment variables

---

## 📦 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or newer recommended)
- [npm](https://www.npmjs.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or a local MongoDB installation)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/nawartu.git
    cd nawartu
    ```

2.  **Install Frontend Dependencies:**
    ```bash
    npm install
    ```

3.  **Install Backend Dependencies:**
    ```bash
    cd backend
    npm install
    ```

4.  **Configure Backend Environment Variables:**
    - Create a `.env` file in the `backend` directory.
    - Copy the contents of `.env.example` (if present) or use the following template:
      ```env
      PORT=5001
      MONGODB_URI="your_mongodb_connection_string"
      JWT_SECRET="a_super_secret_key_for_jwt"
      NODE_ENV=development
      ```
    - **Important:** Replace `"your_mongodb_connection_string"` with your actual MongoDB Atlas connection string.

5.  **Seed the Database (Optional but Recommended):**
    - From the `backend` directory, run the seeder to populate your database with sample users and properties.
    - This helps in testing the application immediately.
      ```bash
      npm run seed
      ```

### Running the Application

You need to run both the frontend and backend servers concurrently in separate terminal windows.

1.  **Start the Backend Server:**
    - From the `nawartu/backend` directory:
      ```bash
      npm run dev
      ```
    - The backend API will be running on `http://localhost:5001`.

2.  **Start the Frontend Server:**
    - From the root `nawartu` directory:
      ```bash
      npm start
      ```
    - The application will open in your browser at `http://localhost:3000`.

---

## 📂 Project Structure

```
nawartu/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── .env
│   ├── package.json
│   └── server.js
├── public/
├── src/
│   ├── components/
│   │   └── ui/
│   ├── pages/
│   ├── context/
│   ├── services/
│   ├── App.jsx
│   └── index.js
├── .gitignore
├── package.json
└── README.md
```

---

## 📜 Available Scripts

### Root Directory (Frontend)

- `npm start`: Runs the React app in development mode.
- `npm run build`: Builds the app for production.
- `npm test`: Runs the test suite.

### `/backend` Directory

- `npm run dev`: Starts the backend server with `nodemon` for auto-reloading.
- `npm start`: Starts the backend server in production mode.
- `npm run seed`: Clears and populates the database with sample data.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/your-username/nawartu/issues).

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

Made with ❤️ in Damascus
