from flask_bcrypt import Bcrypt
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, CV
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import json
from datetime import datetime

api = Blueprint('api', __name__)
CORS(api)
bcrypt = Bcrypt()


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    return jsonify({"message": "Hello! I'm a message that came from the backend"}), 200


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

    new_user = User(username=username, email=email,
                    password=password_hash, is_active=True)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully", "user": new_user.serialize()}), 201


@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    user = User.query.filter_by(username=username).first()

    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"message": "Invalid credentials"}), 401

    access_token = create_access_token(identity=str(user.id))
    return jsonify({"access_token": access_token, "user": user.serialize()}), 200


@api.route('/user', methods=["GET"])
def user_detail():
    users = User.query.all()
    return jsonify([user.serialize() for user in users])


@api.route("/cv", methods=["GET"])
@jwt_required()
def get_all_cvs():
    try:
        current_user_id = get_jwt_identity()
        cvs = CV.query.filter_by(user_id=current_user_id).all()

        return jsonify({
            "success": True,
            "cvs": [cv.serialize() for cv in cvs]
        }), 200

    except Exception as e:
        print(f"ERROR: {e}")
        return jsonify({"success": False, "message": str(e)}), 500


@api.route("/cv/<int:cv_id>", methods=["GET"])
@jwt_required()
def get_cv_by_id(cv_id):
    try:
        current_user_id = get_jwt_identity()
        cv = CV.query.filter_by(id=cv_id, user_id=current_user_id).first()

        if not cv:
            return jsonify({"success": False, "message": "CV no encontrado"}), 404

        return jsonify({"success": True, "cv": cv.serialize()}), 200

    except Exception as e:
        print(f"ERROR: {e}")
        return jsonify({"success": False, "message": str(e)}), 500


@api.route("/cv", methods=["POST"])
@jwt_required()
def create_cv():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()

        if not data:
            return jsonify({"success": False, "message": "No se enviaron datos"}), 400

        # Crear un nuevo CV
        nuevo_cv = CV(
            user_id=current_user_id,
            datos=json.dumps(data, ensure_ascii=False),
            fecha_creacion=datetime.utcnow(),
            fecha_modificacion=datetime.utcnow()
        )

        db.session.add(nuevo_cv)
        db.session.commit()

        return jsonify({
            "success": True,
            "cv": nuevo_cv.serialize()
        }), 201

    except Exception as e:
        print(f"ERROR: {e}")
        db.session.rollback()
        return jsonify({"success": False, "message": str(e)}), 500


@api.route("/cv/<int:cv_id>", methods=["PUT"])
@jwt_required()
def update_cv(cv_id):
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()

        cv = CV.query.filter_by(id=cv_id, user_id=current_user_id).first()

        if not cv:
            return jsonify({"success": False, "message": "CV no encontrado"}), 404

        cv.datos = json.dumps(data, ensure_ascii=False)
        cv.fecha_modificacion = datetime.utcnow()

        db.session.commit()

        return jsonify({
            "success": True,
            "cv": cv.serialize()
        }), 200

    except Exception as e:
        print(f"ERROR: {e}")
        db.session.rollback()
        return jsonify({"success": False, "message": str(e)}), 500


@api.route("/cv/<int:cv_id>", methods=["DELETE"])
@jwt_required()
def delete_cv(cv_id):
    try:
        current_user_id = get_jwt_identity()
        cv = CV.query.filter_by(id=cv_id, user_id=current_user_id).first()

        if not cv:
            return jsonify({"success": False, "message": "CV no encontrado"}), 404

        db.session.delete(cv)
        db.session.commit()

        return jsonify({"success": True, "message": "CV eliminado correctamente"}), 200

    except Exception as e:
        print(f"ERROR: {e}")
        db.session.rollback()
        return jsonify({"success": False, "message": str(e)}), 500


@api.route("/cv/export", methods=["GET"])
@jwt_required()
def export_cv():
    try:
        current_user_id = get_jwt_identity()
        cv = CV.query.filter_by(user_id=current_user_id).first()

        if not cv:
            return jsonify({'success': False, 'message': 'CV no encontrado'}), 404

        datos = json.loads(cv.datos)
        nombre = datos.get('nombre', 'cv').replace(' ', '-').lower()
        fecha = datetime.now().strftime('%Y-%m-%d')
        filename = f"cv-{nombre}-{fecha}.json"

        response = jsonify(datos)
        response.headers['Content-Disposition'] = f'attachment; filename={filename}'
        response.headers['Content-Type'] = 'application/json'

        return response, 200

    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'message': f'Error al exportar: {str(e)}'}), 500
