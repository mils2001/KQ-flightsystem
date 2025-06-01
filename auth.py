from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash, check_password_hash
from db import get_db_connection
import datetime
import mysql.connector

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify(message='Username and password required'), 400

    hashed_password = generate_password_hash(password)
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO users (username, password_hash) VALUES (%s, %s)", (username, password))

        conn.commit()
        conn.close()
        return jsonify(message='User registered successfully'), 201
    except mysql.connector.IntegrityError:
        return jsonify(message='Username already exists'), 400

@auth_bp.route('/login', methods=['POST'])
@auth_bp.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')  # This is fine — it's from the user input

    if not username or not password:
        return jsonify({'message': 'Username and password required'}), 400

    try:
        conn = mysql.connector.connect(
            host='localhost',
            user='root',
            password='your_mysql_password',
            database='kenya_airways'
        )
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
        user = cursor.fetchone()

        if not user:
            return jsonify({'message': 'User not found'}), 404

        # Now check against the `password_hash` column in the DB
        if not check_password_hash(user['password_hash'], password):
            return jsonify({'message': 'Invalid password'}), 401

        # Generate JWT Token
        token = jwt.encode({
            'user_id': user['id'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        }, app.config['SECRET_KEY'], algorithm='HS256')

        return jsonify({'token': token, 'message': 'Login successful'})

    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500

    finally:
        cursor.close()
        conn.close()


  

