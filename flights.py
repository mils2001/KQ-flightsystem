from flask import Blueprint, jsonify
from db import get_db_connection

flights_bp = Blueprint('flights', __name__)

@flights_bp.route("/flights", methods=["GET"])
def get_flights():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)  # enable dict-based access
    cursor.execute("SELECT * FROM flights")
    flights = cursor.fetchall()
    result = []
    for flight in flights:
        result.append({
            "flight_number": flight["flight_number"],
            "route": flight["route"],
            "price": float(flight["price"]),
            "seats": flight["seats"],
            "rating": float(flight["rating"]) if flight["rating"] else None,
        })
    return jsonify(result)

