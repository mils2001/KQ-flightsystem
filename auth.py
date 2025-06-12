from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import check_password_hash
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, verify_jwt_in_request, get_jwt_identity
from functools import wraps
import jwt
import datetime
import mysql.connector

auth_bp = Blueprint('auth_blueprint', __name__)
bcrypt = Bcrypt()

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
    cursor.close()
    db.close()

    payload = {
        "user_id": user_id,
        "username": username,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=2)
    }
    token = jwt.encode(payload, current_app.config.get("SECRET_KEY", SECRET_KEY), algorithm="HS256")
    if isinstance(token, bytes):
        token = token.decode("utf-8")

    return jsonify({"token": token})


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if not user or not check_password_hash(user['password_hash'], password):
        return jsonify({'error': 'Invalid email or password'}), 401

    user_id = user['id']
    access_token = create_access_token(
        identity=str(user_id),
        additional_claims={"email": email}
    )

    return jsonify({"access_token": access_token}), 200




def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        try:
            verify_jwt_in_request()
            current_user = get_jwt_identity()
            user_id = current_user["user_id"]
        except Exception as e:
            return jsonify({"message": "Token is invalid", "error": str(e)}), 401
        return f(user_id, *args, **kwargs)
    return decorated

