# Restaurant Booking System

A web-based backend for managing restaurant reservations, menus and orders. This project allows users to browse restaurants, view menu, add items to their cart, place orders, and manage reservations efficiently.

---

## Features
- **Restaurant Management**: View restaurant details by name or dishes.
- **Menu Management**: View and manage menus for different restaurants.
- **Cart System**: Add items to the cart, modify quantities, and calculate total costs.
- **Order Management**: Place orders and view pending orders.

---

## Technologies Used
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Environment Management**: dotenv
- **Other Libraries**: express-session and jest

---

## Setup Instructions

### Prerequisites
Make sure you have the following installed:
1. Node.js
2. PostgreSQL
3. Git

### Clone the Repository
```bash
git clone https://github.com/anudhull/Restaurant-Booking-System.git
cd Restaurant-Booking-System
```

### Install Dependencies
```bash
npm install
```

### Set Up the Database
Create the database and tables in PostgreSQL, can refer migrationScript.sql

### Configure Environment Variables
Update `.env` file in the project root with the local details

### Start the Server
```bash
npm start
```

### Test the functions
```bash
npm test
```


