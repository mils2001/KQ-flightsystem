from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from db import get_db_connection

flights_bp = Blueprint('flights', __name__)

# =======================
# GET ALL FLIGHTS (e.g. for display)
# =======================
@flights_bp.route('/', methods=['GET'])
@jwt_required()
def get_all_flights():
    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT flight_number, route, flight_class, price, image_url FROM flights")
        flights = cursor.fetchall()
        return jsonify(flights), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        db.close()


# =======================
# SEARCH FLIGHTS
# =======================
@flights_bp.route('/search', methods=['GET'])
@jwt_required()
def search_flights():
    route = request.args.get('route')
    class_type = request.args.get('class_type')
    date = request.args.get('date')

    if not route:
        return jsonify({'error': 'Route is required'}), 400

    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

        query = "SELECT * FROM flights WHERE route = %s"
        values = [route]

        if date:
            query += " AND flight_date = %s"
            values.append(date)

        if class_type:
            query += " AND flight_class = %s"
            values.append(class_type)

        cursor.execute(query, values)
        results = cursor.fetchall()

        for flight in results:
            if 'flight_time' in flight:
                flight['flight_time'] = str(flight['flight_time'])
            if 'flight_date' in flight:
                flight['flight_date'] = str(flight['flight_date'])

        return jsonify(results), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        db.close()


# =======================
# BOOK FLIGHT
# =======================
@flights_bp.route('/book', methods=['POST'])
@jwt_required()
def book_flight():
    data = request.get_json()
    flight_number = data.get('flight_number')
    seats_booked = data.get('seats_booked', 1)
    passenger_name = data.get('passenger_name', 'Unknown')
    user_id = get_jwt_identity()

    if not flight_number:
        return jsonify({'error': 'Flight number is required'}), 400

    try:
        db = get_db_connection()
        cursor = db.cursor()

        # Check flight existence
        cursor.execute("SELECT * FROM flights WHERE flight_number = %s", (flight_number,))
        flight = cursor.fetchone()
        if not flight:
            return jsonify({'error': 'Flight not found'}), 404

        # Insert booking
        cursor.execute("""
            INSERT INTO bookings (user_id, flight_number, passenger_name, seats_booked)
            VALUES (%s, %s, %s, %s)
        """, (user_id, flight_number, passenger_name, seats_booked))
        db.commit()

        return jsonify({
            'message': 'Booking successful',
            'flight_number': flight_number,
            'seats_booked': seats_booked
        }), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        cursor.close()
        db.close()

