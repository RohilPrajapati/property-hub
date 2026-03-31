### 🛠️ Key Features
- Feature-Based Architecture: Code is organized by domain (auth, properties) making it easy to find and scale logic.

- Persistent Auth: JWT-based authentication with local storage synchronization.

- Dynamic Filtering: Real-time search by suburb, price range, and property type.

- Modern UI: Responsive design using Tailwind CSS v4 and Ant Design notifications.

- Infinite Loading: Cursor-based pagination for smooth performance.

### Project Structure

```
src/
├── assets/             # Static assets like images and global SVG icons
├── components/         # Shared global components (e.g., Navbar)
├── configs/            # Application-wide configurations and constants
├── helpers/            # Utility functions (e.g., Auth status, Price formatters)
├── layouts/            # Route wrappers (AuthLayout vs PublicLayout)
├── pages/              # Main feature-based views
│   ├── auth/           # Authentication Feature
│   │   ├── api/        # Login API calls
│   │   ├── components/ # LoginForm, Social Login buttons
│   │   └── Login.jsx   # Main Login Page View
│   └── properties/     # Property Feature
│       ├── api/        # Fetch listings, search, and detail API calls
│       ├── components/ # PropertyCard, DetailView components
│       ├── PropertyListing.jsx # Main Search/Grid View
│       └── PropertyDetail.jsx  # Single Property Detailed View
├── plugins/            # Third-party configurations (Axios Interceptors)
├── routers/            # React Router configuration and route definitions
├── App.jsx             # Root component
├── index.css           # Global styles and Tailwind directives
└── main.jsx            # Application entry point
```

### 🚀 Getting Started

1. Installation
```bash
npm install
```
2. Configuration
Create a .env file in the root directory:
```
VITE_API_URL=http://localhost:8000
```
3. Development
```bash
npm run dev
```

4. Development
```bash
npm run build
```