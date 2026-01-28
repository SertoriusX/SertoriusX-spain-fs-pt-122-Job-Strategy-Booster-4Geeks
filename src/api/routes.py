import traceback
from werkzeug.utils import secure_filename
import requests
import openai
import os
from dotenv import load_dotenv
from flask_bcrypt import Bcrypt
from api.models import db, User, CV
from flask import Flask, request, jsonify, url_for, Blueprint, send_from_directory
from api.models import db, User, Postulations, Profile, Stages
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import json
from datetime import datetime
from api.data_mock.mock_data import jobs
from datetime import datetime,date
import pytesseract
from PIL import Image

api = Blueprint('api', __name__)
from dotenv import load_dotenv
import os
import traceback 
import openai
import requests  
from werkzeug.utils import secure_filename
import re

CORS(api)
bcrypt = Bcrypt()

bcrypt = Bcrypt()

load_dotenv()
api_key = ("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")
bcrypt = Bcrypt()
load_dotenv()  
api_key = ("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")
bcrypt = Bcrypt() 


openai.api_key = api_key
GOOGLE_API_KEY = "AIzaSyC-8znGPyiPtg52au8Qm8m1NQehlPLS_uI"

sessions = {}
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

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


QUESTIONS = {
    "frontend": [
        "¿Qué es el Virtual DOM y por qué es importante?",
        "¿Qué es CSS Flexbox y para qué sirve?",
        "¿Qué es un closure en JavaScript?",
        "¿Cuál es la diferencia entre 'var', 'let' y 'const' en JavaScript?",
        "¿Qué son las promesas en JavaScript y cómo funcionan?",
        "¿Cómo manejas eventos en JavaScript?",
        "¿Qué es el modelo de caja (box model) en CSS?",
        "¿Qué son las media queries y cómo se usan para responsive design?",
        "¿Qué es la herencia en CSS y cómo funciona?"
    ],
    "backend": [
        "¿Qué es una API REST?",
        "¿Qué es una base de datos relacional?",
        "¿Qué son los middlewares en backend?",
        "¿Qué diferencias hay entre SQL y NoSQL?",
        "¿Qué es la autenticación y autorización?",
        "¿Qué es un token JWT y para qué se usa?",
        "¿Cómo funciona el manejo de sesiones en aplicaciones web?",
        "¿Qué es un servidor web y cómo funciona?",
        "¿Qué es la escalabilidad en backend?"
    ],
    "react": [
        "¿Qué es el estado (state) en React?",
        "¿Qué es un Hook?",
        "¿Cómo funcionan los componentes funcionales?",
        "¿Qué es el ciclo de vida de un componente en React?",
        "¿Qué es Redux y para qué se utiliza?",
        "¿Qué es el Context API en React?",
        "¿Cómo optimizas el rendimiento en una aplicación React?",
        "¿Qué son las props y cómo se usan?",
        "¿Qué diferencia hay entre componentes controlados y no controlados?"
    ],
    "angular": [
        "¿Qué es un módulo en Angular?",
        "¿Qué es un servicio en Angular?",
        "¿Qué es RxJS y cómo se usa?",
        "¿Qué es el data binding en Angular?",
        "¿Qué son los decoradores en Angular?",
        "¿Cómo funcionan los pipes en Angular?",
        "¿Qué es la inyección de dependencias?",
        "¿Qué es un componente y cómo se comunica con otros?",
        "¿Cómo manejas el enrutamiento en Angular?"
    ]
    ,"personal": [
        "¿Dónde te ves en cinco años?",
        "¿Cuál es tu mayor fortaleza y debilidad?",
        "¿Cómo manejas el estrés o la presión en el trabajo?",
        "Descríbeme una situación en la que hayas tenido que resolver un conflicto.",
        "¿Por qué quieres trabajar con nosotros?",
        "¿Qué te motiva a dar lo mejor de ti?",
        "¿Cómo te mantienes actualizado y mejorando profesionalmente?",
        "Cuéntame sobre un error que hayas cometido y cómo lo solucionaste.",
        "¿Prefieres trabajar en equipo o de forma independiente? ¿Por qué?"
    ]
}


