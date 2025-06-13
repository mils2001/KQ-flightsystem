from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from db import get_db_connection

# Blueprint with proper name and prefix
profile_bp = Blueprint('profile', __name__, url_prefix='/api/profile')

# GET user profile
@profile_bp.route('/', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT id, username, email, role, is_admin, profile_pic, balance
        FROM users
        WHERE id = %s
    """, (user_id,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if not user:
        return jsonify({'error': 'User not found'}), 404

    return jsonify({'profile': user}), 200

# PUT update profile
@profile_bp.route('/update', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    data = request.get_json()

    profile_pic = data.get('profile_pic')  # image URL or base64 string
    balance = data.get('balance')          # optional

    if not profile_pic and balance is None:
        return jsonify({"error": "No update data provided"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    # Build dynamic SQL query
    update_query = "UPDATE users SET "
    values = []

    if profile_pic:
        update_query += "profile_pic = %s"
        values.append(profile_pic)

    if balance is not None:
        if profile_pic:
            update_query += ", "
        update_query += "balance = %s"
        values.append(balance)

    update_query += " WHERE id = %s"
    values.append(user_id)

    cursor.execute(update_query, tuple(values))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"msg": "Profile updated successfully"}), 200

