from flask import Blueprint, request, jsonify
import mysql.connector
from db import get_db_connection
from flask_jwt_extended import jwt_required

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
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        query = "SELECT * FROM flights WHERE route LIKE %s"
        values = [f"{origin} to {destination}"]

        if date:
            query += " AND flight_date = %s"
            values.append(date)

        if flight_class:
            query += " AND flight_class = %s"
            values.append(flight_class)

        cursor.execute(query, values)
        results = cursor.fetchall()
        return jsonify(results), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

