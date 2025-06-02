import mysql.connector
from flask import g

def get_db_connection():
    if 'db' not in g:
        g.db = mysql.connector.connect(
            host="localhost",
            user="Awilo9701",
            password="Awilo9701@",
            database="kenya_airways"
        )
    return g.db

def close_db(e=None):
    db = g.pop('db', None)
    if db is not None:
        db.close()

def create_tables():
    db = get_db_connection()
    cursor = db.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(100),
            password_hash VARCHAR(255)
        );
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS flights (
            id INT AUTO_INCREMENT PRIMARY KEY,
            route VARCHAR(255),
            price DECIMAL(10,2),
            seats_available INT,
            rating DECIMAL(3,2)
        );
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS bookings (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user VARCHAR(255),
            flight_id INT,
            FOREIGN KEY (flight_id) REFERENCES flights(id)
        );
    """)

    db.commit()
    cursor.close()

