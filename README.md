# 🚀 Smart Energy Meter Webpage

Welcome to the Smart Energy Meter Webpage repository! The website is dedicated to showcasing a Smart Energy Metering System. This system is designed to provide real-time energy consumption monitoring and analysis. It allows users to track their electricity usage and manage energy consumption more effectively, helping them to make informed decisions about energy-saving practices.

--- 

### **Table of Contents**

1.[Project Overview](#project-overview)

2.[Features](#-features)

3.[Technologies Used](#-technologies-used)

4.[Installation](#-installation)

5.[Directory Structure](#-directory-structure)

6.[Usage]()

7.[Contact](#contact)

---

## **Project Overview**

This repository contains the source code for the Smart Energy Meter Webpage. The website is designed to:

- **Provide detailed information about the Smart Energy Meter** and its capabilities.
- **Highlight the product's features and benefits**, including real-time energy consumption monitoring and data analytics.
- **Offer a user-friendly interface** for potential customers and partners to learn more about the energy meter.
- **Serve as a platform for integrating IoT-based energy monitoring solutions** that help users optimize their energy usage and promote sustainability.

The site is built using the MERN stack (MongoDB, Express.js, React, Node.js) along with SQL for managing structured data, ensuring reliable and scalable performance.

The live site is hosted at: https://smartenergymeter.techasiamechatronics.com/.

---

## 🌟 **Features**

- **Responsive Design: Optimized for desktop, tablet, and mobile devices.**
- **Product Showcase: Detailed descriptions and visuals of the smart energy meter.**
- **Interactive Elements: Buttons, forms, and animations for user engagement.**
- **Dynamic Content: JavaScript-powered dynamic updates for real-time data display .**
- **Cross-Browser Compatibility: Tested on major browsers like Chrome, Firefox, and Safari.**

---

## **Technologies Used**

1.**Backend**

**Core**

- **Node.js**: JavaScript runtime.
- **Express.js**: Web framework for building APIs.
- **ES6 Modules**: Modern JavaScript module syntax.

**Authentication**

- **Google OAuth**: Google-based authentication.
- **JWT**: JSON Web Tokens for secure authentication.
- **Bcrypt.js**: Password hashing.
- **Express Session**: Session management.
- **Cookie Parser**: Parse cookies in requests.

**Database and Storage**

- **MySQL**: Relational database.
- **Cloudinary**: Media file storage and management.
- **Multer**: File upload handling.

**APIs and External Services**

- **Axios**: HTTP client for API requests.
- **Nodemailer**: Send emails.

**Utilities**

- **Dotenv**: Load environment variables.
- **Moment.js**: Date and time manipulation.
- **CORS**: Enable Cross-Origin Resource Sharing.

**Development Tools**
- **Nodemon**: Automatically restart the server during development.

---

2 **Frontend**

**Core**

- **React**: JavaScript library for building user interfaces.
- **Vite**: Fast build tool for modern web development.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Type: Module**: ES6 module syntax (import/export).

**State Management**

- **Redux Toolkit**: State management library.
- **Redux Persist**: Persist Redux state to local storage.

**Routing**

- **React Router DOM**: Client-side routing.
- **React Router Hash Link**: Smooth scrolling to hash links.

**UI Components**

- **Material-UI (MUI)**: React component library.
- **shadcn/ui**: Customizable UI components.
- **Lucide React**: Beautiful and customizable icons.
- **React Icons**: Popular icon library.

**Charts and Data Visualization**

- **Recharts**: Composable charting library.
- **Chart.js**: Simple yet flexible charting library.

**3D Rendering**

- **Three.js**: 3D library for the web.
- **React Three Fiber**: React renderer for Three.js.
- **Drei**: Useful helpers for React Three Fiber.

**Animations**
- **GSAP**: Animation library for smooth transitions.
- **Framer Motion**: Animation library for React.

**Authentication**

- **React OAuth Google**: Google OAuth integration.
- **JWT Decode**: Decode JWT tokens.

**Notifications**

- **React Toastify**: Toast notifications.

**Utilities**

- **Axios**: HTTP client for API requests.
- **React Helmet**: Manage document head (e.g., meta tags).
- **React Scroll**: Smooth scrolling.
- **React Cookie**: Manage cookies in React.

**Development Tools**

- **PostCSS**: CSS processing.
- **Autoprefixer**: Add vendor prefixes to CSS.

--

## 📋 **Installation Guide**

### Prerequisites

Ensure that you have the following installed on your system:
- **Node.js** (v14 or higher)
- **npm** (Node Package Manager)

---

### Step-by-Step Setup

#### 1. Clone the repository

To get started, clone the repository to your local machine:

```bash
git clone https://github.com/techAsia12/webpage.git
cd webpage
```

### 2. 🚀 Backend Setup (Node.js)

Ready to get the backend running? Follow these steps to start the **Node.js** server and power your app! 💻✨

#### 1. **Navigate to the Backend Directory**:

Let’s get to the **backend** directory where all the magic happens:

```bash
cd backend
```

#### 2. **Install Backend Dependencies**:

Now that you're in the backend directory, let’s install all the dependencies we need. Don’t worry, **npm** (Node Package Manager) will take care of everything for you!

```bash
npm install
```

#### 3.**Start the Backend Server**:

All set up? Awesome! 🚀 Now, let’s start the Node.js backend server. With one simple command, your backend will come to life:

```bash
npm start
```


### 4. **Save Changes**:
Once you’ve pasted the section, make sure to **save** the file if you’re working locally.

- If you're working on GitHub directly, scroll to the bottom and add a commit message like "Updated backend setup section" and click **Commit changes**.

### 5. **View the Result**:
Once the changes are saved, you can view the updated **README.md** in your project folder or on GitHub. Your **Backend Setup** section will now look more attractive and engaging.

Let me know if you need help with any other part of the process! 😊

### 3. 🎨 Frontend Setup (HTML/CSS/JS)

Let's bring the **frontend** to life! 🌟 Follow these steps to set up and run the frontend of your application. All you need is **npm** and a browser! 🚀

#### 1. **Navigate to the Frontend Directory**:

Head over to the **frontend** directory, where the magic happens. This is where all the HTML, CSS, and JavaScript are working together to give your app its look and feel:

```bash
cd frontend
```

#### 2. **Install Frontend Dependencies**:

Now, it's time to install the **dependencies** for the frontend. npm will install all the required packages for the app to function smoothly. 🌈

```bash
npm install
```

This will install the libraries and tools that will power the frontend. 📦🔧

#### 3. **Start the Frontend Development Server**:

All set? It's showtime! 🎬 Start the frontend development server with the following command:

```bash
npm start
```

This will launch the frontend at http://localhost:5173/ in your browser. 🎉

The server will automatically reload if you make changes to the frontend files. Now your frontend will be fully connected to the backend, fetching data and displaying it in real time! 🌐

---

## 🗂 **Directory Structure**

Here’s an overview of the directory structure of the project:

#### **Backend Directory Structure**

```bash
backend/
├── node_modules/            # Installed dependencies
├── public/                  # Static files and temporary storage
│   └── temp/                # Temporary storage for profile images before uploading to Cloudinary
├── src/                     # Source code
│   ├── controllers/         # Request handlers
│   │   ├── admin.controller.js
│   │   └── user.controller.js
│   ├── db/                  # Database connection and models
│   │   └── index.js
│   ├── middleware/          # Custom middleware
│   │   ├── authCode.middleware.js
│   │   ├── authUser.middleware.js
│   │   ├── errorHandling.middleware.js
│   │   └── multer.middleware.js
│   ├── routes/              # API routes
│   │   ├── admin.routes.js
│   │   └── user.routes.js
│   ├── utils/               # Utility functions and helpers
│   │   ├── ApiError.js
│   │   ├── ApiResponse.js
│   │   ├── asyncHandler.js
│   │   ├── cloudinary.js
│   │   └── googleConfig.js
│   ├── app.js               # Main application configuration
│   └── index.js             # Entry point for the backend server
├── .env                     # Environment variables
├── .gitignore               # Git ignore file
├── package-lock.json        # Lock file for dependencies
└── package.json             # Project dependencies and scripts
```
**Explanation of the Directory Structure**
1. **node_modules/**
- Contains all the installed dependencies for the project.

- Automatically generated when you run npm install.

2. **public/**
- Stores static files like images, fonts, and other assets.

  - **temp/**: A temporary folder for storing profile images before they are uploaded to Cloudinary. Files in this folder are deleted after the upload process.

3. **src/**
- The main source code for the backend application.

  - **controllers/**
    - Contains the logic for handling incoming requests.
    
      - **admin.controller.js**: Handles admin-specific operations.
      - **user.controller.js**: Handles user-related operations (e.g., authentication, profile management).
  
  - **db/**
    - Manages the database connection and models.
    
      - **index.js**: Configures the connection to the database (e.g., MongoDB).
  
  - **middleware/**
    - Contains custom middleware functions for processing requests.
    
      - **authCode.middleware.js**: Middleware for handling authentication codes.
      - **authUser.middleware.js**: Middleware for authenticating users.
      - **errorHandling.middleware.js**: Middleware for handling errors globally.
      - **multer.middleware.js**: Middleware for handling file uploads using Multer.
  
  - **routes/**
    - Defines the API endpoints and maps them to their respective controllers.
    
      - **admin.routes.js**: Routes for admin-related endpoints.
      - **user.routes.js**: Routes for user-related endpoints.
  
  - **utils/**
    - Contains utility functions and helpers.
    
      - **ApiError.js: Custom error class for API errors.**
      - **ApiResponse.js: Utility for sending consistent API responses.**
      - **asyncHandler.js: Wrapper for handling asynchronous functions.**
      - **cloudinary.js: Utility for uploading files to Cloudinary.**
      - **googleConfig.js: Configuration for Google OAuth.**
  
  - **app.js**
    - Configures the Express application (e.g., middleware, routes).
  
  - **index.js**
    - The entry point for the backend server. Starts the server and listens for incoming requests.

4. **.env**
- Stores environment variables (e.g., database connection string, API keys).

5. **.gitignore**
- Specifies files and folders to be ignored by Git (e.g., node_modules/, .env).

6. **package-lock.json**
- Automatically generated file that locks dependency versions.

7. **package.json**
- Contains project metadata, dependencies, and scripts (e.g., npm start, npm run dev).

#### **Frontend Directory Structure**
```bash
frontend/
├── dist/                    # Build output (generated by Vite)
├── node_modules/            # Installed dependencies
├── public/                  # Static assets (e.g., images, fonts)
├── src/                     # Source code
│   ├── app/                 # Redux store and state management
│   │   └── store.js
│   ├── assets/              # Static assets (e.g., images, icons)
│   ├── components/          # Reusable UI components
│   │   ├── Admin/           # Admin-specific components
│   │   │   ├── AddDets.jsx
│   │   │   ├── AdminAddPhone.jsx
│   │   │   ├── AdminSignup.jsx
│   │   │   ├── BillDets.jsx
│   │   │   ├── CostRange.jsx
│   │   │   └── Home.jsx
│   │   ├── Dashboard/       # Dashboard-specific components
│   │   │   ├── Barchart.jsx
│   │   │   ├── CardView.jsx
│   │   │   └── Meter.js
│   │   ├── LandingPage/     # Landing page components
│   │   │   ├── Features.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Slider.jsx
│   │   │   └── Working.jsx
│   │   ├── Login/           # Login-related components
│   │   │   ├── Addphone.jsx
│   │   │   └── ForgotPassword.jsx
│   │   ├── Navbar/          # Navbar components
│   │   │   ├── Navbar.jsx
│   │   │   ├── NavDial.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── SideBarAnimation.jsx
│   │   ├── ThemeToggle.jsx
│   │   └── Update.jsx
│   ├── constants/           # Constants and configuration
│   │   └── index.js
│   ├── Features/            # Redux slices and state management
│   │   ├── auth/            # Authentication slice
│   │   │   └── auth.slice.js
│   │   ├── billDets/        # Bill details slice
│   │   │   └── billDets.slice.js
│   │   ├── pages/           # Pages slice
│   │   │   └── pages.slice.js
│   │   └── theme/           # Theme slice
│   │       └── theme.slice.js
│   ├── pages/               # Page components
│   │   ├── AdminLayout.jsx
│   │   ├── AdminPage.jsx
│   │   ├── ContactPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── DownloadPage.jsx
│   │   ├── LandingPage.jsx
│   │   ├── Layout.jsx
│   │   ├── LoginPage.jsx
│   │   ├── ServicesPage.jsx
│   │   └── SignupPage.jsx
│   ├── utils/               # Utility functions and helpers
│   │   ├── index.js
│   │   └── routes.jsx
│   ├── AdminAuth.jsx        # Admin authentication component
│   ├── App.jsx             # Main application component
│   ├── AuthLogin.jsx       # User authentication component
│   ├── index.css           # Global styles
│   └── main.jsx            # Entry point for the frontend application
├── .env                    # Environment variables
├── .gitignore              # Git ignore file
├── eslint.config.js        # ESLint configuration
├── image.png               # Static image (if needed)
├── index.html              # HTML template
├── package-lock.json       # Lock file for dependencies
├── package.json            # Project dependencies and scripts
├── postcss.config.js       # PostCSS configuration
├── README.md               # Project documentation
├── tailwind.config.js      # Tailwind CSS configuration
└── vite.config.js          # Vite configuration
```
**Explanation of the Directory Structure**
1.** dist/**
- Contains the production-ready build files generated by Vite.

- Automatically created when you run npm run build.

2. **node_modules/**
- Contains all the installed dependencies for the project.

- Automatically generated when you run npm install.

3. **public/**
- Stores static assets like images, fonts, and other files that don’t need processing.

4. ** src/**
- The main source code for the frontend application.
  
  - **app/**
    - Contains the Redux store configuration.
    
    - **store.js**: Configures the Redux store.
  
  - **assets/**
    - Stores static assets like images, icons, and other media files.
  
  - **components/**
    - Contains reusable UI components organized by feature or page.
    
      - **Admin/**: Components specific to the admin interface.
      - **Dashboard/**: Components for the dashboard.
      - **LandingPage/**: Components for the landing page.
      - **Login/**: Components for the login and authentication flow.
      - **Navbar/**: Components for the navigation bar and sidebar.
  
  - **constants/**
    - Contains constants and configuration values.
    
      - **index.js**: Exports constants used across the application.
  
  - **Features/**
    - Contains Redux slices for state management.
    
      - **auth/**: Slice for authentication state.
      - **billDets/**: Slice for bill details state.
      - **pages/**: Slice for page-related state.
      - **theme/**: Slice for theme management.
  
  - **pages/**
    - Contains page components that represent different routes in the application.
      
      - **AdminLayout.jsx**: Layout for admin pages.
      - **AdminPage.jsx**: Main admin page.
      - **ContactPage.jsx**: Contact page.
      - **DashboardPage.jsx**: Dashboard page.
      - **DownloadPage.jsx**: Download page.
      - **LandingPage.jsx**: Landing page.
      - **Layout.jsx**: Main layout for the application.
      - **LoginPage.jsx**: Login page.
      - **ServicesPage.jsx**: Services page.
      - **SignupPage.jsx**: Signup page.
  
  - **utils/**
    - Contains utility functions and helpers.
    
     - **index.js**: Exports utility functions.
     - **routes.jsx**: Defines the routing configuration for the application.
  
  - **AdminAuth.jsx**
    - Handles admin authentication logic.
  
  - **App.jsx**
    - The main application component that renders the entire app.
  
  - **AuthLogin.jsx**
    - Handles user authentication logic.
  
  - **index.css**
    - Global styles for the application.
  
  - **main.jsx**
    - The entry point for the frontend application. Renders the App component into the DOM.

5. **.env**
- Stores environment variables (e.g., API keys, base URLs).

6. **.gitignore**
- Specifies files and folders to be ignored by Git (e.g., node_modules/, .env).

7. **eslint.config.js**
- Configuration file for ESLint (code linting).

8. **index.html**
- The HTML template for the application.

9. **package-lock.json**
- Automatically generated file that locks dependency versions.

10. **package.json**
- Contains project metadata, dependencies, and scripts (e.g., npm start, npm run dev).

11. **postcss.config.js**
- Configuration file for PostCSS (used with Tailwind CSS).

12. **tailwind.config.js**
- Configuration file for Tailwind CSS.

13. **vite.config.js**
- Configuration file for Vite (build tool).

---

## **Usage**

- **Explore Product Features**:
  - Learn about the Smart Energy Meter’s features and benefits.
  - View real-time energy consumption data and monitoring capabilities.

- **Data Visualization**:
 - Access graphs and charts that show energy usage trends and patterns over time.

- **Energy Optimization Tips**:

 - Get suggestions on how to reduce energy consumption and optimize usage for cost savings.

- **For Customers & Partners**:

  - **Sign Up / Log In**: Register or log in to access personalized energy consumption data.
  - **Admin Panel**: For administrators and partners to manage users, monitor energy data, and generate detailed reports.
    
---

## **Contact**

If you have any questions or suggestions, feel free to reach out:

- **GitHub**: [techAsia12](https://github.com/techAsia12)
- **Website**: [TechAsia Mechatronics](https://techasiamechatronics.com/)
- **Email**: [techasiamechatronics1@gmail.com](techasiamechatronics1@gmail.com)
