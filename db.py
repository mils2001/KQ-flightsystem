import mysql.connector

def get_db_connection():
    return mysql.connector.connect(
        host='localhost',
        user='Awilo9701',
        password='Awilo9701@',
        database='kenya_airways'
    )

def create_tables():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS flights (
            id INT AUTO_INCREMENT PRIMARY KEY,
            route VARCHAR(100),
            price DECIMAL(10,2),
            seats_available INT,
            rating FLOAT DEFAULT 0
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS bookings (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user VARCHAR(50),
            flight_id INT,
            FOREIGN KEY (flight_id) REFERENCES flights(id)
        )
    ''')

    conn.commit()
    conn.close()

