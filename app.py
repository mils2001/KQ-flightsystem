from flask import Flask, jsonify
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from db import get_db_connection, create_tables, close_db
from auth import auth_bp
from dashboard import dashboard_bp
from admin_routes import admin_bp
from flights import flights_bp
from routes.bookings import bookings_bp
from flask_jwt_extended import JWTManager
from auth import token_required



app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'be1b10ff40bf0e4b09b5fb05d8e7df07f6011b96c1b987b0a3875704d622f980'
app.config['JWT_TOKEN_LOCATION'] = ['headers']
jwt = JWTManager(app)
# Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/api')
app.register_blueprint(dashboard_bp)
app.register_blueprint(admin_bp)
app.register_blueprint(flights_bp, url_prefix='/api')
app.register_blueprint(bookings_bp, url_prefix='/api/bookings')

# Other routes above...

@app.route('/api/bookings', methods=['GET'])
@token_required
def get_bookings(current_user):
    try:
        conn = get_db_connection()
        cur = conn.cursor(dictionary=True)

        cur.execute("SELECT * FROM bookings WHERE user_id = %s", (current_user['id'],))
        bookings = cur.fetchall()

        cur.close()
        conn.close()

        return jsonify(bookings), 200

    except Exception as e:
        return jsonify({'message': f'Error fetching bookings: {str(e)}'}), 500

# Dashboard Test Route
@app.route('/dashboard', methods=['GET'])
@jwt_required()
def dashboard():
    current_user = get_jwt_identity()
    return jsonify(message=f"Welcome {current_user}!"), 200

# Close DB after each request
app.teardown_appcontext(close_db)

if __name__ == '__main__':
    with app.app_context():
        create_tables()
    app.run(debug=True)

