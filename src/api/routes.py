from flask import Response
import requests
import traceback
from werkzeug.utils import secure_filename
import openai
import os
from dotenv import load_dotenv
from flask_bcrypt import Bcrypt
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, CV
from flask import Flask, request, jsonify, url_for, Blueprint, send_from_directory
from api.models import db, User, Postulations, Profile
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import json
from datetime import datetime
from api.data_mock.mock_data import jobs
from datetime import datetime
from flask import Response, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from io import BytesIO
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor
from reportlab.lib.utils import ImageReader
import json
import base64


api = Blueprint('api', __name__)

CORS(api)
bcrypt = Bcrypt()

bcrypt = Bcrypt()

load_dotenv()
api_key = ("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")
bcrypt = Bcrypt()


openai.api_key = api_key
GOOGLE_API_KEY = "AIzaSyC-8znGPyiPtg52au8Qm8m1NQehlPLS_uI"


@api.route('/translate', methods=['POST'])
def translate():
    data = request.json
    texts = data.get("texts")
    target = data.get("target")

    if not texts or not target:
        return jsonify({"error": "Missing 'texts' or 'target' in request body"}), 400

    url = f"https://translation.googleapis.com/language/translate/v2?key={GOOGLE_API_KEY}"

    body = {
        "q": texts,
        "target": target,
    }

    try:
        response = requests.post(url, data=body)
        response.raise_for_status()

        translations = response.json().get("data", {}).get("translations", [])
        translated_texts = [t["translatedText"] for t in translations]
        return jsonify(translated_texts)
    except requests.exceptions.HTTPError as err:
        print(f"Error in /api/translate: {err}")

        return jsonify({"error": str(err), "details": response.text}), 500


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
        traceback.print_exc()
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


@api.route('/uploads/<filename>')
def uploaded_file(filename):
    upload_folder = os.getenv('UPLOAD_FOLDER', '/tmp/uploads')
    return send_from_directory(upload_folder, filename)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    return jsonify({"message": "Hello! I'm a message that came from the backend"}), 200


""" ---------- REGISTER ENDPOINT ----------- """


@api.route('/register', methods=['POST', 'GET'])
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


""" ------------ LOGIN ENDPOINT ----------- """


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


