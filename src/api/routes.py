import random
import re
import traceback
from werkzeug.utils import secure_filename
import requests
import openai
import os
from difflib import SequenceMatcher

from dotenv import load_dotenv
from flask_bcrypt import Bcrypt
from api.models import db, User, CV
from flask import Flask, request, jsonify, url_for, Blueprint, send_from_directory
from flask import Response
from api.models import db, User, Postulations, Profile, Stages, TodoList
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import json
from datetime import datetime
from api.data_mock.mock_data import jobs

from datetime import datetime, date
import pytesseract
from PIL import Image

from io import BytesIO
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import ImageReader
from reportlab.lib.colors import HexColor


api = Blueprint('api', __name__)
CORS(api)
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
    ], "personal": [
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
ANSWERS = {
    "frontend": {
        "¿Qué es el Virtual DOM y por qué es importante?": [
            "El Virtual DOM es una representación ligera del DOM real que mejora el rendimiento de las actualizaciones.",
            "Es una copia virtual del DOM que permite comparar cambios antes de aplicarlos al DOM real.",
            "Sirve para optimizar renderizados evitando manipulaciones directas costosas del DOM."
        ],
        "¿Qué es CSS Flexbox y para qué sirve?": [
            "Flexbox es un modelo CSS para distribuir y alinear elementos fácilmente.",
            "Permite crear layouts flexibles adaptados a distintos tamaños de pantalla.",
            "Se usa para organizar elementos en filas o columnas de forma eficiente."
        ],
        "¿Qué es un closure en JavaScript?": [
            "Un closure es una función que mantiene acceso a variables externas.",
            "Es una función que recuerda su entorno léxico.",
            "Permite usar datos de una función padre después de ejecutarse."
        ],
        "¿Cuál es la diferencia entre 'var', 'let' y 'const' en JavaScript?": [
            "'var' tiene alcance de función; 'let' y 'const' de bloque.",
            "'const' no permite reasignación, 'let' sí.",
            "'var' se eleva (hoisting), 'let' y 'const' no igual."
        ],
        "¿Qué son las promesas en JavaScript y cómo funcionan?": [
            "Representan resultados futuros de operaciones asíncronas.",
            "Permiten manejar async con estados: pending, resolved, rejected.",
            "Encapsulan operaciones que terminarán más tarde."
        ],
        "¿Cómo manejas eventos en JavaScript?": [
            "Con addEventListener y callbacks.",
            "Asignando handlers a eventos del DOM.",
            "Usando listeners que reaccionan a acciones del usuario."
        ],
        "¿Qué es el modelo de caja (box model) en CSS?": [
            "Define contenido, padding, borde y margen.",
            "Cada elemento se representa como una caja.",
            "Explica cómo se calcula el tamaño total de un elemento."
        ],
        "¿Qué son las media queries y cómo se usan para responsive design?": [
            "Reglas CSS condicionales según tamaño de pantalla.",
            "Permiten adaptar estilos por dispositivo.",
            "Se usan para hacer diseño responsive."
        ],
        "¿Qué es la herencia en CSS y cómo funciona?": [
            "Algunas propiedades pasan del padre al hijo.",
            "Los elementos heredan ciertos estilos.",
            "Reduce duplicación de reglas."
        ]
    },

    "backend": {
        "¿Qué es una API REST?": [
            "Es un estilo para crear APIs usando HTTP.",
            "Permite operaciones CRUD vía endpoints.",
            "Define comunicación cliente-servidor sin estado."
        ],
        "¿Qué es una base de datos relacional?": [
            "Organiza datos en tablas relacionadas.",
            "Usa filas y columnas con claves.",
            "Permite relaciones entre entidades."
        ],
        "¿Qué son los middlewares en backend?": [
            "Funciones intermedias entre request y response.",
            "Procesan peticiones antes del controlador.",
            "Sirven para auth, logs o validación."
        ],
        "¿Qué diferencias hay entre SQL y NoSQL?": [
            "SQL es estructurado; NoSQL flexible.",
            "SQL usa tablas; NoSQL documentos o claves.",
            "NoSQL escala horizontal más fácil."
        ],
        "¿Qué es la autenticación y autorización?": [
            "Auth verifica identidad; autorización permisos.",
            "Una valida usuario; otra acceso.",
            "Son capas de seguridad distintas."
        ],
        "¿Qué es un token JWT y para qué se usa?": [
            "Token firmado para autenticar usuarios.",
            "Permite sesiones sin estado.",
            "Transporta datos seguros entre partes."
        ],
        "¿Cómo funciona el manejo de sesiones en aplicaciones web?": [
            "Guarda estado entre requests.",
            "Asocia usuario con ID de sesión.",
            "Mantiene login activo."
        ],
        "¿Qué es un servidor web y cómo funciona?": [
            "Responde peticiones HTTP.",
            "Entrega recursos al cliente.",
            "Sirve contenido y APIs."
        ],
        "¿Qué es la escalabilidad en backend?": [
            "Capacidad de soportar más carga.",
            "Crecer sin perder rendimiento.",
            "Escalar vertical u horizontalmente."
        ]
    },

    "react": {
        "¿Qué es el estado (state) en React?": [
            "Datos que controlan renderizado.",
            "Información mutable del componente.",
            "Valores que al cambiar re-renderizan."
        ],
        "¿Qué es un Hook?": [
            "Funciones especiales de React.",
            "Permiten usar estado en funciones.",
            "Extienden componentes funcionales."
        ],
        "¿Cómo funcionan los componentes funcionales?": [
            "Son funciones que retornan JSX.",
            "Renderizan UI sin clases.",
            "Usan hooks para lógica."
        ],
        "¿Qué es el ciclo de vida de un componente en React?": [
            "Fases de montaje y desmontaje.",
            "Momentos de render y actualización.",
            "Controlado con hooks."
        ],
        "¿Qué es Redux y para qué se utiliza?": [
            "Gestor de estado global.",
            "Centraliza datos de app.",
            "Hace estado predecible."
        ],
        "¿Qué es el Context API en React?": [
            "Comparte datos sin props drilling.",
            "Estado global simple.",
            "Comunicación entre componentes."
        ],
        "¿Cómo optimizas el rendimiento en una aplicación React?": [
            "Memoización y lazy loading.",
            "Evitar renders innecesarios.",
            "Dividir componentes."
        ],
        "¿Qué son las props y cómo se usan?": [
            "Datos que recibe un componente.",
            "Configuran comportamiento.",
            "Se pasan desde el padre."
        ],
        "¿Qué diferencia hay entre componentes controlados y no controlados?": [
            "Controlados usan state.",
            "No controlados usan DOM.",
            "Controlados son más predecibles."
        ]
    },

    "angular": {
        "¿Qué es un módulo en Angular?": [
            "Agrupa partes de la app.",
            "Organiza componentes y servicios.",
            "Define bloques funcionales."
        ],
        "¿Qué es un servicio en Angular?": [
            "Clase reutilizable inyectable.",
            "Contiene lógica compartida.",
            "Se usa vía DI."
        ],
        "¿Qué es RxJS y cómo se usa?": [
            "Programación reactiva.",
            "Trabaja con observables.",
            "Maneja async streams."
        ],
        "¿Qué es el data binding en Angular?": [
            "Sincroniza vista y datos.",
            "Conecta modelo y template.",
            "Actualización automática."
        ],
        "¿Qué son los decoradores en Angular?": [
            "Añaden metadatos.",
            "Configuran clases.",
            "Definen comportamiento."
        ],
        "¿Cómo funcionan los pipes en Angular?": [
            "Transforman datos en templates.",
            "Formatean salida.",
            "Aplican filtros."
        ],
        "¿Qué es la inyección de dependencias?": [
            "Provee dependencias externas.",
            "Evita instanciación manual.",
            "Facilita testing."
        ],
        "¿Qué es un componente y cómo se comunica con otros?": [
            "Bloque UI básico.",
            "Usa inputs y outputs.",
            "Intercambia datos."
        ],
        "¿Cómo manejas el enrutamiento en Angular?": [
            "Con RouterModule.",
            "Definiendo rutas.",
            "Navegando por path."
        ]
    },

    "personal": {
        "¿Dónde te ves en cinco años?": [
            "Creciendo profesionalmente.",
            "Con más responsabilidad técnica.",
            "Aportando valor en proyectos grandes."
        ],
        "¿Cuál es tu mayor fortaleza y debilidad?": [
            "Fortaleza: constancia. Debilidad: perfeccionismo.",
            "Soy perseverante pero a veces muy detallista.",
            "Aprendo rápido pero me exijo mucho."
        ],
        "¿Cómo manejas el estrés o la presión en el trabajo?": [
            "Priorizo tareas.",
            "Organizo tiempos.",
            "Trabajo por bloques."
        ],
        "Descríbeme una situación en la que hayas tenido que resolver un conflicto.": [
            "Escuché ambas partes.",
            "Busqué solución común.",
            "Medié con comunicación."
        ],
        "¿Por qué quieres trabajar con nosotros?": [
            "Por su cultura.",
            "Por sus proyectos.",
            "Por oportunidad de crecimiento."
        ],
        "¿Qué te motiva a dar lo mejor de ti?": [
            "Aprender.",
            "Superar retos.",
            "Mejorar constantemente."
        ],
        "¿Cómo te mantienes actualizado y mejorando profesionalmente?": [
            "Cursos y lectura.",
            "Práctica constante.",
            "Comunidades tech."
        ],
        "Cuéntame sobre un error que hayas cometido y cómo lo solucionaste.": [
            "Analicé causa y corregí.",
            "Pedí ayuda y aprendí.",
            "Documenté la solución."
        ],
        "¿Prefieres trabajar en equipo o de forma independiente? ¿Por qué?": [
            "Equipo por sinergia.",
            "Ambos según tarea.",
            "Equipo por intercambio de ideas."
        ]
    }
}

MAX_QUESTIONS = 5
sessions = {}


def normalize(text):
    if isinstance(text, list):
        text = " ".join(text)
    text = text.lower()
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def similarity(a, b):
    return SequenceMatcher(None, normalize(a), normalize(b)).ratio()


def nivel_por_puntaje(avg_score):
    if avg_score >= 0.75:
        return "Senior"
    elif avg_score >= 0.5:
        return "Intermedio"
    else:
        return "Junior"


@api.route("/chat", methods=["POST"])
@jwt_required()
def chat():
    try:
        user_id = get_jwt_identity()
        user_message = (request.json or {}).get("message", "").strip()

        if user_id not in sessions:
            sessions[user_id] = {
                "state": "SALUDO_INICIAL",
                "role": None,
                "question_index": 0,
                "question_order": [],
                "scores": []
            }
            return jsonify({
                "response": "Hola, ¿cómo puedo ayudarte?"
            })

        session = sessions[user_id]

        if session["state"] == "SALUDO_INICIAL":

            session["state"] = "ESPERANDO_LISTO"
            return jsonify({
                "response": "¿Estás listo para una simulación de entrevista? (sí / no)"
            })

        if session["state"] == "ESPERANDO_LISTO":
            if user_message.lower() in ["sí", "si", "s"]:
                session["state"] = "ESPERANDO_ROL"
                return jsonify({
                    "response": (
                        "Elige el tipo de entrevista:\n"
                        "1) Frontend\n"
                        "2) Backend\n"
                        "3) React\n"
                        "4) Angular\n"
                        "5) Personal"
                    )
                })
            elif user_message.lower() in ["no", "n"]:
                return jsonify({"response": "Cuando estés listo, dime 'sí' para comenzar."})
            else:
                return jsonify({"response": "Por favor responde con 'sí' o 'no'."})

        if session["state"] == "ESPERANDO_ROL":
            roles = {
                "1": "frontend",
                "2": "backend",
                "3": "react",
                "4": "angular",
                "5": "personal"
            }

            if user_message not in roles:
                return jsonify({"response": "Por favor elige una opción válida (1–5)."})

            role = roles[user_message]
            session["role"] = role
            session["state"] = "ENTREVISTA"
            session["question_index"] = 0
            session["scores"] = []

            preguntas = QUESTIONS[role]
            session["question_order"] = random.sample(
                preguntas, min(MAX_QUESTIONS, len(preguntas))
            )

            return jsonify({
                "response": f"Pregunta 1:\n{session['question_order'][0]}"
            })

        if session["state"] == "ENTREVISTA":
            role = session["role"]
            q_index = session["question_index"]
            question_order = session["question_order"]

            current_question = question_order[q_index]
            ejemplo_respuesta = ANSWERS.get(role, {}).get(current_question)

            score = 0.0

            if ejemplo_respuesta:
                score = similarity(user_message, ejemplo_respuesta)
                session["scores"].append(score)

                if score >= 0.75:
                    feedback = "Buena respuesta."
                elif score >= 0.5:
                    feedback = "Necesitas estudiar un poco más esto."
                else:
                    feedback = "Respuesta insuficiente."
            else:
                session["scores"].append(0)
                feedback = "Respuesta recibida."

            session["question_index"] += 1

            if session["question_index"] >= len(session["question_order"]):
                session["state"] = "FINALIZADO"

                avg_score = (
                    sum(session["scores"]) / len(session["scores"])
                    if session["scores"] else 0
                )
                nivel = nivel_por_puntaje(avg_score)
                resources = RESOURCES.get(role, [])
                recursos_texto = "\n".join(f"- {r}" for r in resources)

                session["state"] = "ESPERANDO_LISTO"
                session["question_index"] = 0
                session["question_order"] = []
                session["scores"] = []

                return jsonify({
                    "response": (
                        f"{feedback}\n\n"
                        "Has completado la entrevista.\n\n"
                        f"Nivel: {nivel}\n"
                        f"Puntaje promedio: {avg_score:.2f}\n\n"
                        f"Recursos recomendados:\n{recursos_texto}\n\n"
                        "¿Quieres iniciar otra entrevista? (sí / no)"
                    )
                })

            session["state"] = "PREGUNTAR_SIGUIENTE"

            return jsonify({
                "response": (
                    f"{feedback}\n\n"
                    "¿Qué quieres hacer ahora?\n"
                    "1) Siguiente pregunta\n"
                    "2) Salir y ver recursos"
                )
            })

        if session["state"] == "PREGUNTAR_SIGUIENTE":
            if user_message == "1":
                if session["question_index"] < len(session["question_order"]):
                    siguiente_pregunta = session["question_order"][session["question_index"]]
                    session["state"] = "ENTREVISTA"
                    return jsonify({
                        "response": f"Siguiente pregunta:\n{siguiente_pregunta}"
                    })
                else:
                    session["state"] = "FINALIZADO"

                    avg_score = (
                        sum(session["scores"]) / len(session["scores"])
                        if session["scores"] else 0
                    )
                    nivel = nivel_por_puntaje(avg_score)
                    resources = RESOURCES.get(session["role"], [])
                    recursos_texto = "\n".join(f"- {r}" for r in resources)

                    session["state"] = "ESPERANDO_LISTO"
                    session["question_index"] = 0
                    session["question_order"] = []
                    session["scores"] = []

                    return jsonify({
                        "response": (
                            "Has completado la entrevista.\n\n"
                            f"Nivel: {nivel}\n"
                            f"Puntaje promedio: {avg_score:.2f}\n\n"
                            f"Recursos recomendados:\n{recursos_texto}\n\n"
                            "¿Quieres iniciar otra entrevista? (sí / no)"
                        )
                    })

            elif user_message == "2":
                session["state"] = "FINALIZADO"

                avg_score = (
                    sum(session["scores"]) / len(session["scores"])
                    if session["scores"] else 0
                )
                nivel = nivel_por_puntaje(avg_score)
                resources = RESOURCES.get(session["role"], [])
                recursos_texto = "\n".join(f"- {r}" for r in resources)

                session["state"] = "ESPERANDO_LISTO"
                session["question_index"] = 0
                session["question_order"] = []
                session["scores"] = []

                return jsonify({
                    "response": (
                        "Has finalizado la entrevista.\n\n"
                        f"Nivel: {nivel}\n"
                        f"Puntaje promedio: {avg_score:.2f}\n\n"
                        f"Recursos recomendados:\n{recursos_texto}\n\n"
                        "¿Quieres iniciar otra entrevista? (sí / no)"
                    )
                })

            else:
                return jsonify({
                    "response": (
                        "Por favor elige:\n"
                        "1) Siguiente pregunta\n"
                        "2) Salir y ver recursos"
                    )
                })

        session["state"] = "ESPERANDO_LISTO"
        return jsonify({
            "response": "¿Quieres iniciar una entrevista? (sí / no)"
        })

    except Exception as e:
        traceback.print_exc()
        return jsonify({"response": f"Error del servidor: {str(e)}"}), 500


def clean_company_name(line: str, max_length=50) -> str:
    line = re.sub(r"http\S+", "", line)
    line = re.sub(r"\d+", "", line)
    line = re.sub(r"[^\w\s.,-]", "", line)
    line = line.strip()
    words = line.split()
    filtered_words = [w for w in words if len(w) > 2]
    cleaned_line = " ".join(filtered_words)

    return cleaned_line[:max_length]


def extract_postulation_fields(text: str, platform_hint="Unknown") -> dict:
    clean_text = text.replace("€", " €").replace("$", " $")
    lines = [l.strip() for l in clean_text.split("\n") if len(l.strip()) > 3]
    full_text = " ".join(lines).lower()

    platform_hint_norm = platform_hint.lower() if platform_hint else "unknown"

    data = {
        "company_name": None,
        "role": None,
        "city": None,
        "platform": platform_hint if platform_hint != "Unknown" else "Unknown",
        "work_type": None,
        "experience": 0,
        "salary": 0,
        "candidates_applied": 0,
        "postulation_url": None,
        "requirements": [],
        "job_description": clean_text[:800],
    }

    if platform_hint_norm == "unknown":
        if "linkedin" in full_text:
            data["platform"] = "LinkedIn"
        elif "indeed" in full_text:
            data["platform"] = "Indeed"
        elif "sefcarm" in full_text or "sefoficinavirtual" in full_text:
            data["platform"] = "Sefcarm"
        elif "infojobs" in full_text:
            data["platform"] = "InfoJobs"
        else:
            data["platform"] = "Unknown"
    else:
        platform_map = {
            "linkedin": "LinkedIn",
            "indeed": "Indeed",
            "sefcarm": "Sefcarm",
            "infojobs": "InfoJobs",

            "unknown": "Unknown"
        }
        data["platform"] = platform_map.get(platform_hint_norm, platform_hint)

    platform_lower = data["platform"].lower()
    if platform_lower == "indeed":
        if lines:

            role_lines = [lines[0].strip()]

            if len(lines) > 1 and not re.search(r"\d|http", lines[1]):
                role_lines.append(lines[1].strip())
                if len(lines) > 2:
                    data["company_name"] = clean_company_name(lines[2])
                else:
                    data["company_name"] = "Unknown"
            else:
                if len(lines) > 1:
                    data["company_name"] = clean_company_name(lines[1])
                else:
                    data["company_name"] = "Unknown"

            data["role"] = " ".join(role_lines)

    elif platform_lower == "linkedin":
        cleaned_lines = [l for l in lines if len(
            l) > 3 and re.search(r"[a-zA-Z0-9]", l)]

        found = False
        for line in cleaned_lines:
            if " at " in line.lower():
                parts = re.split(r"\s+at\s+", line, flags=re.IGNORECASE)
                if len(parts) == 2:
                    data["company_name"] = clean_company_name(parts[0].strip())
                    data["role"] = parts[1].strip()
                    found = True
                    break

        if not found:
            if len(cleaned_lines) > 0:
                data["company_name"] = clean_company_name(cleaned_lines[0])
            if len(cleaned_lines) > 1:
                data["role"] = cleaned_lines[1].strip()
    elif platform_lower == "infojobs":
        if lines:
            data["role"] = lines[0].strip()
        if len(lines) > 1:
            data["company_name"] = clean_company_name(lines[1])
    elif platform_lower == "sefcarm":
        offer_number_match = re.search(
            r"oferta[:\s]*([A-Za-z0-9-]+)", full_text, flags=re.IGNORECASE)
        if offer_number_match:
            offer_number = offer_number_match.group(1)
            data["offer_number"] = offer_number

            data["company_name"] = offer_number

            offer_line_index = None
            for i, line in enumerate(lines):
                if offer_number.lower() in line.lower():
                    offer_line_index = i
                    break

            role_line = None
            if offer_line_index is not None:
                for j in range(offer_line_index + 1, len(lines)):
                    next_line = lines[j].strip()
                    if not re.search(r"fecha|inicio|finalización|municipio|\d{2}/\d{2}/\d{4}", next_line, re.IGNORECASE) and len(next_line) > 3:
                        role_line = next_line
                        break

            if role_line:
                data["role"] = role_line
            else:
                if offer_line_index is not None and offer_line_index + 1 < len(lines):
                    data["role"] = lines[offer_line_index + 1].strip()
                elif lines:
                    data["role"] = lines[0].strip()
        else:
            if lines:
                data["role"] = lines[0].strip()
            if len(lines) > 1:
                data["company_name"] = clean_company_name(lines[1])

    exp_patterns = [
        r"(experiencia mínima|experiencia requerida|se requiere experiencia).*?(\d+)\s*(meses|años)",
        r"(mínimo de experiencia).*?(\d+)\s*(meses|años)"
    ]

    for pattern in exp_patterns:
        exp_match = re.search(pattern, full_text, re.IGNORECASE)
        if exp_match:
            num = int(exp_match.group(2))
            data["experience"] = num if "meses" in exp_match.group(
                3).lower() else num * 12
            break

    salary_match = re.search(r"(\d{3,5})\s*euros", full_text)
    if salary_match:
        data["salary"] = int(salary_match.group(1))
    work_type_match = re.search(
        r"\b(jornada completa|tiempo completo|full[- ]?time|medio tiempo|part[- ]?time|parcial|presencial|remoto|teletrabajo|home office)\b",
        full_text,
        re.IGNORECASE
    )
    if work_type_match:
        data["work_type"] = work_type_match.group(1).lower()
    else:
        data["work_type"] = "Unknown"
    candidates_patterns = [
        r"más de (\d+)\s+solicitudes",
        r"(\d+)\s+candidatos?",
        r"(\d+)\s+aplicantes?",
        r"(\d+)\s+postulantes?",
        r"(\d+)\s+personas interesadas"
    ]

    for pattern in candidates_patterns:
        applied_match = re.search(pattern, full_text, re.IGNORECASE)
        if applied_match:
            data["candidates_applied"] = int(applied_match.group(1))
            break

        requirement_keywords = [
            "se requiere", "tener", "poseer",
            "estar inscrito", "aptitudes", "habilidades"
        ]
        for line in lines:
            if any(k in line.lower() for k in requirement_keywords):
                data["requirements"].append(line)

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

    platform_hint = request.form.get("platform", "Unknown")
    current_user = get_jwt_identity()

    upload_dir = "uploads"
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir)

    path = os.path.join(upload_dir, file.filename)
    try:
        file.save(path)
        img = Image.open(path)
        text = pytesseract.image_to_string(img)
    except Exception as e:
        return jsonify({"error": f"OCR or file handling failed: {str(e)}"}), 500

    print("OCR Text:", repr(text))

    data = extract_postulation_fields(text, platform_hint=platform_hint)

    requirements = data.get("requirements")
    if not isinstance(requirements, list):
        requirements = []

    postulation = Postulations(
        postulation_state="Open",
        company_name=data.get("company_name") or "Unknown",
        role=data.get("role") or "Unknown",
        experience=data.get("experience", 0),
        inscription_date=date.today(),
        city=data.get("city") or "Unknown",
        salary=data.get("salary", 0),
        platform=data.get("platform") or "Unknown",
        postulation_url=data.get("postulation_url") or "",
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

        header_x = x_margin
        header_y = height - 100
        foto_size = 110

        if foto_base64:
            try:
                if foto_base64.startswith("data:image"):
                    foto_base64 = foto_base64.split(",")[1]
                foto_bytes = base64.b64decode(foto_base64)
                foto_image = ImageReader(BytesIO(foto_bytes))
                p.drawImage(
                    foto_image,
                    header_x,
                    header_y - foto_size,
                    foto_size,
                    foto_size,
                    preserveAspectRatio=True,
                    mask="auto",
                )
            except:
                pass

        text_x = header_x + foto_size + 30
        text_y = header_y

        nombre = datos.get("nombre", "")[:60]
        font_size = 22
        max_width = width - text_x - x_margin

        while p.stringWidth(nombre, "Helvetica-Bold", font_size) > max_width and font_size > 12:
            font_size -= 1

        p.setFont("Helvetica-Bold", font_size)
        p.setFillColor(title_color)
        p.drawString(text_x, text_y, nombre)
        text_y -= font_size + 10

        p.setFont("Helvetica", 11)
        p.setFillColor(muted_color)

        def draw_contact(label, value):
            nonlocal text_y
            if value:
                p.drawString(text_x, text_y, f"{label}: {value}")
                text_y -= 16

        draw_contact("Email", datos.get("email"))
        draw_contact("Teléfono", datos.get("telefono"))
        draw_contact("Dirección", datos.get("direccion"))
        draw_contact("Ubicación", datos.get("ubicacion"))
        draw_contact("LinkedIn", datos.get("linkedin"))
        draw_contact("GitHub", datos.get("github"))

        y = text_y - 40

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

        return Response(
            pdf_content,
            mimetype="application/pdf",
            headers={"Content-Disposition": f"inline; filename=cv-{cv_id}.pdf"},
        )

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


@api.route("/postulations/status/<int:id>", methods=["PUT"])
@jwt_required()
def edit_status(id):
    data=request.get_json()
    postulacin = Postulations.query.filter_by(id=id).first()
    postulation_state=data.get("postulation_state")
    if postulation_state:
        postulacin.postulation_state=postulation_state
    db.session.commit()
    return jsonify({"msg":"updated status sucessfully"})


@api.route("/postulations", methods=["POST"])
@jwt_required()
def postulaciones_post():
    data = request.get_json()

    if not data:
        return {"error": "Request body must be JSON"}, 400

    current_user_id = get_jwt_identity()

    if not data.get("company_name"):
        return {
            "error": "Missing required field",
            "fields": ["company_name"]
        }, 400

    def safe_int(value, field_name, min_value=0):
        try:
            value = int(value)
            if value < min_value:
                raise ValueError
            return value
        except (ValueError, TypeError):
            raise ValueError(f"{field_name} must be an integer")

    try:
        experience = safe_int(data.get("experience"), "experience", 0) if data.get(
            "experience") is not None else None
        salary = safe_int(data.get("salary"), "salary", 0) if data.get(
            "salary") is not None else None
        candidates_applied = safe_int(
            data.get("candidates_applied"), "candidates_applied", 0
        ) if data.get("candidates_applied") is not None else None
        available_positions = safe_int(
            data.get("available_positions"), "available_positions", 1
        ) if data.get("available_positions") is not None else None
    except ValueError as e:
        return {"error": str(e)}, 400

    inscription_date = None
    if data.get("inscription_date"):
        try:
            inscription_date = datetime.strptime(
                data["inscription_date"], "%Y-%m-%d"
            ).date()
        except ValueError:
            return {"error": "inscription_date must be in yyyy-mm-dd format"}, 400

    new_postulacion = Postulations(
        user_id=current_user_id,
        postulation_state=data.get("postulation_state"),
        company_name=data["company_name"],
        role=data.get("role"),
        experience=experience,
        inscription_date=inscription_date,
        city=data.get("city"),
        salary=salary,
        platform=data.get("platform"),
        postulation_url=data.get("postulation_url"),
        work_type=data.get("work_type"),
        requirements=data.get("requirements"),
        candidates_applied=candidates_applied,
        available_positions=available_positions,
        job_description=data.get("job_description")
    )

    db.session.add(new_postulacion)
    db.session.commit()

    return jsonify(new_postulacion.serialize()), 201


@api.route("/postulations/<int:id>", methods=["PUT"])
@jwt_required()
def postulaciones_put(id):
    data = request.get_json()

    if not data:
        return {"error": "Request body must be JSON"}, 400

    current_user_id = get_jwt_identity()

    postulation = Postulations.query.filter_by(
        id=id,
        user_id=current_user_id
    ).first()

    if not postulation:
        return {"error": "Postulation not found"}, 404

    def safe_int(value, field_name, min_value=0):
        try:
            value = int(value)
            if value < min_value:
                raise ValueError
            return value
        except (ValueError, TypeError):
            raise ValueError(f"{field_name} must be an integer")

    try:
        if "experience" in data:
            postulation.experience = (
                safe_int(data["experience"], "experience", 0)
                if data["experience"] is not None else None
            )

        if "salary" in data:
            postulation.salary = (
                safe_int(data["salary"], "salary", 0)
                if data["salary"] is not None else None
            )

        if "candidates_applied" in data:
            postulation.candidates_applied = (
                safe_int(data["candidates_applied"], "candidates_applied", 0)
                if data["candidates_applied"] is not None else None
            )

        if "available_positions" in data:
            postulation.available_positions = (
                safe_int(data["available_positions"], "available_positions", 1)
                if data["available_positions"] is not None else None
            )

    except ValueError as e:
        return {"error": str(e)}, 400

    if "inscription_date" in data:
        if data["inscription_date"] is None:
            postulation.inscription_date = None
        else:
            try:
                postulation.inscription_date = datetime.strptime(
                    data["inscription_date"], "%Y-%m-%d"
                ).date()
            except ValueError:
                return {
                    "error": "inscription_date must be in yyyy-mm-dd format"
                }, 400

    updatable_fields = [
        "company_name",
        "postulation_state",
        "role",
        "city",
        "platform",
        "postulation_url",
        "work_type",
        "requirements",
        "job_description",
    ]

    for field in updatable_fields:
        if field in data:
            setattr(postulation, field, data[field])

    db.session.commit()

    return jsonify(postulation.serialize()), 200


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


@api.route("/status", methods=["GET"])
def status_entrevista_get():
    entrevista = Stages.query.filter_by(stage_name="hr_interview").count()
    offer = Stages.query.filter_by(stage_name="offer").count()
    process_closure = Stages.query.filter_by(
        stage_name="process_closure").count()
    aceptada = Postulations.query.filter_by(
        postulation_state="aceptada").count()
    return jsonify({"entrevista": entrevista,
                    "offer": offer,
                    "descartado": process_closure,
                    "aceptada": aceptada
                    })


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
        return jsonify({'error': 'Data must be a list of stage objects'}), 400

    postulation = Postulations.query.get(id)
    if not postulation:
        return jsonify({'error': 'Postulation not found'}), 404

    Stages.query.filter_by(postulation_id=id).delete()

    new_stages = []
    for stage_data in stage_list:
        if not isinstance(stage_data, dict):
            continue

        stage_name = stage_data.get('stage_name')
        if not stage_name or not isinstance(stage_name, str):
            continue

        date_completed_stage = None
        raw_date = stage_data.get('date_completed_stage')
        if raw_date:
            try:
                date_completed_stage = datetime.strptime(
                    raw_date, '%Y-%m-%d').date()
            except ValueError:
                return jsonify({
                    'error': f'Invalid date format for stage "{stage_name}". Use YYYY-MM-DD'
                }), 400

        stage = Stages(
            stage_name=stage_name.strip(),
            stage_completed=bool(stage_data.get('stage_completed', False)),
            date_completed_stage=date_completed_stage,
            postulation_id=id
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


@api.route('/postulations/<int:id>/route-map', methods=['PUT'])
@jwt_required()
def complete_next_stage(id):
    action = request.args.get('action')
    current_user = get_jwt_identity()

    if action not in ('next', 'prev'):
        return jsonify({'error': 'Invalid action'}), 400

    postulation = Postulations.query.filter_by(
        id=id,
        user_id=current_user
    ).first()

    if not postulation:
        return jsonify({"error": "Postulation not found"}), 404

    if action == 'next':
        stage = Stages.query.filter_by(
            postulation_id=id,
            stage_completed=False
        ).order_by(Stages.id.asc()).first()

        if not stage:
            return jsonify({"message": "All stages are already completed"}), 200

        stage.stage_completed = True
        stage.date_completed_stage = datetime.utcnow().date()

        message = f'Stage "{stage.stage_name}" marked as completed'

    else:
        stage = Stages.query.filter_by(
            postulation_id=id,
            stage_completed=True
        ).order_by(Stages.id.desc()).first()

        if not stage:
            return jsonify({"message": "No completed stages to revert"}), 200

        stage.stage_completed = False
        stage.date_completed_stage = None
        message = f'Stage "{stage.stage_name}" reverted'

    db.session.commit()

    return jsonify({
        "message": message,
        "stage": stage.serialize()
    }), 200


"""----------- TO DO ROUTES ------------ """


@api.route('/', methods=['GET'])
@jwt_required()
def get_todos():
    current_user = get_jwt_identity()

    todos = (
        TodoList.query
        .filter_by(user_id=current_user)
        .order_by(TodoList.id.asc())
        .all()
    )

    if not todos:
        return jsonify([]), 200

    return jsonify([{
        "id": t.id,
        "todo_name": t.todo_name,
        "todo_complete": t.todo_complete
    } for t in todos]), 200


@api.route('/', methods=['POST'])
@jwt_required()
def create_new_todo():
    data = request.get_json()
    current_user = get_jwt_identity()

    if not data or not data.get('todo_name'):
        return jsonify({"error": "todo_name is required"}), 400

    new_todo = TodoList(
        todo_name=data.get('todo_name'),
        todo_complete=data.get('todo_complete', False),
        user_id=current_user
    )

    db.session.add(new_todo)
    db.session.commit()

    return jsonify({
        "id": new_todo.id,
        "todo_name": new_todo.todo_name,
        "todo_complete": new_todo.todo_complete
    }), 201


@api.route('/', methods=['PUT'])
@jwt_required()
def update_status():
    current_user = get_jwt_identity()
    todo_id = request.args.get('id', type=int)

    todo = TodoList.query.filter_by(
        id=todo_id,
        user_id=current_user
    ).first()

    if not todo:
        return jsonify({'error': 'todo not found'}), 400

    todo.todo_complete = not todo.todo_complete

    db.session.commit()

    return jsonify({'id': todo.id, 'message': 'todo updated'})


@api.route('/', methods=['DELETE'])
@jwt_required()
def delete_todo():
    current_user = get_jwt_identity()

    todo_id = request.args.get('id', type=int)
    if not todo_id:
        return jsonify({'error': 'todo id is mandatory'}), 400

    todo = TodoList.query.filter_by(
        id=todo_id,
        user_id=current_user
    ).first()

    if not todo:
        return jsonify({'error': 'todo not found'}), 400

    db.session.delete(todo)
    db.session.commit()

    return jsonify({'message': 'Todo removed'}), 200
