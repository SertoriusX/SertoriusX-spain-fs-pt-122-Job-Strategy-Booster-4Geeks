"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from dotenv import load_dotenv
import openai
import os
from flask_bcrypt import Bcrypt
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Category, City, Gender, Skill, SocialMedia, Status, WorkType, EmploymentType, Postulaciones, postulacion_social_media, SocialMediaStatus, Profile
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
import traceback  # <-- Add this line!
from dotenv import load_dotenv
import os
api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)
CORS(api, origins=[
    "https://organic-pancake-977j4vrjprg9h4g5-3000.app.github.dev",
    "http://localhost:3000"
])
load_dotenv()  # This loads .env
api_key = ("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")
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

    access_token = create_access_token(identity=str(user.id))

    return jsonify({
        "access_token": access_token,
        "user": user.serialize()
    }), 200


@api.route('/user', methods=["GET"])
def user_detail():
    users = User.query.all()
    list_user = [user.serialize() for user in users]
    return jsonify(list_user)

# -----------------------------Category-----------------------------#


@api.route("/category", methods=["GET"])
def category_get():
    categories = Category.query.order_by(Category.id.asc()).all()
    list_category = [category.serialize() for category in categories]
    return jsonify(list_category)


@api.route("/category/<int:id>", methods=["GET"])
def category_get_by_id(id):
    category = Category.query.filter_by(id=id).first()
    if not category:
        return jsonify({"msg": "Category not found"}), 404
    return jsonify(category.serialize())


@api.route("/category", methods=["POST"])
def category_post():
    data = request.get_json()
    name = data.get("name")
    if not name:
        return jsonify({"msg": "This field is required"})
    new_category = Category(name=name)
    db.session.add(new_category)
    db.session.commit()
    return jsonify(new_category)


@api.route("/category/<int:id>", methods=["PUT"])
def category_put(id):
    category = Category.query.filter_by(id=id).first()
    if not category:
        return jsonify({"msg": "Category not founded"})
    data = request.get_json()
    name = data.get("name")
    if not name:
        return jsonify({"msg": "This field is required"})
    if name:
        category.name = name
    db.session.commit()
    return jsonify(category.serialize())


@api.route("/category/<int:id>", methods=["DELETE"])
def category_delete(id):
    category = Category.query.filter_by(id=id).first()
    if not category:
        return jsonify({"msg": "Category not founded"})
    db.session.remove(category)
    db.session.commit()
    return jsonify({"msg": "This category was deleted"})


# -----------------------------City-----------------------------#
@api.route("/city", methods=["GET"])
def city_get():
    cities = City.query.order_by(City.id.asc()).all()
    list_city = [city.serialize() for city in cities]
    return jsonify(list_city)


@api.route("/city/<int:id>", methods=["GET"])
def city_get_by_id(id):
    city = City.query.filter_by(id=id).first()
    if not city:
        return jsonify({"msg": "City not found"}), 404
    return jsonify(city.serialize())


@api.route("/city", methods=["POST"])
def city_post():
    data = request.get_json()
    name = data.get("name")
    if not name:
        return jsonify({"msg": "This field is required"})
    new_city = City(name=name)
    db.session.add(new_city)
    db.session.commit()
    return jsonify(new_city.serialize())


@api.route("/city/<int:id>", methods=["PUT"])
def city_put(id):
    city = City.query.filter_by(id=id).first()
    if not city:
        return jsonify({"msg": "City not founded"})
    data = request.get_json()
    name = data.get("name")
    if not name:
        return jsonify({"msg": "This field is required"})
    if name:
        city.name = name
    db.session.commit()
    return jsonify(city.serialize())


@api.route("/city/<int:id>", methods=["DELETE"])
def city_delete(id):
    city = City.query.filter_by(id=id).first()
    if not city:
        return jsonify({"msg": "City not founded"})
    db.session.remove(city)
    db.session.commit()
    return jsonify({"msg": "This city was deleted"})


# -----------------------------Gender-----------------------------#
@api.route("/gender", methods=["GET"])
def gender_get():
    genders = Gender.query.order_by(Gender.id.asc()).all()
    list_gender = [gender.serialize() for gender in genders]
    return jsonify(list_gender)


