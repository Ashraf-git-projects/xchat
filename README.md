XChat – Realtime Chat Application (MERN)

XChat is a full-stack real-time chat application built using the MERN stack with Firebase Realtime Database for live messaging. It supports user authentication, private chat rooms, real-time messaging, typing indicators, and online presence.

This project is developed as part of the Crio Full Stack Development Program.

🚀 Live URLs

Frontend (Vercel):
https://xchat-liard.vercel.app/

Backend (Render):
https://xchat-backend-cu9l.onrender.com

🧩 Tech Stack

Frontend

React (CRA)

Context API

Axios

Firebase Realtime Database

Backend

Node.js

Express.js

MongoDB Atlas

JWT (HTTP-only cookies)

bcrypt

Deployment

Frontend: Vercel

Backend: Render

Database: MongoDB Atlas (Free Tier)

✨ Features

User registration & login

JWT authentication using cookies

Search users by username/email

Initialize private chat rooms

Real-time messaging with Firebase

Typing indicators & online presence

Secure logout

Responsive UI

🔌 API Endpoints

POST /api/users/register

POST /api/users/login

GET /api/users/me

GET /api/users/search

POST /api/rooms/init

GET /api/rooms/userrooms

GET /api/users/logout

🔥 Firebase Usage

Messages: messages/{roomId}

Typing indicator: typing/{roomId}/{userId}

User presence: status/{userId}

⚙️ Environment Variables

Backend (server/.env)

PORT=5000
MONGO_URI=...
JWT_SECRET=...
NODE_ENV=production


Frontend (client/.env)

REACT_APP_FIREBASE_*


.env files are ignored using .gitignore

🧪 Testing

Backend APIs tested using Postman

Cypress backend test cases verified

👨‍💻 Author

Ashraf Hussain Siddiqui
Full Stack Developer (MERN)