@api.route("/cv/<int:cv_id>/pdf", methods=["GET"])
@jwt_required()
def generate_cv_pdf(cv_id):
    try:
        current_user_id = get_jwt_identity()
        cv = CV.query.filter_by(id=cv_id, user_id=current_user_id).first()

        if not cv:
            return jsonify({"success": False, "message": "CV no encontrado"}), 404

        datos = json.loads(cv.datos)

        def normalizar_periodos(lista):
            for item in lista:
                periodo = item.get("periodo", "")
                if periodo:
                    partes = periodo.replace("–", "-").split("-")
                    if len(partes) == 2:
                        item["inicio"] = partes[0].strip()
                        item["fin"] = partes[1].strip()
                    else:
                        item["inicio"] = periodo
                        item["fin"] = ""
                item.setdefault("inicio", "")
                item.setdefault("fin", "")

        datos.setdefault("perfil", datos.get("resumen", ""))
        datos.setdefault("habilidades", [])
        datos.setdefault("experiencia", [])
        datos.setdefault("educacion", [])
        datos.setdefault("ubicacion", "")
        datos.setdefault("linkedin", "")
        datos.setdefault("github", "")

        normalizar_periodos(datos["experiencia"])
        normalizar_periodos(datos["educacion"])

        buffer = BytesIO()
        p = canvas.Canvas(buffer, pagesize=A4)

        width, height = A4
        x_margin = 60
        y = height - 80

        title_color = HexColor("#005A9C")
        text_color = HexColor("#2E2E2E")
        muted_color = HexColor("#555555")
        border_color = HexColor("#CCCCCC")

        p.setStrokeColor(border_color)
        p.setLineWidth(1)
        p.rect(x_margin - 20, 50, width - (x_margin - 20)
               * 2, height - 120, stroke=1, fill=0)

        foto_base64 = datos.get("foto", "")
        text_x = x_margin
        text_y = y

        if foto_base64:
            try:
                if foto_base64.startswith("data:image"):
                    foto_base64 = foto_base64.split(",")[1]
                foto_bytes = base64.b64decode(foto_base64)
                foto_image = ImageReader(BytesIO(foto_bytes))
                foto_width = 110
                foto_height = 110
                foto_x = x_margin
                foto_y = y
                p.drawImage(foto_image, foto_x, foto_y - foto_height, foto_width,
                            foto_height, preserveAspectRatio=True, mask='auto')
                text_x = foto_x + foto_width + 25
                text_y = foto_y
            except:
                text_x = x_margin
                text_y = y

        nombre = datos.get("nombre", "")[:60]
        font_size = 22
        max_nombre_width = width - text_x - x_margin
        while p.stringWidth(nombre, "Helvetica-Bold", font_size) > max_nombre_width and font_size > 12:
            font_size -= 1

        p.setFont("Helvetica-Bold", font_size)
        p.setFillColor(title_color)
        p.drawString(text_x, text_y, nombre)
        text_y -= font_size + 4

        p.setFont("Helvetica", 11)
        p.setFillColor(muted_color)

        if datos.get("email"):
            p.drawString(text_x, text_y, f"Email: {datos['email']}")
            text_y -= 16
        if datos.get("telefono"):
            p.drawString(text_x, text_y, f"Teléfono: {datos['telefono']}")
            text_y -= 16
        if datos.get("direccion"):
            p.drawString(text_x, text_y, f"Dirección: {datos['direccion']}")
            text_y -= 16
        if datos.get("ubicacion"):
            p.drawString(text_x, text_y, f"Ubicación: {datos['ubicacion']}")
            text_y -= 16
        if datos.get("linkedin"):
            p.drawString(text_x, text_y, f"LinkedIn: {datos['linkedin']}")
            text_y -= 16
        if datos.get("github"):
            p.drawString(text_x, text_y, f"GitHub: {datos['github']}")
            text_y -= 16

        y = min(y - 130, text_y - 40)

        p.setStrokeColor(border_color)
        p.setLineWidth(0.5)
        p.line(x_margin - 10, y, width - x_margin + 10, y)
        y -= 30

        from reportlab.platypus import Paragraph
        from reportlab.lib.styles import getSampleStyleSheet

        styles = getSampleStyleSheet()
        style = styles["Normal"]
        style.fontName = "Helvetica"
        style.fontSize = 11
        style.textColor = text_color
        style.leading = 14

        def seccion(titulo):
            nonlocal y
            p.setFont("Helvetica-Bold", 13)
            p.setFillColor(title_color)
            p.drawString(x_margin, y, titulo.upper())
            y -= 8
            p.setStrokeColor(border_color)
            p.setLineWidth(0.3)
            p.line(x_margin, y, width - x_margin, y)
            y -= 20

        if datos["perfil"]:
            seccion("Perfil profesional")
            para = Paragraph(datos["perfil"], style)
            w, h = para.wrap(width - 2 * x_margin, height)
            para.drawOn(p, x_margin, y - h)
            y -= h + 20

        if datos["experiencia"]:
            seccion("Experiencia")
            for exp in datos["experiencia"]:
                if exp.get("puesto"):
                    p.setFont("Helvetica-Bold", 11)
                    p.setFillColor(text_color)
                    p.drawString(x_margin, y, exp["puesto"])
                    y -= 14
                if exp.get("empresa"):
                    p.setFont("Helvetica", 11)
                    p.setFillColor(muted_color)
                    p.drawString(x_margin, y, exp["empresa"])
                    y -= 14
                periodo = f"{exp['inicio']} – {exp['fin']}".strip(" –")
                if periodo:
                    p.setFont("Helvetica-Oblique", 10)
                    p.setFillColor(muted_color)
                    p.drawString(x_margin, y, periodo)
                    y -= 12
                if exp.get("descripcion"):
                    para = Paragraph(exp["descripcion"], style)
                    w, h = para.wrap(width - 2 * x_margin, height)
                    para.drawOn(p, x_margin, y - h)
                    y -= h + 10
                y -= 6
            y -= 10

        if datos["educacion"]:
            seccion("Educación")
            for edu in datos["educacion"]:
                if edu.get("titulo"):
                    p.setFont("Helvetica-Bold", 11)
                    p.setFillColor(text_color)
                    p.drawString(x_margin, y, edu["titulo"])
                    y -= 14
                if edu.get("institucion"):
                    p.setFont("Helvetica", 11)
                    p.setFillColor(muted_color)
                    p.drawString(x_margin, y, edu["institucion"])
                    y -= 14
                periodo = f"{edu['inicio']} – {edu['fin']}".strip(" –")
                if periodo:
                    p.setFont("Helvetica-Oblique", 10)
                    p.setFillColor(muted_color)
                    p.drawString(x_margin, y, periodo)
                    y -= 12
                y -= 6
            y -= 10

        if datos["habilidades"]:
            seccion("Habilidades")
            skills = " · ".join(datos["habilidades"])
            para = Paragraph(skills, style)
            w, h = para.wrap(width - 2 * x_margin, height)
            para.drawOn(p, x_margin, y - h)
            y -= h + 10

        p.showPage()
        p.save()

        buffer.seek(0)
        pdf_content = buffer.getvalue()

        return Response(pdf_content, mimetype="application/pdf", headers={"Content-Disposition": f"inline; filename=cv-{cv_id}.pdf"})

    except Exception as e:
        print(f"ERROR: {e}")
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