@api.route("/gender/<int:id>", methods=["GET"])
def gender_get_by_id(id):
    gender = Gender.query.filter_by(id=id).first()
    if not gender:
        return jsonify({"msg": "Gender not found"}), 404
    return jsonify(gender.serialize())


@api.route("/gender", methods=["POST"])
def gender_post():
    data = request.get_json()
    name = data.get("name")
    if not name:
        return jsonify({"msg": "This field is required"})
    new_gender = Gender(name=name)
    db.session.add(new_gender)
    db.session.commit()
    return jsonify(new_gender.serialize())


@api.route("/gender/<int:id>", methods=["PUT"])
def gender_put(id):
    gender = Gender.query.filter_by(id=id).first()
    if not gender:
        return jsonify({"msg": "Gender not founded"})
    data = request.get_json()
    name = data.get("name")
    if not name:
        return jsonify({"msg": "This field is required"})
    if name:
        gender.name = name
    db.session.commit()
    return jsonify(gender.serialize())


@api.route("/gender/<int:id>", methods=["DELETE"])
def gender_delete(id):
    gender = Gender.query.filter_by(id=id).first()
    if not gender:
        return jsonify({"msg": "Gender not founded"})
    db.session.remove(gender)
    db.session.commit()
    return jsonify({"msg": "This Gender was deleted"})


# -----------------------------Skill-----------------------------#
@api.route("/skill", methods=["GET"])
def skill_get():
    skills = Skill.query.order_by(Skill.id.asc()).all()
    list_skill = [skill.serialize() for skill in skills]
    return jsonify(list_skill)


@api.route("/skill/<int:id>", methods=["GET"])
def skill_get_by_id(id):
    skill = Skill.query.filter_by(id=id).first()
    if not skill:
        return jsonify({"msg": "Skill not found"}), 404
    return jsonify(skill.serialize())


@api.route("/skill", methods=["POST"])
def skill_post():
    data = request.get_json()
    name = data.get("name")
    if not name:
        return jsonify({"msg": "This field is required"})
    new_skill = Skill(name=name)
    db.session.add(new_skill)
    db.session.commit()
    return jsonify(new_skill.serialize())


@api.route("/skill/<int:id>", methods=["PUT"])
def skill_put(id):
    skill = Skill.query.filter_by(id=id).first()
    if not skill:
        return jsonify({"msg": "Skill not founded"})
    data = request.get_json()
    name = data.get("name")
    if not name:
        return jsonify({"msg": "This field is required"})
    if name:
        skill.name = name
    db.session.commit()
    return jsonify(skill.serialize())


@api.route("/skill/<int:id>", methods=["DELETE"])
def skill_delete(id):
    skill = Skill.query.filter_by(id=id).first()
    if not skill:
        return jsonify({"msg": "Skill not founded"})
    db.session.remove(skill)
    db.session.commit()
    return jsonify({"msg": "This Skill was deleted"})


# -----------------------------SocialMedia-----------------------------#
@api.route("/social_media", methods=["GET"])
def social_media_get():
    social_medias = SocialMedia.query.order_by(SocialMedia.id.asc()).all()
    list_social_media = [social_media.serialize()
                         for social_media in social_medias]
    return jsonify(list_social_media)


@api.route("/social_media/<int:id>", methods=["GET"])
def social_media_by_id(id):
    social_media = SocialMedia.query.filter_by(id=id).first()
    if not social_media:
        return jsonify({"msg": "social_media not found"}), 404
    return jsonify(social_media.serialize())


@api.route("/social_media", methods=["POST"])
def social_media_post():
    data = request.get_json()
    name = data.get("name")
    if not name:
        return jsonify({"msg": "This field is required"})
    new_social_media = SocialMedia(name=name)
    db.session.add(new_social_media)
    db.session.commit()
    return jsonify(new_social_media.serialize())


