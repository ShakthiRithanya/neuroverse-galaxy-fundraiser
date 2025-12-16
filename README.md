# Neuroverse Galaxy Fundraiser

A comprehensive web application designed to manage a college fundraising event. This platform facilitates student registrations, stall bookings, and donation tracking to support a charitable cause.

## 🌟 Features

### User / Student Portal
*   **Stall Exploration**: Browse detailed information about available stalls (Music/Karaoke, VR Experience, Interaction/AI).
*   **Booking System**: Seamlessly book packages (Basic/Premium) for various stalls.
*   **Payment Integration**: Select between Cash or Google Pay payment methods.
    *   *Note: Payments are manually verified by admins. The user interface updates automatically once approved.*
*   **User Authentication**: Secure login and registration for students.
*   **Feedback**: Submit feedback about the event.

### Admin Dashboard
*   **Real-time Management**: View all registrations and bookings in one place.
*   **Payment Control**: Manually toggle payment status (Mark Paid / Mark Pending).
*   **Event Settings**: Control the visibility of specific stalls (Reveal/Hide).
*   **Statistics**: View key metrics like total revenue and registration counts.

## 🛠️ Tech Stack

*   **Frontend**: React (Vite), CSS3 (Glassmorphism design), Lucide React (Icons).
*   **Backend**: Node.js, Express.js.
*   **Database**: SQLite (managed via Prisma ORM).
*   **Language**: TypeScript / JavaScript.

## 🚀 Getting Started

### Prerequisites
*   Node.js (v16 or higher)
*   npm (Node Package Manager)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/ShakthiRithanya/neuroverse-galaxy-fundraiser.git
    cd neuroverse-galaxy-fundraiser
    ```

2.  **Setup Backend**
    ```bash
    cd backend
    npm install
    
    # Initialize Database
    npx prisma migrate dev --name init
    
    # Seed Admin User (Automated on server start)
    npm run dev
    ```
    *The backend runs on `http://localhost:5000`*

3.  **Setup Frontend**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
    *The frontend runs on `http://localhost:5173`*

### Default Admin Credentials
*   **Username (Email)**: `shakthirithanyasr07@gmail.com`
*   **Password**: `Rithanya`

## 📖 Usage Guide

1.  **Student Flow**:
    *   Register/Login as a student.
    *   Go to "Stalls", select a package, and click "Book".
    *   Choose "Cash" or "GPay" on the payment page.
    *   Wait for the Admin to confirm the payment.
    *   Once confirmed, a success message will appear.

2.  **Admin Flow**:
    *   Login via the `/login` page using admin credentials.
    *   Navigate to the Dashboard.
    *   Review pending registrations.
    *   Click "Mark Paid" once the physical cash or GPay transaction is verified.
    *   The student's screen will update instantly.

## 📂 Project Structure

```
/backend
  ├── prisma/          # Database schema and migrations
  ├── index.js         # Express server and API routes
  └── package.json     # Backend dependencies

/frontend
  ├── src/
  │   ├── components/  # Reusable UI components
  │   ├── pages/       # Page views (Home, Booking, Admin, etc.)
  │   └── App.tsx      # Main application routing
  └── package.json     # Frontend dependencies
```

## 🤝 Contribution
Developed by **SinthanAi (AIML Dept)** for the Neuroverse Galaxy Event.
