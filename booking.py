# booking.py
from flask import Blueprint, request, jsonify
from utils import token_required
from db import get_db_connection

booking_bp = Blueprint('booking', __name__)

@booking_bp.route('/bookings', methods=['POST'])
@token_required
def book_flight():
    data = request.get_json()
    flight_number = data.get('flight_number')
    passenger_name = data.get('passenger_name')
    seats_booked = data.get('seats_booked')

    if not flight_number or not passenger_name or not seats_booked:
        return jsonify({'message': 'flight_number, passenger_name and seats_booked are required'}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT * FROM flights WHERE flight_number = %s", (flight_number,))
        flight = cursor.fetchone()

        if not flight:
            return jsonify({'message': 'Flight not found'}), 404
        if flight['seats'] < seats_booked:
            return jsonify({'message': 'Not enough seats available'}), 400

        cursor.execute("INSERT INTO bookings (flight_number, passenger_name, seats_booked) VALUES (%s, %s, %s)",
                       (flight_number, passenger_name, seats_booked))
        cursor.execute("UPDATE flights SET seats = seats - %s WHERE flight_number = %s",
                       (seats_booked, flight_number))

        conn.commit()
        return jsonify({'message': 'Booking successful'}), 201

    except Exception as e:
        return jsonify({'message': str(e)}), 500
    finally:
        cursor.close()
        conn.close()
