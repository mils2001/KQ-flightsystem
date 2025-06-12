from flask import Blueprint, request, jsonify
from auth import token_required
from db import get_db_connection
import mysql.connector
from flask_jwt_extended import jwt_required, get_jwt_identity

bookings_bp = Blueprint('bookings', __name__)

# ✅ Create a new booking
@bookings_bp.route('/', methods=['POST'])
@token_required
def create_booking(user_id):
    data = request.get_json()
    flight_number = data.get("flight_number")
    seat_number = data.get("seat_number")
    seats_booked = data.get("seats_booked")

    if not flight_number or not seat_number or not seats_booked:
        return jsonify({"error": "Missing booking details"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            INSERT INTO bookings (user_id, flight_number, seat_number, seats_booked)
            VALUES (%s, %s, %s, %s)
        """, (user_id, flight_number, seat_number, seats_booked))
        conn.commit()

        return jsonify({
            "message": f"Booking created successfully for flight {flight_number}, seat {seat_number}"
        }), 201

    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500

    finally:
        cursor.close()
        conn.close()


@bookings_bp.route('/', methods=['GET'])
@jwt_required()
def get_bookings():
    user_id = get_jwt_identity()  # This is enough!

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute("SELECT * FROM bookings WHERE user_id = %s", (user_id,))
        bookings = cursor.fetchall()
        return jsonify({"bookings": bookings}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()

