from flask import Blueprint, request, jsonify
from utils import token_required
from db import get_db_connection

flights_bp = Blueprint('flights', __name__)

@flights_bp.route('/flights', methods=['GET'])
@token_required
def get_flights():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM flights WHERE seats > 0")
        flights = cursor.fetchall()
        return jsonify(flights), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500
    finally:
        cursor.close()
        conn.close()
