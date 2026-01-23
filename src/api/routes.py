"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask_bcrypt import Bcrypt
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Postulations
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from api.data_mock.mock_data import jobs
from datetime import datetime

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


""" ---------- REGISTER ENDPOINT ----------- """


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


""" ------------ LOGIN ENDPOINT ----------- """


@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    user = User.query.filter_by(username=username).first()

    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"message": "Invalid credentials"}), 401

    access_token = create_access_token(str(user.id))

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
""" @api.route("/posts/my-post-count", methods=["GET"])
def count_post():
    total_job = len(jobs)
    return jsonify({"count": total_job})


@api.route("/posts/oferta", methods=["GET"])
def count_oferta():
    total_job = len([j for j in jobs if j["proceso"] == "Ofertas"])
    return jsonify({"oferta": total_job})


@api.route("/posts/descartado", methods=["GET"])
def count_descartado():
    total_job = len([j for j in jobs if j["proceso"] == "Descartado"])
    return jsonify({"descartado": total_job})


@api.route("/posts/entrevista", methods=["GET"])
def count_entrevista():
    total_job = len([j for j in jobs if j["proceso"] == "En entrevista"])
    return jsonify({"entrevista": total_job})


@api.route("/postulacion", methods=['GET'])
def postulaciones_get():
    job = [j for j in jobs]
    return jsonify(job)


@api.route("/postulacion/<int:id>", methods=['GET'])
def postulaciones_get_id(id):
    job = next((j for j in jobs if j['id'] == id), None)
    if job is None:
        return jsonify({"error": "Job not found"}), 404
    return jsonify(job)


@api.route("/postulacion/filter", methods=['GET'])
def postulaciones_ge_filtert():
    status_filter = request.args.get('status', None)

    if status_filter:
        filtered_jobs = [job for job in jobs if job.get(
            'status', '').lower() == status_filter.lower()]
    else:
        filtered_jobs = jobs

    return jsonify(filtered_jobs), 200
 """


@api.route("/postulations", methods=["GET"])
@jwt_required()
def count_post():
    current_user_id = get_jwt_identity()
    postulations = Postulations.query.filter_by(user_id=current_user_id).all()
    postulations_data = [p.serialize() for p in postulations]

    return jsonify({"postulations": postulations_data}), 200


@api.route('/postulations/<int:id>', methods=['GET'])
@jwt_required()
def get_postulation(id):
    current_user_id = get_jwt_identity()

    postulation = Postulations.query.filter_by(
        id=id,
        user_id=current_user_id
    ).first()

    if not postulation:
        return jsonify({"error": "Postulation not found"}), 404

    return jsonify(postulation.serialize()), 200


@api.route("/postulations", methods=["POST"])
@jwt_required()
def postulaciones_post():
    data = request.get_json()

    if not data:
        return {"error": "Request body must be JSON"}, 400

    current_user_id = get_jwt_identity()

    REQUIRED_FIELDS = [
        "postulation_state",
        "company_name",
        "role",
        "experience",
        "inscription_date",
        "city",
        "salary",
        "platform",
        "postulation_url",
        "work_type",
        "requirements",
        "candidates_applied",
        "available_positions",
        "job_description",
    ]

    missing_field = [
        field for field in REQUIRED_FIELDS if field not in data or data[field] is None]

    if missing_field:
        return {"error": "Missing required fields", "fields": missing_field}, 400

    def safe_int(value, field_name, min_value=0):
        try:
            value = int(value)
            if value < min_value:
                raise ValueError
            return value
        except (ValueError, TypeError):
            raise ValueError(f"{field_name} must be an integer")

    try:
        experience = safe_int(data["experience"], "experience", 0)
        salary = safe_int(data["salary"], "salary", 0)
        candidates_applied = safe_int(
            data["candidates_applied"], "candidates_applied", 0)
        available_positions = safe_int(
            data["available_positions"], "available_positions", 1)
    except ValueError as e:
        return {"error": str(e)}, 400

    try:
        inscription_date = datetime.strptime(
            data["inscription_date"], "%Y-%m-%d").date()
    except (ValueError, TypeError):
        return {"error": "inscription_date must be in yyyy-mm-dd format"}, 400

    new_postulacion = Postulations(
        user_id=current_user_id,
        postulation_state=data["postulation_state"],
        company_name=data["company_name"],
        role=data["role"],
        experience=experience,
        inscription_date=inscription_date,
        city=data["city"],
        salary=salary,
        platform=data["platform"],
        postulation_url=data["postulation_url"],
        work_type=data["work_type"],
        requirements=data["requirements"],
        candidates_applied=candidates_applied,
        available_positions=available_positions,
        job_description=data["job_description"]
    )

    db.session.add(new_postulacion)
    db.session.commit()
    return jsonify(new_postulacion.serialize()), 201


@api.route('/postulations/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_postulation(id):
    postulation = Postulations.query.filter_by(id=id).first()

    if not postulation:
        return jsonify({'message': 'There is not postulation to delete'}), 400

    db.session.delete(postulation)
    db.session.commit()
    return jsonify({"message": "Postulation has been removed"})
