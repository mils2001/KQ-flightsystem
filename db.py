import mysql.connector
from flask import g

# 🔗 Database connection setup
def get_db_connection():
    """Establish a MySQL connection and store it in Flask's g object."""
    if 'db' not in g:
        g.db = mysql.connector.connect(
            host="localhost",
            user="Awilo9701",
            password="Awilo9701@",
            database="kenya_airways"
        )
    return g.db

# 🔒 Close DB connection when app context ends
def close_db(e=None):
    """Close the MySQL connection stored in g, if it exists."""
    db = g.pop('db', None)
    if db is not None:
        db.close()

# 🏗️ Create necessary tables if they don't exist
def create_tables():
    """Create the users, flights, and bookings tables with appropriate schemas."""
    db = get_db_connection()
    cursor = db.cursor()

    # Users table: Stores user information with authentication and profile details
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) NOT NULL UNIQUE,
            email VARCHAR(255),
            password_hash VARCHAR(255) NOT NULL,
            is_admin TINYINT(1) DEFAULT 0,
            role VARCHAR(10) DEFAULT 'user',
            profile_pic VARCHAR(255),
            balance DECIMAL(10,2) DEFAULT 0.00,
            phone_number VARCHAR(15)
        );
    """)

    # Flights table: Stores flight details including date, time, and class
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS flights (
            id INT AUTO_INCREMENT PRIMARY KEY,
            flight_number VARCHAR(10) UNIQUE,
            route VARCHAR(255),
            price DECIMAL(10,2),
            seats_available INT,
            rating DECIMAL(3,2),
            flight_date DATE,
            flight_time TIME,
            class ENUM('Economy', 'Business', 'First') DEFAULT 'Economy'
        );
    """)

    # Bookings table: Stores booking information linking users and flights
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS bookings (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            flight_id INT,
            seat_class ENUM('Economy', 'Business', 'First') DEFAULT 'Economy',
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (flight_id) REFERENCES flights(id)
        );
    """)

    db.commit()
    cursor.close()