@api.route("/social_media/<int:id>", methods=["PUT"])
def social_media_put(id):
    social_media = SocialMedia.query.filter_by(id=id).first()
    if not social_media:
        return jsonify({"msg": "social_media not founded"})
    data = request.get_json()
    name = data.get("name")
    if not name:
        return jsonify({"msg": "This field is required"})
    if name:
        social_media.name = name
    db.session.commit()
    return jsonify(social_media.serialize())


@api.route("/social_media/<int:id>", methods=["DELETE"])
def social_media_delete(id):
    social_media = SocialMedia.query.filter_by(id=id).first()
    if not social_media:
        return jsonify({"msg": "social_media not founded"})
    db.session.remove(social_media)
    db.session.commit()
    return jsonify({"msg": "This social_media was deleted"})


# -----------------------------Status-----------------------------#
@api.route("/status", methods=["GET"])
def status_get():
    status = Status.query.order_by(Status.id.asc()).all()
    list_status = [stutu.serialize()
                   for stutu in status]
    return jsonify(list_status)


@api.route("/status/<int:id>", methods=["GET"])
def status_id(id):
    status = Status.query.filter_by(id=id).first()
    if not status:
        return jsonify({"msg": "Status not found"}), 404
    return jsonify(status.serialize())


@api.route("/status", methods=["POST"])
def status_post():
    data = request.get_json()
    name = data.get("name")
    if not name:
        return jsonify({"msg": "This field is required"})
    new_status = Status(name=name)
    db.session.add(new_status)
    db.session.commit()
    return jsonify(new_status.serialize())


@api.route("/status/<int:id>", methods=["PUT"])
def status_put(id):
    status = Status.query.filter_by(id=id).first()
    if not status:
        return jsonify({"msg": "Status not founded"})
    data = request.get_json()
    name = data.get("name")
    if not name:
        return jsonify({"msg": "This field is required"})
    if name:
        status.name = name
    db.session.commit()
    return jsonify(status.serialize())


@api.route("/status/<int:id>", methods=["DELETE"])
def status_delete(id):
    status = Status.query.filter_by(id=id).first()
    if not status:
        return jsonify({"msg": "Status not founded"})
    db.session.remove(status)
    db.session.commit()
    return jsonify({"msg": "This status was deleted"})


# -----------------------------WorkType-----------------------------#
@api.route("/WorkType", methods=["GET"])
def work_type_get():
    work_types = WorkType.query.order_by(WorkType.id.asc()).all()
    list_work_type = [work_type.serialize()
                      for work_type in work_types]
    return jsonify(list_work_type)


@api.route("/WorkType/<int:id>", methods=["GET"])
def work_type_id(id):
    work_type_id = WorkType.query.filter_by(id=id).first()
    if not work_type_id:
        return jsonify({"msg": "new_work_type not found"}), 404
    return jsonify(work_type_id.serialize())


@api.route("/WorkType", methods=["POST"])
def work_type_post():
    data = request.get_json()
    name = data.get("name")
    if not name:
        return jsonify({"msg": "This field is required"})
    new_work_type = WorkType(name=name)
    db.session.add(new_work_type)
    db.session.commit()
    return jsonify(new_work_type.serialize())


@api.route("/WorkType/<int:id>", methods=["PUT"])
def new_work_type_put(id):
    new_work_type = WorkType.query.filter_by(id=id).first()
    if not new_work_type:
        return jsonify({"msg": "new_work_type not founded"})
    data = request.get_json()
    name = data.get("name")
    if not name:
        return jsonify({"msg": "This field is required"})
    if name:
        new_work_type.name = name
    db.session.commit()
    return jsonify(new_work_type.serialize())


@api.route("/WorkType/<int:id>", methods=["DELETE"])
def new_work_type_delete(id):
    new_work_type = WorkType.query.filter_by(id=id).first()
    if not new_work_type:
        return jsonify({"msg": "new_work_type not founded"})
    db.session.remove(new_work_type)
    db.session.commit()
    return jsonify({"msg": "This new_work_type was deleted"})


