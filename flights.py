from flask import Blueprint, jsonify
from db import get_db_connection


flights_bp = Blueprint('flights', __name__)

@flights_bp.route("/flights", methods=["GET"])
def get_flights():
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT * FROM flights")
    flights = cursor.fetchall()
    result = []
    for flight in flights:
        result.append({
            "flight_number": flight[0],
            "route": flight[1],
            "price": float(flight[2]),
            "seats": flight[3],
            "rating": float(flight[4]) if flight[4] else None,
        })
    return jsonify(result)


