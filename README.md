# task-student-form-with-encryption
# task-student-form-with-encryption

A student management system with login, registration, and CRUD operations.  
Implements **two-level encryption** (frontend + backend) for secure data handling.

---

## Features

### Login Form
- Authenticates users with **email and password**.  
- Uses **JWT Authentication**.  
- Passwords are frontend-encrypted before sending to backend.

### Student Registration Form
- Allows adding new students with fields:  
  - Full name  
  - Email  
  - Phone number  
  - Date of birth  
  - Gender  
  - Address  
  - Course enrolled  
  - Password  

### Student List
- Displays all students in a **table**.  
- Provides options to **edit** or **delete** each student.

### CRUD Operations
- **Create**: `POST /api/register`  
- **Read**: `GET /api/students`  
- **Update**: `PUT /api/student/:id`  
- **Delete**: `DELETE /api/student/:id`  

---

## Two-Level Encryption

1. **Frontend**:  
   - AES encryption for all fields (except email).  
   - Deterministic hashing for email (for duplicate checks).  
   - Passwords hashed before sending.

2. **Backend**:  
   - AES encryption for sensitive fields.  
   - Bcrypt/SHA256 hashing for passwords.  
   - Stores only encrypted data in MongoDB.  
   - Decrypts one layer before sending response to frontend.

---

## Email Duplicacy Check
- Uses **deterministic email hash**.  
- Prevents duplicate student registration with the same email.

---

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn UI, react-hook-form, zod  
- **Backend**: Node.js, Express, TypeScript, Mongoose  
- **Database**: MongoDB  
- **Encryption**:  
  - Frontend → CryptoJS / Web Crypto API  
  - Backend → Node.js crypto  
  - Passwords → bcrypt / SHA256  
- **Other Libraries**: axios, react-router-dom, lucide-react  

---

## Project Structure


project/
├── client/                        # Frontend (React + TypeScript)
│   ├── src/
│   │   ├── components/
│   │   │   ├── StudentFormDialog.tsx   # Dialog for add/edit student form
│   │   │   ├── StudentsList.tsx        # Student list table
│   │   │   ├── LoginForm.tsx           # Login form
│   │   │   ├── StudentsForm.tsx        # Student registration form
│   │   ├── utils/
│   │   │   ├── crypto.ts               # Frontend encryption functions
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── package.json
│
└── server/                        # Backend (Node.js + Express + TS)
    ├── src/
    │   ├── controllers/
    │   │   ├── studentController.ts
    │   ├── middleware/
    │   │   ├── authMiddleware.ts
    │   ├── models/
    │   │   ├── Student.ts
    │   ├── routes/
    │   │   ├── studentRoutes.ts
    │   ├── utils/
    │   │   ├── crypto.ts
    │   ├── app.ts
    │   ├── server.ts
    ├── .env
    ├── generate.ts
    ├── .gitignore
    ├── package-lock.json
    ├── package.json
    └── tsconfig.json


Prerequisites

Node.js: v16 or higher
MongoDB: Running locally or via a cloud provider (e.g., MongoDB Atlas)
npm or yarn: For package management

Setup Instructions

Clone the Repository:
git clone <repository-url>
cd project


Install Dependencies:

For the backend:cd server
npm install


For the frontend:cd client
npm install




Configure Environment Variables:

Backend (server/.env):MONGODB_URI=mongodb://localhost:27017/test
BACKEND_KEY=your_secret_backend_key_32bytes


Frontend (client/.env):VITE_FRONTEND_KEY=your_secret_frontend_key_32chars
VITE_FIXED_IV=1234567890abcdef1234567890abcdef



Note: Replace MONGODB_URI with your MongoDB connection string. Ensure BACKEND_KEY is 32 bytes and FRONTEND_KEY is 32 characters. FIXED_IV must be a 16-byte hex string.

Run MongoDB:

If running locally:mongod


Or use MongoDB Atlas and update MONGODB_URI.



Commands to Run the Project

Run the Backend:
cd server
npm run dev


This starts the Express server (typically on http://localhost:5000).


Run the Frontend:
cd client
npm run dev


This starts the React development server (typically on http://localhost:5173).


Access the Application:

Open http://localhost:5173 in your browser.
Use the login form to authenticate or the registration form to create a new student.
Navigate to the student list page to view, edit, or delete students.



Screenshots
Login Form
<img width="1802" height="792" alt="Screenshot 2025-09-13 182900" src="https://github.com/user-attachments/assets/09548593-e40b-42df-9cb2-768ee88920c5" />

Registration Form
<img width="1717" height="970" alt="Screenshot 2025-09-13 182920" src="https://github.com/user-attachments/assets/f0589493-1b03-46a8-a39b-0ab7483ea3f0" />

Student List
<img width="1817" height="687" alt="Screenshot 2025-09-14 124719" src="https://github.com/user-attachments/assets/a52c5416-d249-4420-9446-ee50c8f986c3" />

Encrypted Payload (Request)
<img width="1246" height="317" alt="Screenshot 2025-09-14 124916" src="https://github.com/user-attachments/assets/f8429814-1044-4cff-bea6-783994043a22" />

Encrypted Response
<img width="1107" height="647" alt="Screenshot 2025-09-14 125002" src="https://github.com/user-attachments/assets/65cc2f11-aaed-4a54-a078-b0f3bcca2fc7" />

Encrypted Data in Database
<img width="1098" height="312" alt="Screenshot 2025-09-14 124806" src="https://github.com/user-attachments/assets/efd5f1aa-d615-459b-ba93-abaa9762643b" />


