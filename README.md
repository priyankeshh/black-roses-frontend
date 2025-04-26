# Black Roses Airsoft Team Website

A premium, tactical-themed website for the Black Roses airsoft team based in Belgium.

## Project Structure

This project is organized with a clear separation between frontend and backend:

```
/
├── client/           # Frontend React application (current directory)
│   ├── src/
│   │   ├── assets/       # Images, fonts, and other static assets
│   │   ├── components/   # Reusable UI components
│   │   ├── context/      # React context providers
│   │   ├── i18n/         # Internationalization files (EN/NL)
│   │   ├── lib/          # Utility functions and services
│   │   └── pages/        # Page components
│   └── ...
│
└── server/           # Backend application (to be created)
    ├── config/       # Configuration files
    ├── controllers/  # Request handlers
    ├── models/       # MongoDB schema models
    ├── routes/       # API route definitions
    ├── middleware/   # Custom middleware
    └── utils/        # Utility functions
```

## Frontend (client)

The frontend is built with:

- **React/Next.js**: For component-based UI development
- **JavaScript**: All code is written in JavaScript (not TypeScript)
- **Tailwind CSS**: For styling
- **React Router**: For navigation
- **i18next**: For internationalization (Dutch and English)
- **Framer Motion**: For animations

## Backend (server)

The backend will be built with:

- **Node.js/Express**: For the API server
- **MongoDB**: For the database
- **Mongoose**: For MongoDB object modeling
- **JWT**: For authentication
- **Multer**: For file uploads

## Data Flow Architecture

The frontend and backend will communicate through a RESTful API:

1. **Frontend**: Makes HTTP requests to the backend API endpoints
2. **Backend**: Processes requests, interacts with the database, and returns responses
3. **Database**: Stores all persistent data (events, products, users, etc.)

## Development Workflow

1. Run the frontend and backend separately during development
2. Frontend makes API calls to the backend server
3. Use environment variables to configure API endpoints for different environments

## API Endpoints (Planned)

The backend will expose the following API endpoints:

- **Authentication**
  - `POST /api/auth/register` - Register a new user
  - `POST /api/auth/login` - Login a user
  - `GET /api/auth/me` - Get current user info

- **Events**
  - `GET /api/events` - Get all events
  - `GET /api/events/:id` - Get a specific event
  - `POST /api/events` - Create a new event (admin only)
  - `PUT /api/events/:id` - Update an event (admin only)
  - `DELETE /api/events/:id` - Delete an event (admin only)
  - `POST /api/events/:id/register` - Register for an event

- **Products**
  - `GET /api/products` - Get all products
  - `GET /api/products/:id` - Get a specific product
  - `POST /api/products` - Create a new product (admin only)
  - `PUT /api/products/:id` - Update a product (admin only)
  - `DELETE /api/products/:id` - Delete a product (admin only)

- **Contact**
  - `POST /api/contact` - Submit a contact form

## Getting Started

### Frontend

```bash
cd client
npm install
npm run dev
```

### Backend (when created)

```bash
cd server
npm install
npm run dev
```
