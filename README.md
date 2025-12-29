# Full Stack Authentication Project

This project is a full-stack authentication system built as part of an academic assignment.  
It demonstrates user registration, email verification using OTP, and login with JWT-based authentication.

The project is structured as a monorepo containing both frontend and backend applications.

---

##  Tech Stack

### Frontend
- React (Vite)
- JavaScript
- Axios
- JWT-based authentication
- Form validation

### Backend
- Node.js
- Express
- MongoDB (Mongoose)
- Nodemailer
- bcrypt
- JSON Web Tokens (JWT)

---

##  Project Structure

text'''

├── frontend
│ ├── src
│ │ ├── components
│ │ │ ├── Login.jsx
│ │ │ ├── Signup.jsx
│ │ │ └── Welcome.jsx
│ │ ├── services
│ │ │ └── api.js
│ │ ├── utils
│ │ │ ├── jwt.js
│ │ │ └── validation.js
│ │ ├── App.jsx
│ │ └── main.jsx
│ ├── .env
│ └── package.json
│
├── backend
│ ├── config
│ │ └── database.js
│ ├── controllers
│ │ └── auth
│ │ ├── loginController.js
│ │ ├── signupController.js
│ │ ├── verifyOTPController.js
│ │ └── userController.js
│ ├── middleware
│ │ └── auth.js
│ ├── models
│ │ └── User.js
│ ├── routes
│ │ └── auth
│ │ ├── index.js
│ │ ├── login.js
│ │ ├── signup.js
│ │ ├── verifyOTP.js
│ │ └── user.js
│ ├── utils
│ │ ├── jwt.js
│ │ ├── otp.js
│ │ └── email.js
│ ├── server.js
│ ├── .env
│ └── package.json
│
└── README.md

# Running the Project

## Start the backend

cd backend

npm install

npm run dev

## Start the frontend

cd frontend

npm install

npm run dev


## Authentication Flow

- User signs up using email and password
- Server generates a One-Time Password (OTP)
- OTP is sent to the user via email
- User verifies the OTP
- User can then log in
- A JWT token is issued and stored on the client
- Authenticated routes use the token for access


# API Endpoints

## POST /api/auth/signup

Register a new user and send OTP

{
  "email": "user@example.com",

  "password": "password123"
}







## POST /api/auth/verify-otp

Verify OTP and activate account

{
  "email": "user@example.com",

  "otp": "123456"
}







## POST /api/auth/login

Login user

{
  "email": "user@example.com",

  "password": "password123"
}







## GET /api/auth/me

Get authenticated user information

Headers:

Authorization: Bearer <JWT_TOKEN>






## Features

- Secure password hashing using bcrypt
- Email-based OTP verification
- JWT authentication with expiration
- Protected API routes
- MongoDB data persistence
- Clean separation between frontend and backend
- Environment-based configuration
- Simple and readable project structure

## Notes

- .env files are included intentionally as part of the assignment requirements
- All credentials belong to a newly created project account
- No personal or production credentials are used
- OTP and JWT expiration times are configurable
- Email delivery uses Nodemailer with Gmail App Passwords


