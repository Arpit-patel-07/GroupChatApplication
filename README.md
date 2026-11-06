# 💬 Group Chat Application (Code-Based Invite System)

> 🎓 **Educational / Learning Project**: This project is structured with clean, beginner-friendly architecture, clear comments, and best practices to help you master full-stack development with **React, Redux Toolkit, Express, Socket.io, and MySQL**.

---

## 🎯 What You Will Learn From This Project

By building and exploring this project, you will learn:
1. **Full-Stack Relational Architecture**: How to design and query a relational SQL database (**MySQL**) with primary keys, foreign keys, and joins.
2. **Secure Authentication**: How password hashing (**bcrypt**) and token-based auth (**JWT**) protect user accounts and API routes.
3. **Unique Code Generation**: How to generate, store, and validate group invite codes (like Discord or Google Classroom).
4. **Real-Time Communication**: How WebSockets (**Socket.io**) use rooms to broadcast messages instantly to everyone in a specific group.
5. **Modern Redux State Management**: How to use **Redux Toolkit (RTK)** slices, asynchronous thunks (`createAsyncThunk`), and connect WebSocket events directly into the Redux store.
6. **Clean Folder Architecture**: Separation of concerns between controllers, routes, middleware, services, and UI components.

---

## 📌 Project Overview (In Simple Words)

This application allows people to sign up, create custom chat groups with unique invite codes, or join existing groups simply by typing a code shared with them. Once inside a group, members can send and receive real-time messages.

### 🚀 How the App Works (User Flow)

```
       [ 1. Visitor arrives ]
                 │
                 ▼
       [ Register / Log In ]
                 │
                 ▼
     [ User Dashboard / Lobby ]
      ├── Option A: Create a New Group ──> System generates unique Code (e.g. "CHAT-4829")
      ├── Option B: Join Group with Code ─> Enters code shared by a friend
      └── Option C: Open an Existing Group
                 │
                 ▼
      [ Real-Time Group Chat Room ]
      (Socket.io instant messaging + MySQL history)
```

1. **Sign Up / Log In**:
   - New users create an account with username, email, and password.
   - Returning users log in to get access.
2. **Lobby / Dashboard**:
   - **Create Group**: Enter a group name. The app creates the group and generates a unique shareable **Invite Code** (e.g., `TECH-9481`).
   - **Join Group**: Paste or type the group invite code to immediately become a member of that chat.
   - **My Groups**: See all the groups you are currently a part of and click to enter.
3. **Chat Room**:
   - Real-time text messaging powered by **Socket.io**.
   - Displays previous chat history loaded from **MySQL**.
   - View group members and easily copy the group code to invite others.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | **React.js** (Vite) | Interactive user interface and component architecture |
| **State Management** | **Redux Toolkit (`@reduxjs/toolkit` & `react-redux`)** | Centralized global state (Auth, Groups, Active Chat, Messages) |
| **Styling** | **Tailwind CSS** (or CSS Modules) | Clean, responsive modern chat UI |
| **Backend** | **Express.js (Node.js)** | RESTful API endpoints for auth, groups, and membership |
| **Real-time**| **Socket.io** | Instant, bidirectional message delivery |
| **Database** | **MySQL** | Relational data storage for users, groups, and messages |
| **Auth** | **JWT (JSON Web Tokens) & bcrypt** | Secure authentication and password hashing |

---

## 🧠 Redux State Management Design (Redux Toolkit)

Using **Redux Toolkit (RTK)** gives us clean, predictable state management across the app:

| Slice | What it manages | Key Actions / Thunks |
| :--- | :--- | :--- |
| **`authSlice`** | Current user info, JWT token, login status | `loginUser`, `registerUser`, `logout`, `loadUser` |
| **`groupSlice`**| List of user's groups, active group info, invite code | `fetchMyGroups`, `createGroup`, `joinGroupByCode`, `setActiveGroup` |
| **`chatSlice`** | Message history, live incoming messages from Socket.io | `fetchMessages`, `receiveMessage`, `clearMessages` |

---

## 🗄️ Database Design (MySQL Schema)

### 1. `users` Table
Stores registered users.
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT)
- `username` (VARCHAR(50), UNIQUE, NOT NULL)
- `email` (VARCHAR(100), UNIQUE, NOT NULL)
- `password_hash` (VARCHAR(255), NOT NULL)
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

### 2. `groups` Table
Stores created chat groups and their unique invite codes.
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT)
- `name` (VARCHAR(100), NOT NULL)
- `invite_code` (VARCHAR(20), UNIQUE, NOT NULL) — *Generated on creation*
- `created_by` (INT, FOREIGN KEY -> `users.id`)
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

