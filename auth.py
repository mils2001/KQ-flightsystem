from flask import Blueprint, request, jsonify, current_app
import jwt
from functools import wraps
from werkzeug.security import generate_password_hash, check_password_hash
import mysql.connector
import datetime
from jwt import ExpiredSignatureError, InvalidTokenError
from flask_bcrypt import Bcrypt

auth_bp = Blueprint('auth', __name__)
bcrypt = Bcrypt()

# Use this or set in app config
SECRET_KEY = 'be1b10ff40bf0e4b09b5fb05d8e7df07f6011b96c1b987b0a3875704d622f980'


def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="Awilo9701",
        password="Awilo9701@",
        database="kenya_airways"
    )


@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    username = data["username"]
    email = data["email"]
    password = bcrypt.generate_password_hash(data["password"]).decode("utf-8")

    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s)",
        (username, email, password)
    )
    db.commit()

    user_id = cursor.lastrowid
    token = jwt.encode(
        {"user_id": user_id, "username": username},
        current_app.config.get("SECRET_KEY", SECRET_KEY),
        algorithm="HS256"
    )

    cursor.close()
    db.close()

    return jsonify({"token": token})
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization")

        if not auth_header:
            return jsonify({"message": "Authorization header missing!"}), 401

        try:
            # Split header
            parts = auth_header.split()
            if len(parts) != 2 or parts[0].lower() != "bearer":
                return jsonify({"message": "Invalid Authorization header format!"}), 401

            token = parts[1]

            # Debug print to console
            print(f"[DEBUG] Received token: {token}, type: {type(token)}")

            # Ensure token is a string (some Flask/Werkzeug versions give unicode or bytes)
            if not isinstance(token, str):
                token = token.decode("utf-8")  # Only if it's bytes

            # Decode the token
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
            user_id = data.get("user_id")

        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token has expired"}), 401
        except jwt.InvalidTokenError as e:
            return jsonify({"message": f"Invalid token: {str(e)}"}), 401
        except Exception as e:
            return jsonify({"message": f"Token error: {str(e)}"}), 401

        return f(user_id, *args, **kwargs)

    return decorated




@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': 'Username and password required'}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
        user = cursor.fetchone()

        if not user:
            return jsonify({'message': 'User not found'}), 404

        if not check_password_hash(user['password_hash'], password):
            return jsonify({'message': 'Invalid password'}), 401

        payload = {
            'user_id': user['id'],
            'username': user['username'],
            'role': user.get('role'),  # Use .get() in case role is null
            'sub': user['username'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=2)
        }

        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')

        return jsonify({'token': token}), 200

    except Exception as e:
        return jsonify({'message': str(e)}), 500

    finally:
        cursor.close()
        conn.close()