# -----------------------------EmploymentType-----------------------------#
@api.route("/EmploymentType", methods=["GET"])
def employment_type_get():
    employment_types = EmploymentType.query.order_by(
        EmploymentType.id.asc()).all()
    list_employment_type = [employment_type.serialize()
                            for employment_type in employment_types]
    return jsonify(list_employment_type)


@api.route("/EmploymentType/<int:id>", methods=["GET"])
def employment_type_id(id):
    employment_type = EmploymentType.query.filter_by(id=id).first()
    if not employment_type:
        return jsonify({"msg": "employment_type not found"}), 404
    return jsonify(employment_type.serialize())


@api.route("/EmploymentType", methods=["POST"])
def employment_type_post():
    data = request.get_json()
    name = data.get("name")
    if not name:
        return jsonify({"msg": "This field is required"})
    new_employment_type = EmploymentType(name=name)
    db.session.add(new_employment_type)
    db.session.commit()
    return jsonify(new_employment_type.serialize())


@api.route("/EmploymentType/<int:id>", methods=["PUT"])
def employment_type_put(id):
    employment_type = EmploymentType.query.filter_by(id=id).first()
    if not employment_type:
        return jsonify({"msg": "employment_type not founded"})
    data = request.get_json()
    name = data.get("name")
    if not name:
        return jsonify({"msg": "This field is required"})
    if name:
        employment_type.name = name
    db.session.commit()
    return jsonify(employment_type.serializer())


@api.route("/EmploymentType/<int:id>", methods=["DELETE"])
def employment_type_delete(id):
    employment_type = EmploymentType.query.filter_by(id=id).first()
    if not employment_type:
        return jsonify({"msg": "employment_type not founded"})
    db.session.remove(employment_type)
    db.session.commit()
    return jsonify({"msg": "This employment_type was deleted"})

# -----------------------------Profile-----------------------------#


@api.route("/profile", methods=['GET'])
@jwt_required()
def profile_get():
    current_user = get_jwt_identity()
    user = User.query.get(current_user)
    profile = Profile.query.filter_by(user_id=user.id).first()
    if not profile:
        return jsonify({"message": "Profile not found"}), 404
    data = profile.serialize()
    print(data)  # Debug output
    return jsonify(data)


@api.route("/profile", methods=['POST'])
@jwt_required()
def profile_post():
    current_user = get_jwt_identity()
    user = User.query.get(current_user)

    first_name = request.form.get("first_name")
    last_name = request.form.get("last_name")
    bio = request.form.get("bio")
    image_file = request.files.get("image_filename")
    skills_input = request.form.getlist("skills")
    gender_id = request.form.get("gender_id")
    image_filename = None
    if image_file:
        image_filename = save_uploaded_file(
            image_file, upload_folder=os.getenv('UPLOAD_FOLDER', '/tmp/uploads'))

    new_profile = Profile(
        first_name=first_name,
        last_name=last_name,
        image_filename=image_filename,
        bio=bio,
        gender_id=gender_id,
        user_id=user.id
    )

    skills_objects = []
    for skill_name in skills_input:
        skill = Skill.query.filter_by(name=skill_name).first()
        if not skill:
            skill = Skill(name=skill_name)
            db.session.add(skill)
            db.session.flush()
        skills_objects.append(skill)

    new_profile.skills = skills_objects
    db.session.add(new_profile)
    db.session.commit()

    return jsonify(new_profile.serialize())


@api.route("/profile/<int:id>", methods=['PUT'])
@jwt_required()
def profile_put(id):
    current_user = int(get_jwt_identity())
    user = User.query.get(current_user)
    profile = Profile.query.filter_by(user_id=user.id).first()

    first_name = request.form.get("first_name")
    last_name = request.form.get("last_name")
    bio = request.form.get("bio")
    skills = request.form.getlist("skills")
    gender_id = request.form.get("gender_id")
    image_file = request.files.get("image_filename")

    if not profile:
        profile = Profile(user_id=user.id)

    if first_name:
        profile.first_name = first_name
    if last_name:
        profile.last_name = last_name
    if bio:
        profile.bio = bio

    # Fix here: assign gender relationship object, not just id
    if gender_id:
        gender_obj = Gender.query.get(int(gender_id))
        profile.gender = gender_obj

    if image_file:
        image_filename = save_uploaded_file(
            image_file,
            upload_folder=os.getenv('UPLOAD_FOLDER', '/tmp/uploads')
        )
        profile.image_filename = image_filename

    if skills:
        skill_objects = []
        for skill_name in skills:
            skill = Skill.query.filter_by(name=skill_name).first()
            if not skill:
                skill = Skill(name=skill_name)
                db.session.add(skill)
                db.session.flush()
            skill_objects.append(skill)
        profile.skills = skill_objects

    db.session.add(profile)
    db.session.commit()

    return jsonify(profile.serialize()), 200

