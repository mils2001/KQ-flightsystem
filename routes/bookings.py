# In routes/bookings.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

bookings_bp = Blueprint('bookings', __name__)

@bookings_bp.route('/', methods=['POST'])
@jwt_required()
def create_booking():
    current_user = get_jwt_identity()
    data = request.get_json()
    flight_number = data.get("flight_number")
    seat_number = data.get("seat_number")
    seats_booked = data.get("seats_booked")

    # Your booking logic here

    return jsonify({
        "message": f"Booking created for {flight_number}, seat {seat_number}, by user {current_user}"
    }), 201