### 3. `group_members` Table
Keeps track of which user belongs to which group.
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT)
- `group_id` (INT, FOREIGN KEY -> `groups.id` ON DELETE CASCADE)
- `user_id` (INT, FOREIGN KEY -> `users.id` ON DELETE CASCADE)
- `role` (ENUM('admin', 'member'), DEFAULT 'member')
- `joined_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
- *UNIQUE constraint on `(group_id, user_id)` to prevent duplicate joins.*

### 4. `messages` Table
Stores chat history for each group.
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT)
- `group_id` (INT, FOREIGN KEY -> `groups.id` ON DELETE CASCADE)
- `user_id` (INT, FOREIGN KEY -> `users.id` ON DELETE CASCADE)
- `message_text` (TEXT, NOT NULL)
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

---

## 🔌 API Endpoints Plan

### Authentication (`/api/auth`)
- `POST /register` - Register a new user account.
- `POST /login` - Authenticate user & return JWT token.
- `GET /me` - Get current logged-in user profile.

### Groups (`/api/groups`)
- `POST /create` - Create a new group (auto-generate unique invite code).
- `POST /join` - Join an existing group using the invite code.
- `GET /my-groups` - Fetch all groups the logged-in user belongs to.
- `GET /:groupId/details` - Get group info and member list.

### Messages (`/api/messages`)
- `GET /:groupId` - Load past message history for a group.

### WebSocket Events (Socket.io)
- `join_room` - User enters a group chat room (`groupId`).
- `send_message` - User broadcasts a message to the group.
- `receive_message` - Other users in the room receive the message instantly.
- `leave_room` - User navigates away from the group.

---

## 📁 Recommended Folder Structure

```
groupChatApplication/
├── client/                     # React Frontend (Vite)
│   ├── src/
│   │   ├── app/                # Redux Store Configuration
│   │   │   └── store.js        # Root Redux store
│   │   ├── features/           # Redux Slices (State & Actions)
│   │   │   ├── auth/           # authSlice.js (user, token, login/register thunks)
│   │   │   ├── groups/         # groupSlice.js (my groups, current group, join/create)
│   │   │   └── chat/           # chatSlice.js (messages, real-time message stream)
│   │   ├── components/         # Navbar, ChatBox, MessageItem, Modals
│   │   ├── pages/
│   │   │   ├── Login.jsx       # Login page
│   │   │   ├── Register.jsx    # Signup page
│   │   │   ├── Dashboard.jsx   # Create group / Join by code / Group list
│   │   │   └── ChatRoom.jsx    # Active group chat page
│   │   ├── services/           # Axios API service helpers & socket connection
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/                     # Express Backend
│   ├── config/
│   │   └── db.js               # MySQL connection pool
│   ├── controllers/
│   │   ├── authController.js   # Register & login logic
│   │   ├── groupController.js  # Create, join by code, fetch groups
│   │   └── messageController.js# Fetch past messages
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT verification middleware
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── groupRoutes.js
│   │   └── messageRoutes.js
│   ├── sockets/
│   │   └── chatSocket.js       # Real-time Socket.io handlers
│   ├── .env.example
│   ├── server.js               # Express + Socket.io entry point
│   └── package.json
│
└── README.md                   # Project overview & documentation
```

---

## 🏁 Step-by-Step Implementation Roadmap

1. **Phase 1: Setup & Database**
   - Initialize Git repository and create `server` & `client` directories.
   - Configure MySQL database and execute SQL schema migrations.
2. **Phase 2: Backend Core**
   - Build user authentication (Password hashing with `bcrypt`, JWT token generation).
   - Build group logic (Create group with random nano/crypto code, Join by code endpoint).
   - Test endpoints with Postman / Bruno / Thunder Client.
3. **Phase 3: Real-Time Chat (Socket.io)**
   - Connect Socket.io with the Express server.
   - Save incoming messages directly to MySQL and broadcast to everyone in the room.
4. **Phase 4: Frontend Development**
   - Set up React with Vite and routing (`react-router-dom`).
   - Create clean Auth UI (Register & Login).
   - Build Lobby UI (Create Group modal, Join Group by code input, list of your groups).
   - Build Chat Room UI with real-time message stream and member sidebar.
5. **Phase 5: Polishing & Testing**
   - Error handling (e.g., "Invalid code", "Already in group").
   - Typing indicator and sound notification (optional extras).