# -----------------------------Postulaciones-----------------------------#


@api.route("/posts/my-post-count", methods=["GET"])
@jwt_required()
def count_post():
    current_user = get_jwt_identity()
    user = User.query.get(current_user)
    count = Postulaciones.query.filter_by(user_id=user.id).count()
    return jsonify({"count": count})


@api.route("/posts/entrevista", methods=["GET"])
@jwt_required()
def count_entrevista():
    current_user = get_jwt_identity()
    user = User.query.get(current_user)
    if not user:
        return jsonify({"error": "User not found"}), 404

    social_status = SocialMediaStatus.query.filter_by(
        name="Entrevista").first()
    if not social_status:
        return jsonify({"error": "SocialMediaStatus 'Entrevista' not found"}), 404

    count = Postulaciones.query.filter(
        Postulaciones.user_id == user.id,
        Postulaciones.social_media_statuses.any(
            SocialMediaStatus.id == social_status.id)
    ).count()

    return jsonify({"entrevista": count})


@api.route("/posts/ofertas", methods=["GET"])
@jwt_required()
def count_ofertas():
    current_user = get_jwt_identity()
    user = User.query.get(current_user)
    if not user:
        return jsonify({"error": "User not found"}), 404

    social_status = SocialMediaStatus.query.filter_by(
        name="Ofertas").first()
    if not social_status:
        return jsonify({"error": "SocialMediaStatus 'Ofertas' not found"}), 404

    count = Postulaciones.query.filter(
        Postulaciones.user_id == user.id,
        Postulaciones.social_media_statuses.any(
            SocialMediaStatus.id == social_status.id)
    ).count()

    return jsonify({"ofertas": count})


@api.route("/posts/descartado", methods=["GET"])
@jwt_required()
def count_descartado():
    current_user = get_jwt_identity()
    user = User.query.get(current_user)
    if not user:
        return jsonify({"error": "User not found"}), 404

    social_status = SocialMediaStatus.query.filter_by(
        name="Descartado").first()
    if not social_status:
        return jsonify({"error": "SocialMediaStatus 'Descartado' not found"}), 404

    count = Postulaciones.query.filter(
        Postulaciones.user_id == user.id,
        Postulaciones.social_media_statuses.any(
            SocialMediaStatus.id == social_status.id)
    ).count()

    return jsonify({"descartado": count})


@api.route("/posts", methods=["GET"])
def postulaciones_get():
    postulaciones = Postulaciones.query.order_by(Postulaciones.id.asc()).all()
    postulaciones_list = [post.serialize() for post in postulaciones]
    return jsonify(postulaciones_list)


@api.route("/posts/<int:id>", methods=["GET"])
def postulaciones_get_id(id):
    postulaciones = Postulaciones.query.filter_by(id=id).first()
    return jsonify(postulaciones.serialize())


