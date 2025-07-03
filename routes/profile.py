from flask import Blueprint, jsonify, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from db import get_db_connection
import qrcode
import io

profile_bp = Blueprint('profile', __name__)

@profile_bp.route('/api/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT id, username, email, phone_number, profile_pic_url, balance,
               miles_traveled, wallet_address, role
        FROM users WHERE id = %s
    """, (user_id,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if user:
        return jsonify(user), 200
    return jsonify({'message': 'User not found'}), 404




@profile_bp.route('/api/profile/qr', methods=['GET'])
@jwt_required()
def generate_qr():
    user_id = get_jwt_identity()
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT email, wallet_address FROM users WHERE id = %s", (user_id,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if not user:
        return jsonify({"message": "User not found"}), 404

    qr_data = user["wallet_address"] or user["email"] or str(user_id)

    qr = qrcode.make(qr_data)
    img_io = io.BytesIO()
    qr.save(img_io, 'PNG')
    img_io.seek(0)

    return send_file(img_io, mimetype='image/png')

