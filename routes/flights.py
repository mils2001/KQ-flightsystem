from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from db import get_db_connection

flights_bp = Blueprint('flights', __name__)

# =======================
# SEARCH FLIGHTS ROUTE
# =======================
@flights_bp.route('/flights/search', methods=['GET'])
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

        # Convert time and date fields to string
        for flight in results:
            if 'flight_time' in flight and flight['flight_time']:
                flight['flight_time'] = str(flight['flight_time'])
            if 'flight_date' in flight and flight['flight_date']:
                flight['flight_date'] = str(flight['flight_date'])

        return jsonify(results), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