RESOURCES = {
    "frontend": [
        "https://roadmap.sh/frontend",
        "https://frontendmentor.io",
        "https://cssbattle.dev",
    ],
    "backend": [
        "https://roadmap.sh/backend",
        "https://leetcode.com",
        "https://sqlbolt.com",
    ],
    "react": [
        "https://roadmap.sh/react",
        "https://react.dev/learn",
        "https://frontendmentor.io",
    ],
    "angular": [
        "https://roadmap.sh/angular",
        "https://angular.io/tutorial",
        "https://rxjs.dev",
    ],
}



def clean_company_name(line: str, max_length=50) -> str:
    line = re.sub(r"http\S+", "", line)
    line = re.sub(r"\d+", "", line)
    line = re.sub(r"[^\w\s.,-]", "", line)
    line = line.strip()
    return line[:max_length]


def extract_postulation_fields(text):
    clean_text = text.replace("€", " €").replace("$", " $")
    lines = [l.strip() for l in clean_text.split("\n") if len(l.strip()) > 3]
    full_text = " ".join(lines).lower()

    data = {
        "company_name": None,
        "role": None,
        "city": None,
        "platform": None,
        "work_type": "Unknown",
        "experience": 0,
        "salary": 0,
        "candidates_applied": 0,
        "postulation_url": None,
        "requirements": [],
        "job_description": clean_text[:800]
    }

    for line in lines:
        if " at " in line.lower():
            parts = re.split(r"\s+at\s+", line, flags=re.IGNORECASE)
            if len(parts) == 2:
                data["role"] = parts[0].strip()
                data["company_name"] = clean_company_name(parts[1])
                break

    if not data["company_name"]:
        for line in lines:
            if "empresa" in line.lower():
                data["company_name"] = clean_company_name(line)
                break

    if not data["company_name"] and lines:
        data["company_name"] = clean_company_name(lines[0])


    if not data["role"]:
        for line in lines:
            if any(k in line.lower() for k in ["limpieza", "personal", "operario"]):
                data["role"] = line.strip()
                break

    if not data["role"] and len(lines) > 1:
        data["role"] = lines[1]


   
    city_match = re.search(r"municipio:\s*([a-záéíóúñ]+)", full_text)
    if city_match:
        data["city"] = city_match.group(1).title()

    if not data["city"]:
        city_match2 = re.search(r"\(([^)]*murcia[^)]*)\)", full_text)
        if city_match2:
            data["city"] = "Murcia"

    if not data["city"]:
        for city in ["murcia", "barcelona", "madrid", "valencia", "sevilla", "santander"]:
            if city in full_text:
                data["city"] = city.title()
                break


  
    if "linkedin" in full_text:
        data["platform"] = "Linkedin"
    elif "sefcarm" in full_text or "sefoficinavirtual" in full_text:
        data["platform"] = "Sefcarm"



    if "presencial" in full_text or "on-site" in full_text:
        data["work_type"] = "Presencial"
    elif "remoto" in full_text or "remote" in full_text:
        data["work_type"] = "Remoto"
    elif "híbrido" in full_text or "hybrid" in full_text:
        data["work_type"] = "Híbrido"

    if "lunes a viernes" in full_text:
        data["work_type"] = "Presencial"



    exp_match = re.search(r"experiencia.*?(\d+)\s*(meses|años)", full_text)
    if exp_match:
        num = int(exp_match.group(1))
        data["experience"] = num if "meses" in exp_match.group(2) else num * 12


    salary_match = re.search(r"(\d{3,5})\s*euros", full_text)
    if salary_match:
        data["salary"] = int(salary_match.group(1))


    applied_match = re.search(r"más de (\d+)\s+solicitudes", full_text)
    if applied_match:
        data["candidates_applied"] = int(applied_match.group(1))


   
    for line in lines:
        if any(kw in line.lower() for kw in ["se requiere", "tener", "poseer", "estar inscrito"]):
            data["requirements"].append(line.strip())

    for line in lines:
        if any(kw in line.lower() for kw in ["aptitudes", "habilidades"]):
            data["requirements"].append(line.strip())



    url_match = re.search(r"(https?://[^\s]+)", text)
    if url_match:
        data["postulation_url"] = url_match.group(1)

    return data


