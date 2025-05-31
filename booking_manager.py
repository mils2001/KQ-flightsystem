from db import get_connection
import mysql.connector

def book_seat(passenger_name, flight_number):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        # Check seat availability
        cursor.execute("SELECT seats FROM flights WHERE flight_number = %s", (flight_number,))
        result = cursor.fetchone()

        if not result:
            print("Flight not found.")
            return

        seats_available = result[0]

        if seats_available <= 0:
            print("No seats available for this flight.")
            return

        # Book seat
        cursor.execute("""
            INSERT INTO bookings (passenger_name, flight_number)
            VALUES (%s, %s)
        """, (passenger_name, flight_number))

        # Update seat count
        cursor.execute("""
            UPDATE flights SET seats = seats - 1 WHERE flight_number = %s
        """, (flight_number,))

        conn.commit()
        print(f"{passenger_name} booked successfully on flight {flight_number}.")

    except mysql.connector.Error as err:
        print("Error:", err)
    finally:
        cursor.close()
        conn.close()

def cancel_booking(passenger_name, flight_number):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        # Check if booking exists
        cursor.execute("""
            SELECT * FROM bookings WHERE passenger_name = %s AND flight_number = %s
        """, (passenger_name, flight_number))
        booking = cursor.fetchone()

        if not booking:
            print(f"No booking found for {passenger_name} on flight {flight_number}.")
            return

        # Delete booking
        cursor.execute("""
            DELETE FROM bookings WHERE passenger_name = %s AND flight_number = %s
        """, (passenger_name, flight_number))

        # Restore seat
        cursor.execute("""
            UPDATE flights SET seats = seats + 1 WHERE flight_number = %s
        """, (flight_number,))

        conn.commit()
        print(f"Booking for {passenger_name} on flight {flight_number} cancelled.")

    except mysql.connector.Error as err:
        print("Error:", err)
    finally:
        cursor.close()
        conn.close()

