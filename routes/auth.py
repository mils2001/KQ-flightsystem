from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from functools import wraps
from werkzeug.security import generate_password_hash, check_password_hash
import mysql.connector
from db import get_db_connection
import traceback

# Blueprints
auth_bp = Blueprint('auth', __name__)
profile_bp = Blueprint('profile', __name__)

# -------------------- Signup Route --------------------
@auth_bp.route("/signup", methods=["POST"])
def signup():
    try:
        data = request.get_json()
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")

        if not username or not email or not password:
            return jsonify({"error": "Username, email, and password are required"}), 400

        # ✅ Use werkzeug generate_password_hash
        password_hash = generate_password_hash(password)

        db = get_db_connection()
        cursor = db.cursor()

        cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
        if cursor.fetchone():
            cursor.close()
            db.close()
            return jsonify({"error": "Email already registered"}), 409

        cursor.execute(
            "INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s)",
            (username, email, password_hash)
        )
        db.commit()
        user_id = cursor.lastrowid
        cursor.close()
        db.close()

        access_token = create_access_token(identity=user_id)
        return jsonify({"access_token": access_token, "username": username}), 201

    except mysql.connector.Error as err:
        print(f"Database error in signup: {str(err)}")
        return jsonify({"error": f"Database error: {str(err)}"}), 500
    except Exception as e:
        print(f"Unexpected error in signup: {str(e)}")
        traceback.print_exc()
        return jsonify({"error": f"Server error: {str(e)}"}), 500

# -------------------- Login Route --------------------
@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json(force=True)
        print("Login data received:", data)

        email = data.get("email")
        password = data.get("password")
        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        print("Connected to DB")

        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()
        print("Fetched user:", user)
        cursor.close()
        conn.close()

        if not user:
            return jsonify({"error": "Invalid email or password"}), 401

        # ✅ Use werkzeug check_password_hash
        if check_password_hash(user["password_hash"], password):
            access_token = create_access_token(identity=user["id"])
            return jsonify({"access_token": access_token, "username": user["username"]}), 200
        else:
            return jsonify({"error": "Invalid email or password"}), 401

    except Exception as e:
        print(f"Unexpected error in login: {str(e)}")
        traceback.print_exc()
        return jsonify({"error": "Internal server error"}), 500

# -------------------- Token Decorator --------------------
def token_required(f):
    @wraps(f)
    @jwt_required()
    def decorated(*args, **kwargs):
        try:
            user_id = get_jwt_identity()
            return f(user_id, *args, **kwargs)
        except Exception as e:
            print(f"Token validation error: {str(e)}")
            return jsonify({"message": "Token is invalid", "error": str(e)}), 401
    return decorated

# -------------------- Profile Route --------------------
@profile_bp.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():
    try:
        user_id = get_jwt_identity()
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT username, email, balance, profile_pic FROM users WHERE id = %s", (user_id,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()

        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify(user), 200
    except mysql.connector.Error as err:
        print(f"Database error in profile: {str(err)}")
        return jsonify({"error": f"Database error: {str(err)}"}), 500
    except Exception as e:
        print(f"Unexpected error in profile: {str(e)}")
        traceback.print_exc()
        return jsonify({"error": f"Server error: {str(e)}"}), 500