@api.route("/ocr-postulation", methods=["POST"])
@jwt_required()
def ocr_postulation():
    file = request.files.get("image")
    if not file:
        return jsonify({"error": "No image file provided"}), 400

    current_user = get_jwt_identity()

    upload_dir = "uploads"
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir)

    path = os.path.join(upload_dir, file.filename)
    file.save(path)

    img = Image.open(path)
    text = pytesseract.image_to_string(img)

    data = extract_postulation_fields(text)

    requirements = data.get("requirements")
    if not isinstance(requirements, list):
        requirements = []

    postulation = Postulations(
        postulation_state="pending",
        company_name=data.get("company_name") or "Unknown",
        role=data.get("role") or "Unknown",
        experience=data.get("experience", 0),
        inscription_date=date.today(),
        city=data.get("city") or "Unknown",
        salary=data.get("salary", 0),
        platform=data.get("platform") or "Unknown",
        postulation_url="",
        work_type=data.get("work_type") or "Unknown",
        requirements=requirements,
        candidates_applied=data.get("candidates_applied") or 0,
        available_positions=1,
        job_description=data.get("job_description"),
        user_id=current_user
    )

    db.session.add(postulation)
    db.session.commit()

    return jsonify(postulation.serialize()), 201
@api.route('/chat',methods=["POST"])
@jwt_required()
def chat():
    try:
        user_id = get_jwt_identity()
        data = request.json or {}
        user_message = data.get("message", "").lower().strip()
        
        if user_id not in sessions:
            sessions[user_id] = {
                "state": "WAIT_READY",
                "role": None,
                "question_index": 0
            }
            return jsonify({
                "response": "👋 ¿Estás listo para una simulación de entrevista? (sí / no)"
            })

        session = sessions[user_id]

        if session["state"] == "WAIT_READY":
            if user_message in ["si", "sí", "yes"]:
                session["state"] = "WAIT_ROLE"
                return jsonify({
                    "response": (
                        "Perfecto 🚀\n"
                        "Elige el tipo de entrevista:\n"
                        "1) Frontend (FE)\n"
                        "2) Backend (BE)\n"
                        "3) React\n"
                        "4) Angular\n"
                        "5) Preguntas personales"
                    )
                })

            if user_message in ["no", "nop", "nope"]:
                return jsonify({
                    "response": "👌 Cuando estés listo escribe 'sí'."
                })

            return jsonify({
                "response": "Por favor responde únicamente: sí o no."
            })

        if session["state"] == "WAIT_ROLE":
            roles = {
                "1": "frontend",
                "2": "backend",
                "3": "react",
                "4": "angular",
                "5": "personal"
            }

            if user_message not in roles:
                return jsonify({
                    "response": "Selecciona una opción válida (1-5)."
                })

            role = roles[user_message]
            session["role"] = role
            session["state"] = "INTERVIEW"
            session["question_index"] = 0

            first_question = QUESTIONS[role][0]
            return jsonify({
                "response": (
                    f"🎯 Entrevista {role.upper()} iniciada.\n\n"
                    f"Pregunta 1:\n{first_question}"
                )
            })

        if session["state"] == "INTERVIEW":
            role = session["role"]
            q_index = session.get("question_index", 0)


            q_index += 1
    
            if q_index < len(QUESTIONS[role]):
                session["question_index"] = q_index
                next_question = QUESTIONS[role][q_index]
                return jsonify({
                    "response": f"Pregunta {q_index + 1}:\n{next_question}"
                })
            else:
                session["state"] = "FINISHED"
                resources = "\n".join(f"- {url}" for url in RESOURCES.get(role, []))
                return jsonify({
                    "response": (
                        "✅ ¡Buen trabajo!\n\n"
                        "📚 Recursos recomendados para seguir entrenando:\n"
                        f"{resources}\n\n"
                        "¿Quieres otra simulación? (sí / no)"
                    )
                })

        if session["state"] == "FINISHED":
            if user_message in ["si", "sí", "yes"]:
                session["state"] = "WAIT_ROLE"
                session["question_index"] = 0
                return jsonify({
                    "response": "Perfecto 👍 Elige nuevamente una opción (1-5)."
                })

            return jsonify({
                "response": "👋 Gracias por practicar. ¡Éxitos!"
            })

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
def get_cv():
    try:
        current_user_id = get_jwt_identity()
        cv = CV.query.filter_by(user_id=current_user_id).first()

        if not cv:
            return jsonify({'success': False, 'message': 'CV no encontrado'}), 404

        datos = json.loads(cv.datos)

        return jsonify({
            'success': True,
            'datos': datos,
            'fecha_creacion': cv.fecha_creacion.isoformat() if cv.fecha_creacion else None,
            'fecha_modificacion': cv.fecha_modificacion.isoformat() if cv.fecha_modificacion else None
        }), 200

    except json.JSONDecodeError as e:
        return jsonify({'success': False, 'message': 'Error al leer los datos del CV'}), 500

    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'message': str(e)}), 500