@api.route("/posts", methods=["POST"])
@jwt_required()
def postulaciones_post():
    current_user_id = get_jwt_identity()
    data = request.get_json()

    def safe_int(val, default=None):
        try:
            return int(val)
        except (ValueError, TypeError):
            return default

    # Basic fields from request
    nombre_empresa = data.get("nombre_empresa")
    expireiance = data.get("expireiance")
    city_id = safe_int(data.get("city_id"))
    salary = data.get("salary")
    category_id = safe_int(data.get("category_id"))
    work_type_id = safe_int(data.get("work_type_id"))
    employment_type_id = safe_int(data.get("employment_type_id"))
    persona_de_contacto = data.get("persona_de_contacto")
    requirements = data.get("requirements")
    candidates_applied = safe_int(data.get("candidates_applied"))
    completed_interviews = safe_int(data.get("completed_interviews"))
    positions = safe_int(data.get("positions"))
    job_description = data.get("job_description")

    # Validate essential foreign keys presence
    if None in [city_id, category_id, work_type_id, employment_type_id]:
        return {"error": "Invalid or missing foreign key IDs"}, 400

    # Validate existence of foreign keys in DB
    if not City.query.get(city_id):
        return {"error": "City not found"}, 404
    if not Category.query.get(category_id):
        return {"error": "Category not found"}, 404
    if not WorkType.query.get(work_type_id):
        return {"error": "Work type not found"}, 404
    if not EmploymentType.query.get(employment_type_id):
        return {"error": "Employment type not found"}, 404

    # Handle social media with statuses: list of { platform: social_media_id, status: [status_id, ...] }
    social_media_list = data.get("social_media", [])

    social_media_status_entries = []

    for sm in social_media_list:
        sm_platform = sm.get("platform")  # expecting int social_media_id
        sm_status_ids = sm.get("status")

        if sm_platform is None:
            return {"error": "Missing social media platform id"}, 400

        # Normalize status ids to a list
        if not isinstance(sm_status_ids, list):
            sm_status_ids = [sm_status_ids]

        social_media = SocialMedia.query.get(sm_platform)
        if not social_media:
            return {"error": f"Social media platform with id {sm_platform} not found"}, 404

        for status_id in sm_status_ids:
            sm_status_id = safe_int(status_id)
            if sm_status_id is None:
                return {"error": "Invalid social media status id"}, 400

            sm_status = SocialMediaStatus.query.get(sm_status_id)
            if not sm_status:
                return {"error": f"Social media status id {sm_status_id} not found"}, 404

            social_media_status_entries.append((social_media.id, sm_status.id))

    # Handle skills by IDs
    skills_ids = [safe_int(i) for i in data.get(
        "skills", []) if safe_int(i) is not None]
    skills_objects = Skill.query.filter(Skill.id.in_(skills_ids)).all()

    pending_status = Status.query.filter_by(name="pending").first()
    if not pending_status:
        return {"error": "Missing 'pending' status in DB"}, 500

    new_postulacion = Postulaciones(
        nombre_empresa=nombre_empresa,
        expireiance=expireiance,
        city_id=city_id,
        salary=salary,
        status_id=pending_status.id,
        category_id=category_id,
        work_type_id=work_type_id,
        employment_type_id=employment_type_id,
        persona_de_contacto=persona_de_contacto,
        requirements=requirements,
        candidates_applied=candidates_applied,
        completed_interviews=completed_interviews,
        job_description=job_description,
        positions=positions,
        user_id=safe_int(current_user_id),
        skills=skills_objects,
    )

    db.session.add(new_postulacion)
    db.session.flush()  # get new_postulacion.id for association tables

    # Insert all social media + status entries (multiple allowed now)
    for social_media_id, social_media_status_id in social_media_status_entries:
        stmt = postulacion_social_media.insert().values(
            postulacion_id=new_postulacion.id,
            social_media_id=social_media_id,
            social_media_status_id=social_media_status_id,
        )
        db.session.execute(stmt)

    # Calculate matched percentage
    user = User.query.get(new_postulacion.user_id)
    profile = Profile.query.filter_by(
        user_id=user.id).first() if user else None

    post_skill_ids = {skill.id for skill in skills_objects}
    profile_skill_ids = {
        skill.id for skill in profile.skills} if profile else set()

    matched_count = len(post_skill_ids & profile_skill_ids)
    matched_percentage = (matched_count / len(post_skill_ids)
                          * 100) if post_skill_ids else 0
    new_postulacion.matched_percentage = round(matched_percentage, 2)

    db.session.commit()

    return jsonify(new_postulacion.serialize()), 201


