from flask import Blueprint, jsonify
from utils import token_required

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/admin-only', methods=['GET'])
@token_required
def admin_only(current_user):
    if current_user.get('role') != 'admin':
        return jsonify({'message': 'Access denied: Admins only'}), 403
    return jsonify({'message': 'Welcome, Admin!'}), 200
