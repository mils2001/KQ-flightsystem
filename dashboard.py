from flask import Blueprint, jsonify, request
from utils import token_required  # your decorator from utils.py

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/dashboard', methods=['GET'])
@token_required
def dashboard():
    user_info = request.user  # This was added in the decorator
    return jsonify({
        'message': f"Welcome {user_info['username']}!",
        'user_id': user_info['user_id']
    }), 200

