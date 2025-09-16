# 🌟 Hy-Chat

A modern, real-time chat application with video calling capabilities, built for language learners and music enthusiasts to connect and share their passions.

## 🌐 Live Demo
**[Try Hy-Chat Live](https://hy-chat-video-calls.onrender.com)** - Experience the app in action!

![Hi-Chat Banner](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=Hi-Chat+-+Connect+Through+Music+%26+Language)

## ✨ Features

### 🔐 Authentication & User Management
- **Secure Signup/Login** - JWT-based authentication
- **Profile Onboarding** - Complete profile setup with avatar generation
- **Random Avatar Generator** - 100+ unique profile pictures
- **User Profiles** - Native language, favorite singers, location, and bio

### 👥 Social Features
- **Friend System** - Send, accept, and reject friend requests
- **User Discovery** - Find recommended users based on preferences
- **Friends List** - View all your connections with their details
- **Real-time Notifications** - Get notified of friend requests and activities

### 💬 Real-time Chat
- **Instant Messaging** - Powered by Stream Chat SDK
- **Message History** - Persistent chat conversations
- **Typing Indicators** - See when friends are typing
- **Message Status** - Read receipts and delivery confirmations

### 📹 Video Calling
- **HD Video Calls** - Crystal clear video communication
- **Call Controls** - Mute, camera toggle, and call management
- **Stream Video Integration** - Reliable video calling infrastructure
- **In-chat Call Links** - Start video calls directly from chat

### 🎨 Modern UI/UX
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Dark/Light Themes** - Multiple theme options with DaisyUI
- **Beautiful Animations** - Smooth transitions and interactions
- **Intuitive Navigation** - Easy-to-use sidebar and navigation

## 🛠️ Tech Stack

### Frontend
- **React 19** - Latest React with modern features
- **Vite** - Fast build tool and development server
- **TailwindCSS** - Utility-first CSS framework
- **DaisyUI** - Beautiful UI components
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching and caching
- **Stream Chat React** - Chat UI components
- **Stream Video React SDK** - Video calling components
- **React Hot Toast** - Beautiful notifications
- **Zustand** - Lightweight state management
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Stream Chat** - Chat backend infrastructure
- **Stream Video** - Video calling backend
- **CORS** - Cross-origin resource sharing
- **Cookie Parser** - Cookie handling middleware

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB database
- Stream account (for chat and video)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/hi-chat.git
cd hi-chat
```

2. **Install dependencies**
```bash
npm run build
```

3. **Environment Setup**

Create `.env` file in the `backend` directory:
```env
# Database
MONGODB_URI=your_mongodb_connection_string

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key

# Stream Configuration
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret

# Server Configuration
PORT=5001
NODE_ENV=development
```

Create `.env` file in the `frontend` directory:
```env
# Stream API Key (Public)
VITE_STREAM_API_KEY=your_stream_api_key

# Backend URL
VITE_API_URL=http://localhost:5001
```

4. **Start the application**

Development mode:
```bash
# Start backend
npm start

# Start frontend (in another terminal)
cd frontend
npm run dev
```

Production build:
```bash
npm run build
```

## 📁 Project Structure

```
hi-chat/
├── backend/                 # Backend server
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Custom middleware
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   ├── lib/             # Utility functions
│   │   └── server.js        # Main server file
│   └── package.json
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # API and utilities
│   │   ├── store/           # State management
│   │   ├── constants/       # App constants
│   │   └── main.jsx         # App entry point
│   └── package.json
├── package.json             # Root package.json
├── .gitignore
└── README.md
```

## 🔧 Configuration

### Stream Setup
1. Create a [Stream](https://getstream.io/) account
2. Create a new app in the Stream dashboard
3. Get your API Key and Secret
4. Add them to your environment variables

### MongoDB Setup
1. Create a MongoDB database (local or cloud)
2. Get your connection string
3. Add it to your backend `.env` file

## 📱 Usage

1. **Sign Up** - Create a new account with email and password
2. **Complete Profile** - Add your details, native language, and favorite singer
3. **Find Friends** - Discover users with similar interests
4. **Start Chatting** - Send friend requests and start conversations
5. **Video Calls** - Click the call button in any chat to start a video call

## 🚀 Deployment

### Frontend (Netlify/Vercel)
```bash
npm run build
# Deploy the 'frontend/dist' folder
```

### Backend (Railway/Heroku)
```bash
# Set environment variables in your hosting platform
# Deploy the 'backend' folder
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Stream](https://getstream.io/) for chat and video infrastructure
- [DaisyUI](https://daisyui.com/) for beautiful UI components
- [TailwindCSS](https://tailwindcss.com/) for styling
- [React](https://reactjs.org/) for the amazing framework

## 📞 Support

If you have any questions or need help, please open an issue or contact:
- Email: your.email@example.com
- Twitter: [@yourusername](https://twitter.com/yourusername)

---

Made with ❤️ by [Your Name](https://github.com/yourusername)
