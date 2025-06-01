from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from db import get_db_connection, create_tables
from auth import auth_bp
import mysql.connector

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'be1b10ff40bf0e4b09b5fb05d8e7df07f6011b96c1b987b0a3875704d622f980'

jwt = JWTManager(app)

# Register auth routes
app.register_blueprint(auth_bp, url_prefix='/auth')

@app.route('/dashboard', methods=['GET'])
@jwt_required()
def dashboard():
    current_user = get_jwt_identity()
    return jsonify(message=f"Welcome {current_user}!"), 200

# -------------------- FLIGHTS --------------------

@app.route('/flights', methods=['POST'])
@jwt_required()
def add_flight():
    data = request.get_json()
    route = data['route']
    price = data['price']
    seats = data['seats_available']
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO flights (route, price, seats_available) VALUES (%s, %s, %s)', (route, price, seats))
    conn.commit()
    conn.close()
    return jsonify(message="Flight added successfully"), 201

@app.route('/flights', methods=['GET'])
def view_flights():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT * FROM flights')
    flights = cursor.fetchall()
    conn.close()
    return jsonify(flights)

@app.route('/flights/<int:flight_id>', methods=['PUT'])
@jwt_required()
def update_flight(flight_id):
    data = request.get_json()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('UPDATE flights SET route=%s, price=%s, seats_available=%s WHERE id=%s',
                   (data['route'], data['price'], data['seats_available'], flight_id))
    conn.commit()
    conn.close()
    return jsonify(message="Flight updated")

@app.route('/flights/<int:flight_id>', methods=['DELETE'])
@jwt_required()
def delete_flight(flight_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM flights WHERE id=%s', (flight_id,))
    conn.commit()
    conn.close()
    return jsonify(message="Flight deleted")

# -------------------- BOOKINGS --------------------

@app.route('/book/<int:flight_id>', methods=['POST'])
@jwt_required()
def book_flight(flight_id):
    user = get_jwt_identity()
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT seats_available FROM flights WHERE id = %s', (flight_id,))
    flight = cursor.fetchone()
    if not flight:
        return jsonify(message="Flight not found"), 404
    if flight['seats_available'] < 1:
        return jsonify(message="No seats available"), 400

    cursor.execute('UPDATE flights SET seats_available = seats_available - 1 WHERE id = %s', (flight_id,))
    cursor.execute('INSERT INTO bookings (user, flight_id) VALUES (%s, %s)', (user, flight_id))
    conn.commit()
    conn.close()
    return jsonify(message=f"Flight {flight_id} booked for {user}"), 200

@app.route('/cancel/<int:flight_id>', methods=['POST'])
@jwt_required()
def cancel_booking(flight_id):
    user = get_jwt_identity()
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute('SELECT * FROM bookings WHERE user = %s AND flight_id = %s', (user, flight_id))
    if cursor.fetchone():
        cursor.execute('DELETE FROM bookings WHERE user = %s AND flight_id = %s', (user, flight_id))
        cursor.execute('UPDATE flights SET seats_available = seats_available + 1 WHERE id = %s', (flight_id,))
        conn.commit()
        conn.close()
        return jsonify(message="Booking cancelled"), 200
    else:
        conn.close()
        return jsonify(message="No booking found"), 404

# -------------------- INIT --------------------

if __name__ == '__main__':
    create_tables()
    app.run(debug=True)

