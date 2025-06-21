from flask import Flask, jsonify
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from flask_cors import CORS
from dotenv import load_dotenv
from datetime import timedelta

from db import get_db_connection, create_tables, close_db

# Load environment variables
load_dotenv()

# Import Blueprints
from auth import auth_bp
from dashboard import dashboard_bp
from admin_routes import admin_bp
from routes.flights import flights_bp
from routes.profile import profile_bp
from routes.bookings import bookings_bp
from experience import experience_bp

# Initialize Flask App
app = Flask(__name__)

# Enable CORS (frontend on Vite runs on port 5173)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

# JWT Configuration
app.config['JWT_SECRET_KEY'] = 'be1b10ff40bf0e4b09b5fb05d8e7df07f6011b96c1b987b0a3875704d622f980'
app.config['SECRET_KEY'] = app.config['JWT_SECRET_KEY']
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=365)
app.config['JWT_TOKEN_LOCATION'] = ['headers']

# Initialize JWT
jwt = JWTManager(app)

# Register Blueprints with proper prefixes
app.register_blueprint(auth_bp, url_prefix='/api')
app.register_blueprint(dashboard_bp)
app.register_blueprint(admin_bp)
app.register_blueprint(flights_bp, url_prefix='/api/flights')
app.register_blueprint(bookings_bp, url_prefix='/api/bookings')
app.register_blueprint(profile_bp, url_prefix='/api/profile')
app.register_blueprint(experience_bp, url_prefix='/api/experience')  

# Protected Example Route
@app.route('/dashboard', methods=['GET'])
@jwt_required()
def dashboard():
    current_user = get_jwt_identity()
    return jsonify(message=f"Welcome {current_user}!"), 200

# Close DB connection after each request
@app.teardown_appcontext
def teardown_db(exception):
    close_db()

# Run the app and print all registered routes
if __name__ == '__main__':
    with app.app_context():
        create_tables()
        print("\n📍 Registered Routes:")
        for rule in app.url_map.iter_rules():
            print(f"{rule.endpoint}: {rule}")
        print()
    app.run(debug=True)

