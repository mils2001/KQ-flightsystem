from flask import Flask, jsonify
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from db import get_db_connection, create_tables, close_db
from flask import Flask, Blueprint
from auth import auth_bp
from dashboard import dashboard_bp
from admin_routes import admin_bp
from flights import flights_bp
from routes.bookings import bookings_bp
from dotenv import load_dotenv

load_dotenv()
from datetime import timedelta
from routes.profile import profile_bp
from routes.flights import flights_bp
from routes.profile import profile_bp
from experience import experience_bp








app = Flask(__name__)

# JWT Configuration
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=365)  # 1 year
app.config['JWT_SECRET_KEY'] = 'be1b10ff40bf0e4b09b5fb05d8e7df07f6011b96c1b987b0a3875704d622f980'
app.config['SECRET_KEY'] = app.config['JWT_SECRET_KEY']
app.config['JWT_TOKEN_LOCATION'] = ['headers']

jwt = JWTManager(app)

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/api')
app.register_blueprint(dashboard_bp)
app.register_blueprint(admin_bp)
app.register_blueprint(flights_bp, url_prefix='/api')           # First for /api/flights
app.register_blueprint(bookings_bp, url_prefix='/api/bookings')
app.register_blueprint(profile_bp)
app.register_blueprint(flights_bp, name='flights_root')         # Second, possibly for /
profile_bp = Blueprint('user_profile', __name__)
app.register_blueprint(experience_bp)



# Dashboard route
@app.route('/dashboard', methods=['GET'])
@jwt_required()
def dashboard():
    current_user = get_jwt_identity()
    return jsonify(message=f"Welcome {current_user}!"), 200

# Cleanup DB connections
@app.teardown_appcontext
def teardown_db(exception):
    close_db()

if __name__ == '__main__':
    with app.app_context():
        create_tables()
    app.run(debug=True)

