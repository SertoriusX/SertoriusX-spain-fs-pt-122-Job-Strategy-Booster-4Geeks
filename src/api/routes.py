"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask_bcrypt import Bcrypt
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Postulations
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

bcrypt = Bcrypt()  # just create the instance here


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route('/register', methods=["POST"])
def register():
    data = request.get_json()

    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({"message": "Missing username, email, or password"}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"message": "Username already exists"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "Email already exists"}), 400

    password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    new_user = User(
        username=username,
        email=email,
        password=password_hash,
        is_active=True
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "message": "User registered successfully",
        "user": new_user.serialize()
    }), 201


@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    user = User.query.filter_by(username=username).first()

    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"message": "Invalid credentials"}), 401

    access_token = create_access_token(identity=user.id)

    return jsonify({
        "access_token": access_token,
        "user": user.serialize()
    }), 200


@api.route('/user', methods=["GET"])
def user_detail():
    users = User.query.all()
    list_user = [user.serialize() for user in users]
    return jsonify(list_user)


# -----------------------------Postulaciones-----------------------------#
@api.route("/postulations", methods=["GET"])
@jwt_required()
def get_my_postulations():
    current_user = get_jwt_identity()

    postulations = Postulations.query.filter_by(user_id=current_user).all()

    return jsonify([
        postulation.serialize() for postulation in postulations
    ]), 200

@api.route("/postulations", methods=["POST"])
@jwt_required()
def postulaciones_post():
    data = request.get_json()
    current_user_id = get_jwt_identity()

    def safe_int(val, default=None):
        try:
            return int(val)
        except (ValueError, TypeError):
            return default

    postulation_state = data.get("postulation_state")
    company_name = data.get("company_name")
    role = data.get("role")
    expireiance = data.get("expireiance")
    inscription_date = data.get('inscription_date')
    city = data.get("city")
    salary = data.get("salary")
    platform = data.get("platform")
    postulation_url = data.get("url")
    work_type = data.get("work_type")
    requirements = data.get("requirements")
    candidates_applied = data.get("candidates_applied")
    available_positions = data.get("available_positions")
    job_description = data.get("job_description")

    REQUIRED_FIELDS = [
    "postulation_state",
    "company_name",
    "role",
    "expireiance",
    "inscription_date",
    "city",
    "salary",
    "platform",
    "url",
    "work_type",
    "requirements",
    "candidates_applied",
    "available_positions",
    "job_description",
    ]

    missing_field = [field for field in REQUIRED_FIELDS if field not in data or data[field] is None]

    if missing_field:
        return {
            "error": "Missing required fields",
            "fields": missing_field
        }, 400


    new_postulacion = Postulations(
        user_id=current_user_id,
        postulation_state= postulation_state,
        company_name=company_name,
        role=role,
        expireiance=expireiance,
        inscription_date= inscription_date,
        city=city,
        salary=salary,
        platform = platform,
        postulation_url = postulation_url,
        work_type= work_type,
        requirements=requirements,
        candidates_applied=candidates_applied,
        available_positions = available_positions,
        job_description=job_description,
    )

    db.session.add(new_postulacion)
    db.session.commit()
    return jsonify(new_postulacion.serialize()), 201


@api.route('/post/<int:id>', methods=['DELETE'])
@jwt_required()
def remove_postulation(id):
    current_user_id = get_jwt_identity()

    if postulation.user_id != current_user_id:
        return {"message": "Unauthorized"}, 403

    postulation = Postulations.query.filter_by(id=id).first()
    if not postulation:
        return {'message': 'There is no postulation to eliminate'}, 400
    
    db.session.delete(postulation)
    db.session.commit()
    return jsonify({"message": "Postulation has been removed"})
