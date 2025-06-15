from flask import Blueprint, request, jsonify
from db import get_db_connection
from notifications import send_booking_sms
from alarm_scheduler import schedule_alarm
from flask_jwt_extended import jwt_required, get_jwt_identity

bookings_bp = Blueprint('bookings', __name__)

# ✅ Create a booking
@bookings_bp.route('/', methods=['POST'])
@jwt_required()
def create_booking():
    data = request.get_json()
    flight_number = data.get("flight_number")
    seat_number = data.get("seat_number")
    seats_booked = data.get("seats_booked")
    user_id = get_jwt_identity()

    if not flight_number or not seat_number or not seats_booked:
        return jsonify({"error": "Missing booking details"}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute("SELECT flight_name, flight_time FROM flights WHERE flight_number = %s", (flight_number,))
        flight = cursor.fetchone()

        if not flight:
            return jsonify({"error": "Flight not found"}), 404

        flight_name = flight["flight_name"]
        flight_time = flight["flight_time"]

        cursor.execute("SELECT phone_number FROM users WHERE id = %s", (user_id,))
        user = cursor.fetchone()

        if not user or not user["phone_number"]:
            return jsonify({"error": "User phone number not found"}), 404

        user_phone = user["phone_number"]

        cursor.execute("""
            INSERT INTO bookings (user_id, flight_number, seat_number, seats_booked)
            VALUES (%s, %s, %s, %s)
        """, (user_id, flight_number, seat_number, seats_booked))
        conn.commit()

        # Send SMS and schedule alarm
        message = f"Your flight '{flight_name}' is confirmed for {flight_time}."
        send_booking_sms(user_phone, flight_name, flight_time)

        schedule_alarm(user_phone, flight_name, flight_time)

        return jsonify({
            "message": f"Booking created successfully for flight {flight_number}, seat {seat_number}"
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()


# ✅ Get all bookings for the logged-in user
@bookings_bp.route('/', methods=['GET'])
@jwt_required()
def get_bookings():
    user_id = get_jwt_identity()

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

