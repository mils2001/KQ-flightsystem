from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from db import get_db_connection

flights_bp = Blueprint('flights', __name__, url_prefix='/api/flights')

# =======================
# GET ALL FLIGHTS
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

