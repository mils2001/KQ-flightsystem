from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from db import get_db_connection

profile_bp = Blueprint('profile', __name__, url_prefix='/api/profile')

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

@profile_bp.route('/update', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    data = request.get_json()

    profile_pic = data.get('profile_pic')
    balance = data.get('balance')
    phone_number = data.get('phone_number')

    if not profile_pic and balance is None and not phone_number:
        return jsonify({"error": "No update data provided"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    update_fields = []
    values = []

    if profile_pic:
        update_fields.append("profile_pic = %s")
        values.append(profile_pic)
    if balance is not None:
        update_fields.append("balance = %s")
        values.append(balance)
    if phone_number:
        update_fields.append("phone_number = %s")
        values.append(phone_number)

    update_query = f"UPDATE users SET {', '.join(update_fields)} WHERE id = %s"
    values.append(user_id)

    cursor.execute(update_query, tuple(values))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"msg": "Profile updated successfully"}), 200

