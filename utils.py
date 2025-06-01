from functools import wraps
from flask import request, jsonify, g
import jwt

SECRET_KEY = 'be1b10ff40bf0e4b09b5fb05d8e7df07f6011b96c1b987b0a3875704d622f980'

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')

        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'message': "Missing or invalid Authorization header"}), 401

        token = auth_header.split(" ")[1]

        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            g.user = data  # attach decoded token (user info) to g
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token'}), 401

        return f(*args, **kwargs)
    return decorated

