# AI Travel Guide ✈️

AI Travel Guide is an intelligent travel planning application that helps users explore destinations, get personalized recommendations, create detailed itineraries, and export them as PDFs. It’s built using a modern full-stack framework and leverages AI for real-time suggestions based on user preferences and locations.

Features ✅

- AI-based location recommendations using OpenAI
- Create, update, and delete custom itineraries
- Export itineraries as PDF
- Save and manage favorite locations
- Clean UI with interactive components
- Persistent login system with JWT and protected routes

Tech Stack 🛠️

Frontend:
- Next.js
- Tailwind CSS
- Axios for API handling

Backend:
- Node.js with Express
- JWT for secure authentication
- MongoDB Atlas for database
- Multer and other middleware for processing

AI:
- OpenAI API for location recommendations and suggestions

Planned Features 🔜

- Map integration with location search and preview
- Image recognition for landmark and location detection
- Full chatbot assistant for conversational travel planning

Project Structure 📁

/client
- Next.js frontend with pages like Home, Profile, Itinerary, and AI Recommendations

/server
- Express backend with controllers for auth, locations, itineraries, and AI logic

Installation 🚀

1. Clone the repository
   git clone https://github.com/Jashabant-Behera/AI-Travel-Guide.git
   cd AI-Travel-Guide

2. Install dependencies

   For client:
   cd client
   npm install
   npm run dev

   For server:
   cd server
   npm install
   node index.js

3. Environment variables

Create a .env file in the /server directory with:

PORT=your_port
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key

Frontend:
VITE_BACKEND_URL=your_backend_url

Deployment 💻

Frontend can be deployed using Vercel or GitHub Pages.
Backend can be hosted on Render, Railway, or Replit.
Use ngrok or similar tools for local tunneling if needed.

Usage 🧭

- Register and log in to access personalized features
- Enter your preferences and location to get AI-powered suggestions
- Create itineraries and modify them as needed
- Download itineraries in PDF format to use offline or share

Security Measures 🔐

- All tokens are handled securely with cookies
- Backend routes are protected with middleware
- Sensitive keys are stored in environment variables

Future Scope 🚀

- Integrate real-time map views and route planning
- Use image recognition to tag or search places by photos
- Add conversational chatbot to act as a personal travel assistant