@api.route("/social_media_status", methods=["GET"])
def social_media_status():
    social_media_status = SocialMediaStatus.query.order_by(
        SocialMediaStatus.id.asc()).all()
    list_s = [social_media.serialize() for social_media in social_media_status]
    return jsonify(list_s)


@api.route("/posts/<int:id>", methods=["PUT"])
@jwt_required()
def postulaciones_put(id):
    current_user_id = int(get_jwt_identity())
    postulacion = Postulaciones.query.get(id)

    if not postulacion:
        return {"msg": "Postulación not found"}, 404

    # Optional: Ensure only owner can update
    if postulacion.user_id != current_user_id:
        return {"msg": "Unauthorized"}, 403

    nombre_empressa = request.form.get("nombre_empressa")
    expireiance = request.form.get("expireiance")
    city_id = request.form.get("city_id")
    status_id = request.form.get("status_id")
    category_id = request.form.get("category_id")
    work_type_id = request.form.get("work_type_id")
    employment_type_id = request.form.get("employment_type_id")
    persona_de_contacto = request.form.get("persona_de_contacto")
    requirements = request.form.get("requirements")
    candidates_applied = request.form.get("candidates_applied")
    completed_interviews = request.form.get("completed_interviews")
    positions = request.form.get("positions")
    job_description = request.form.get("job_description")

    skills_input = request.form.getlist("skills")
    social_media_name = request.form.get("social_media_name")
    social_media_status_names = request.form.getlist("social_media_statuses")

    if nombre_empressa:
        postulacion.nombre_empressa = nombre_empressa
    if expireiance:
        postulacion.expireiance = expireiance
    if city_id:
        postulacion.city_id = city_id
    if status_id:
        postulacion.status_id = status_id
    if category_id:
        postulacion.category_id = category_id
    if work_type_id:
        postulacion.work_type_id = work_type_id
    if employment_type_id:
        postulacion.employment_type_id = employment_type_id
    if persona_de_contacto:
        postulacion.persona_de_contacto = persona_de_contacto
    if requirements:
        postulacion.requirements = requirements
    if candidates_applied:
        postulacion.candidates_applied = candidates_applied
    if completed_interviews:
        postulacion.completed_interviews = completed_interviews
    if positions:
        postulacion.positions = positions
    if job_description:
        postulacion.job_description = job_description

    if social_media_name:
        social_media = SocialMedia.query.filter_by(
            name=social_media_name).first()
        if not social_media:
            social_media = SocialMedia(name=social_media_name)
            db.session.add(social_media)
            db.session.flush()
        postulacion.social_media = social_media

        statuses = []
        for status_name in social_media_status_names:
            status = SocialMediaStatus.query.filter_by(
                name=status_name).first()
            if not status:
                status = SocialMediaStatus(name=status_name)
                db.session.add(status)
                db.session.flush()
            statuses.append(status)
        postulacion.social_media_statuses = statuses

    if skills_input:
        skills_objects = []
        for skill_name in skills_input:
            skill = Skill.query.filter_by(name=skill_name).first()
            if not skill:
                skill = Skill(name=skill_name)
                db.session.add(skill)
                db.session.flush()
            skills_objects.append(skill)
        postulacion.skills = skills_objects

    user = User.query.get(current_user_id)
    profile = Profile.query.filter_by(
        user_id=user.id).first() if user else None

    post_skill_ids = set(skill.id for skill in postulacion.skills)
    profile_skill_ids = set(
        skill.id for skill in profile.skills) if profile else set()

    matched_count = len(post_skill_ids & profile_skill_ids)
    matched_percentage = (matched_count / len(post_skill_ids)
                          * 100) if post_skill_ids else 0
    postulacion.matched_percentage = round(matched_percentage, 2)

    db.session.commit()

    return jsonify(postulacion.serialize()), 200


@api.route("/post/<int:id>", methods=['DELETE'])
@jwt_required()
def postulacines_delete(id):
    postulaciones = Postulaciones.query.filter_by(id=id).first()
    if not postulaciones:
        return jsonify({"msg": "postulaciones dosnt founded"})
    db.session.remove(postulaciones)
    return jsonify({"msg": "This was delete "})
