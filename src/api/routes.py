"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import openai
from dotenv import load_dotenv
from flask_bcrypt import Bcrypt
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Profile
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
import os
import traceback  # <-- Add this line!

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

bcrypt = Bcrypt()  # just create the instance here
load_dotenv()  # This loads .env
api_key = (os.getenv("OPENAI_API_KEY"))
bcrypt = Bcrypt()  # just create the instance here

load_dotenv()  # This loads .env
api_key = (os.getenv("OPENAI_API_KEY"))
bcrypt = Bcrypt()  # just create the instance here


openai.api_key = api_key


@api.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        if not data or 'message' not in data:
            return jsonify({'response': 'No message provided'}), 400

        user_message = data['message']

        # Example:
        response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": user_message}
            ]
        )
        bot_reply = response.choices[0].message.content
        return jsonify({"response": bot_reply})

    except Exception as e:
        traceback.print_exc()  # Print full error in console/log
        return jsonify({"response": f"Error: {str(e)}"}), 500


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


def save_uploaded_file(file, upload_folder=None):
    if not file:
        return None

    if upload_folder is None:
        upload_folder = '/tmp/uploads'

    os.makedirs(upload_folder, exist_ok=True)

    filename = secure_filename(file.filename)

    file_path = os.path.join(upload_folder, filename)

    file.save(file_path)

    return filename


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


@api.route('/profile', methods=["GET"])
@jwt_required()
def profile_get():
    current_user = get_jwt_identity()
    profile = Profile.query.get(current_user)
    if not profile:
        return jsonify({'msg': 'profile donst found'})
    return jsonify(profile.serialize())


@api.route('/profile', methods=["POST"])
@jwt_required()
def profile_post():
    current_user = get_jwt_identity()
    data = request.get_json()
    first_name = data.get("first_name")
    last_name = data.get("last_name")
    image_filename = data.get("image_filename")
    bio = data.get("bio")
    skill1 = data.get("skill1")
    skill2 = data.get("skill2")
    skill3 = data.get("skill3")
    skill4 = data.get("skill4")
    skill5 = data.get("skill5")
    skill6 = data.get("skill6")
    convert_img = save_uploaded_file(
        image_filename, upload_folder=os.getenv('UPLOAD_FOLDER', '/tmp/uploads'))
    new_profile = Profile(
        first_name=first_name,
        last_name=last_name,
        image_filename=convert_img,
        bio=bio,
        skill1=skill1,
        skill2=skill2,
        skill3=skill3,
        skill4=skill4,
        skill5=skill5,
        skill6=skill6,
        user_id=current_user
    )
    db.session.add(new_profile)
    db.session.commit()
    return jsonify(new_profile.serialize())


@api.route('/profile/<int:id>', methods=["PUT"])
@jwt_required()
def profile_post(id):
    current_user = get_jwt_identity()
    profile = Profile.query.get(current_user)
    data = request.get_json()
    first_name = data.get("first_name")
    last_name = data.get("last_name")
    image_filename = data.get("image_filename")
    bio = data.get("bio")
    skill1 = data.get("skill1")
    skill2 = data.get("skill2")
    skill3 = data.get("skill3")
    skill4 = data.get("skill4")
    skill5 = data.get("skill5")
    skill6 = data.get("skill6")

    if first_name:
        profile.first_name = first_name
    if last_name:
        profile.last_name = last_name
    if image_filename:
        profile.image_filename = save_uploaded_file(
            image_filename, upload_folder=os.getenv('UPLOAD_FOLDER', '/tmp/uploads'))
    if bio:
        profile.bio = bio
    if skill1:
        profile.skill1 = skill1
    if skill2:
        profile.skill2 = skill2
    if skill3:
        profile.skill3 = skill3
    if skill4:
        profile.skill4 = skill4
    if skill5:
        profile.skill5 = skill5
    if skill6:
        profile.skill6 = skill6
    db.session.commit()
    return jsonify(profile.serialize())