@api.route("/cv", methods=["POST"])
@jwt_required()
def save_cv():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()

        if not data:
            return jsonify({'success': False, 'message': 'No se enviaron datos'}), 400

        if not data.get('nombre'):
            return jsonify({'success': False, 'message': 'El nombre es obligatorio'}), 400

        if not data.get('email'):
            return jsonify({'success': False, 'message': 'El email es obligatorio'}), 400

        if not data.get('telefono'):
            return jsonify({'success': False, 'message': 'El teléfono es obligatorio'}), 400

        json_data = json.dumps(data, ensure_ascii=False)
        cv = CV.query.filter_by(user_id=current_user_id).first()

        if cv:
            cv.datos = json_data
            cv.fecha_modificacion = datetime.utcnow()
        else:
            cv = CV(
                user_id=current_user_id,
                datos=json_data,
                fecha_creacion=datetime.utcnow(),
                fecha_modificacion=datetime.utcnow()
            )
            db.session.add(cv)

        db.session.commit()

        return jsonify({'success': True, 'message': 'CV guardado correctamente', 'cv_id': cv.id}), 200

    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Error al guardar: {str(e)}'}), 500


@api.route("/cv", methods=["DELETE"])
@jwt_required()
def delete_cv():
    try:
        current_user_id = get_jwt_identity()
        cv = CV.query.filter_by(user_id=current_user_id).first()

        if not cv:
            return jsonify({'success': False, 'message': 'CV no encontrado'}), 404

        db.session.delete(cv)
        db.session.commit()

        return jsonify({'success': True, 'message': 'CV eliminado correctamente'}), 200

    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Error al eliminar: {str(e)}'}), 500


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
        return jsonify({"msg": "Profile not found"}), 404
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


""" ------------------ ROUTE MAP ENDPOINTS --------------------- """


@api.route('/postulations/<int:id>/route-map', methods=['GET'])
@jwt_required()
def get_route_map(id):
    current_user = get_jwt_identity()

    postulation = Postulations.query.filter_by(
        id=id,
        user_id=current_user
    ).first()

    if not postulation:
        return jsonify({"error": "Postulation not found"}), 404

    stages = Stages.query.filter_by(
        postulation_id=id
    ).order_by(Stages.id.asc()).all()

    return jsonify({
        "postulation_id": id,
        "stages": [stage.serialize() for stage in stages]
    }), 200


@api.route('/postulations/<int:id>/route-map', methods=['POST'])
@jwt_required()
def create_or_replace_route_map(id):
    stage_list = request.get_json()

    if not stage_list or not isinstance(stage_list, list):
        return jsonify({'error': 'Data must be a stages list'}), 400

    postulation = Postulations.query.get(id)
    if not postulation:
        return jsonify({'error': 'Postulation not found'}), 404

    Stages.query.filter_by(postulation_id=id).delete()

    new_stages = []
    for stage_name in stage_list:
        if not isinstance(stage_name, str) or not stage_name.strip():
            continue

        stage = Stages(
            stage_name=stage_name.strip(),
            postulation=postulation
        )
        db.session.add(stage)
        new_stages.append(stage)

    db.session.commit()

    return jsonify({
        "message": "Stages saved successfully",
        "stages": [s.serialize() for s in new_stages]
    }), 200

@api.route('/postulations/<int:id>/route-map', methods=['DELETE'])
@jwt_required()
def remove_stage(id):
    current_user = get_jwt_identity()

    postulation = Postulations.query.filter_by(
        id=id,
        user_id=current_user
    ).first()

    if not postulation:
        return jsonify({"error": "Postulation not found"}), 404

    stage_id = request.args.get('stage_id', type=int)
    if not stage_id:
        return jsonify({"error": "stage_id is required"}), 400

    stage = Stages.query.filter_by(postulation_id=id, id=stage_id).first()
    if not stage:
        return jsonify({'error': 'Stage not found'}), 404

    db.session.delete(stage)
    db.session.commit()

    return jsonify({'message': 'Stage has been removed'}), 200
