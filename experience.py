from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from db import get_db_connection
from datetime import datetime

experience_bp = Blueprint('experience', __name__, url_prefix='/api/experience')

@experience_bp.route('/post', methods=['POST'])
@jwt_required()
def post_experience():
    user_id = get_jwt_identity()
    data = request.get_json()

    flight_number = data.get('flight_number')
    experience_text = data.get('experience')
    rating = data.get('rating')  # optional

    if not flight_number or not experience_text:
        return jsonify({"error": "Flight number and experience text are required"}), 400

    if rating is not None and (rating < 1 or rating > 5):
        return jsonify({"error": "Rating must be between 1 and 5"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO flight_experiences (user_id, flight_number, experience_text, rating, created_at)
        VALUES (%s, %s, %s, %s, %s)
    """, (user_id, flight_number, experience_text, rating, datetime.utcnow()))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"msg": "Experience posted successfully"}), 201
