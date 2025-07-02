from flask import Flask, jsonify
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from flask_cors import CORS
from dotenv import load_dotenv
from datetime import timedelta
from db import get_db_connection, create_tables, close_db

# Load env vars
load_dotenv()

# Blueprints
from routes.auth import auth_bp
from routes.profile import profile_bp
from routes.flights import flights_bp
from routes.bookings import bookings_bp

app = Flask(__name__)

CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

app.config['JWT_SECRET_KEY'] = 'your-very-secret-key'
app.config['SECRET_KEY'] = app.config['JWT_SECRET_KEY']
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=365)
app.config['JWT_TOKEN_LOCATION'] = ['headers']

jwt = JWTManager(app)

# Register routes
app.register_blueprint(auth_bp, url_prefix='/api')
app.register_blueprint(profile_bp)
app.register_blueprint(flights_bp)
app.register_blueprint(bookings_bp)

# Auto create DB
with app.app_context():
    create_tables()

@app.route('/api/dashboard', methods=['GET'])
@jwt_required()
def dashboard():
    current_user = get_jwt_identity()
    return jsonify(message=f"Welcome {current_user}!"), 200

@app.route('/api/test_db', methods=['GET'])
def test_db():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT 1")
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        return jsonify({"message": "Database connection successful", "result": result}), 200
    except Exception as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500

@app.teardown_appcontext
def teardown_db(exception=None):
    close_db()

if __name__ == '__main__':
    app.run(debug=True)

