from flask import Blueprint, request, jsonify
from db import get_db_connection

bookings_bp = Blueprint('bookings', __name__)

@bookings_bp.route('/api/bookings', methods=['GET'])
def get_bookings():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT * FROM bookings")
    bookings = cursor.fetchall()

    cursor.close()
    return jsonify(bookings)


@bookings_bp.route('/api/bookings', methods=['POST'])
def create_booking():
    data = request.get_json()
    user_id = data.get('user_id')
    flight_number = data.get('flight_number')
    seat_number = data.get('seat_number')

    if not all([user_id, flight_number, seat_number]):
        return jsonify({'error': 'Missing booking fields'}), 400

    db = get_db_connection()
    cursor = db.cursor()

    try:
        cursor.execute(
            "INSERT INTO bookings (user_id, flight_number, seat_number) VALUES (%s, %s, %s)",
            (user_id, flight_number, seat_number)
        )
        db.commit()
    except Exception as e:
        db.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()

    return jsonify({'message': 'Booking created successfully'}), 201

