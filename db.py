import mysql.connector
from flask import g

# 🔗 Database connection setup
def get_db_connection():
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
    db = g.pop('db', None)
    if db is not None:
        db.close()

# 🏗️ Create necessary tables if they don't exist
def create_tables():
    db = get_db_connection()
    cursor = db.cursor()

    # Users table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(100),
            email VARCHAR(255) UNIQUE,
            password_hash VARCHAR(255)
        );
    """)

    # Flights table — now includes date, time, and class
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

    # Bookings table
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