@api.route("/postulacion/count", methods=["GET"])
@jwt_required()
def status_count():
    current_user = get_jwt_identity()
    postulacion = Postulations.query.filter_by(user_id=current_user).count()
    return jsonify({"postulation": postulacion})


@api.route("/postulacion/abierta", methods=["GET"])
@jwt_required()
def status_abierta_get():
    current_user = get_jwt_identity()
    postulacion = Postulations.query.filter_by(
        user_id=current_user, postulation_state="abierta").count()
    return jsonify({"abierta": postulacion})


@api.route("/postulacion/en_proceso", methods=["GET"])
@jwt_required()
def status_en_proceso_get():
    current_user = get_jwt_identity()
    postulacion = Postulations.query.filter_by(
        user_id=current_user, postulation_state="en proceso").count()
    return jsonify({"en_proceso": postulacion})


@api.route("/postulacion/entrevista", methods=["GET"])
@jwt_required()
def status_entrevista_get():
    current_user = get_jwt_identity()
    postulacion = Postulations.query.filter_by(
        user_id=current_user, postulation_state="entrevista").count()
    return jsonify({"entrevista": postulacion})


@api.route("/postulacion/oferta", methods=["GET"])
@jwt_required()
def status_oferta_get():
    current_user = get_jwt_identity()
    postulacion = Postulations.query.filter_by(
        user_id=current_user, postulation_state="oferta").count()
    return jsonify({"oferta": postulacion})


@api.route("/postulacion/descartado", methods=["GET"])
@jwt_required()
def status_descartado_get():
    current_user = get_jwt_identity()
    postulacion = Postulations.query.filter_by(
        user_id=current_user, postulation_state="descartado").count()
    return jsonify({"descartado": postulacion})


@api.route("/postulacion/aceptada", methods=["GET"])
@jwt_required()
def status_aceptada_get():
    current_user = get_jwt_identity()
    postulacion = Postulations.query.filter_by(
        user_id=current_user, postulation_state="aceptada").count()
    return jsonify({"aceptada": postulacion})


@api.route("/profile", methods=["GET"])
@jwt_required()
def profile_get():
    current_user = get_jwt_identity()
    profile = Profile.query.filter_by(user_id=current_user).first()
    if profile is None:
        return jsonify({"msg": "Profile not created", "profile": None}), 200
    return jsonify(profile.serialize()), 200


@api.route("/profile", methods=["POST"])
@jwt_required()
def profile_post():
    current_user = get_jwt_identity()
    first_name = request.form.get("first_name")
    last_name = request.form.get("last_name")
    bio = request.form.get("bio")
    skill = request.form.getlist("skill")
    img_profile = request.files.get("img_profile")
    image_filename = save_uploaded_file(
        img_profile, upload_folder=os.getenv('UPLOAD_FOLDER', '/tmp/uploads'))

    if not first_name and not last_name and not skill and not bio:
        return jsonify({"msg": "Missing something the field"})
    if not isinstance(skill, list):
        return jsonify({"msg": "is list"})
    new_profile = Profile(

        first_name=first_name,
        last_name=last_name,
        skill=skill,
        img_profile=image_filename,
        bio=bio,
        user_id=current_user
    )
    db.session.add(new_profile)
    db.session.commit()
    return jsonify(new_profile.serialize()), 200


@api.route("/profile/<int:id>", methods=["PUT"])
@jwt_required()
def profile_update(id):
    current_user = get_jwt_identity()
    profile = Profile.query.filter_by(user_id=current_user).first()
    first_name = request.form.get("first_name")
    last_name = request.form.get("last_name")
    bio = request.form.get("bio")
    skill = request.form.getlist("skill")
    img_profile = request.files.get("img_profile")
    if not isinstance(skill, list):
        return jsonify({"msg": "is list"})
    if first_name:
        profile.first_name = first_name
    if last_name:
        profile.last_name = last_name
    if skill:
        profile.skill = skill
    if img_profile:
        profile.img_profile = save_uploaded_file(
            img_profile, upload_folder=os.getenv('UPLOAD_FOLDER', '/tmp/uploads'))
    if bio:
        profile.bio = bio
    db.session.commit()
    return jsonify(profile.serialize()), 200
