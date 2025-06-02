# routes/bookings.py
from flask import Blueprint, request, jsonify
from db import get_db_connection
from auth import token_required  # 🔁 Import the JWT decorator

bookings_bp = Blueprint('bookings', __name__)

@bookings_bp.route("/", methods=["POST"])
@token_required
def book_flight(user_id):
    data = request.get_json()
    flight_number = data["flight_number"]
    seat_number = data["seat_number"]
    seats_booked = data.get("seats_booked", 1)

    db = get_db_connection()
    cursor = db.cursor()

    # Get passenger name from users table
    cursor.execute("SELECT username FROM users WHERE id = %s", (user_id,))
    user = cursor.fetchone()
    if not user:
        return jsonify({"error": "User not found"}), 404

    passenger_name = user[0]

    cursor.execute(
        "INSERT INTO bookings (user_id, flight_number, seat_number, passenger_name, seats_booked) VALUES (%s, %s, %s, %s, %s)",
        (user_id, flight_number, seat_number, passenger_name, seats_booked)
    )
    db.commit()

    return jsonify({"message": "Booking successful!"}), 201

