from db import get_connection
import mysql.connector

def add_flight(flight_number, route, price, seats):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO flights (flight_number, route, price, seats, rating)
            VALUES (%s, %s, %s, %s, NULL)
        """, (flight_number, route, price, seats))
        conn.commit()
        print(f"Flight {flight_number} added successfully.")
    except mysql.connector.Error as err:
        print("Error:", err)
    finally:
        cursor.close()
        conn.close()

def view_flights():
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM flights")
        flights = cursor.fetchall()
        if not flights:
            print("No flights found.")
        else:
            print("\nAvailable Flights:")
            for flight in flights:
                print(f"Flight: {flight[0]}, Route: {flight[1]}, Price: KES {flight[2]}, Seats: {flight[3]}, Rating: {flight[4]}")
    except mysql.connector.Error as err:
        print("Error:", err)
    finally:
        cursor.close()
        conn.close()

