from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from dotenv import load_dotenv
from datetime import timedelta
import os

from db import get_db_connection, create_tables, close_db

# Load environment variables
load_dotenv()

# Flask app setup
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# JWT Config
app.config['SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'super-secret-key')
app.config['JWT_SECRET_KEY'] = app.config['SECRET_KEY']
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)
app.config['JWT_TOKEN_LOCATION'] = ['headers']

jwt = JWTManager(app)

# Import Blueprints
from routes.auth import auth_bp
from routes.profile import profile_bp
from routes.flights import flights_bp
from routes.bookings import bookings_bp

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/api')
app.register_blueprint(profile_bp, url_prefix='/api')
app.register_blueprint(flights_bp, url_prefix='/api')
app.register_blueprint(bookings_bp, url_prefix='/api')

# Auto-create DB tables
with app.app_context():
    create_tables()

# Sample authenticated route
@app.route('/api/dashboard', methods=['GET'])
@jwt_required()
def dashboard():
    current_user = get_jwt_identity()
    return jsonify(message=f"Welcome {current_user}"), 200

# Simple DB test endpoint
@app.route('/api/test_db', methods=['GET'])
def test_db():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT 1")
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        return jsonify({"message": "Database connection successful"}), 200
    except Exception as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500

# Cleanup after requests
@app.teardown_appcontext
def teardown_db(exception=None):
    close_db()

# Run the app
if __name__ == '__main__':
    app.run(debug=True)

