# 🚀 Job Strategy Booster

> Organiza, gestiona y optimiza tu proceso de búsqueda laboral desde un solo lugar.

---

## 🧩 Sobre el proyecto

Durante el proceso de búsqueda de empleo, la organización se vuelve un factor clave.  
Con esto en mente, desarrollamos **Job Strategy Booster**, una aplicación diseñada para ayudar a los usuarios a **centralizar y gestionar todas sus postulaciones laborales** de forma clara y eficiente.

El objetivo principal del proyecto es permitir al usuario llevar un **control ordenado de sus postulaciones**, pero también acompañarlo durante todo el proceso de búsqueda con herramientas inteligentes que mejoren su preparación y toma de decisiones.

---

## ✨ Funcionalidades principales

### 📄 Gestión de CV
La gestión de CV ofrece al usuario un espacio flexible para crear, actualizar y organizar distintas versiones de su currículum según cada oportunidad.
Cada documento queda registrado en un historial que muestra dónde fue utilizado, ayudando a tomar decisiones más estratégicas en la búsqueda laboral.
Esta herramienta convierte el proceso de postulación en algo ágil, claro y totalmente bajo control del usuario.

✏️ Edición ilimitada de CVs  
Crea y modifica tus currículums tantas veces como necesites, adaptándolos a cada oportunidad.

📂 Historial de postulaciones  
Visualiza qué versión de tu CV fue utilizada en cada postulación, para mejorar tu estrategia laboral.

📄 Exportación en PDF  
Descarga tus CVs en formato profesional, listos para enviar.

📤 Compartir fácilmente  
Envía tus CVs por correo electrónico o WhatsApp directamente desde la plataforma.

### 📊 Seguimiento de postulaciones
Facilita el registro y control de todas las postulaciones realizadas, permitiendo acceder rápidamente a información clave como:

- 📝 Descripción del puesto  
- 🔗 URL de la postulación  
- 📋 Requisitos necesarios  
- 🏠 Modalidad de empleo  
- 📄 Tipo de contrato  
- 👥 Número de candidatos  
- 📌 Plazas disponibles  
- 💰 Salario  

---

### 🤖 Simulador de entrevistas
El desempeño en una entrevista suele ser decisivo.  
Por este motivo, la aplicación integra un **simulador de entrevistas con inteligencia artificial** que ayuda al usuario a practicar y mejorar sus respuestas.

El simulador permite:
- Generar sesiones adaptadas al perfil del usuario  
- Ajustar preguntas según el tipo de puesto  
- Brindar retroalimentación automática  
- Proponer variaciones de preguntas para mejorar la preparación  

---

### 🧠 Inteligencia Artificial utilizada
El simulador está impulsado por un **modelo de OpenAI**, integrado en el backend, que permite:

- Generar preguntas de entrevista dinámicas  
- Adaptar preguntas según rol o sector  
- Simular entrevistas  
- Proveer sugerencias de mejora  

---

## 🔐 Autenticación con JWT
La aplicación implementa autenticación mediante **JSON Web Tokens (JWT)** para proteger los endpoints del backend y garantizar el acceso seguro a la información del usuario.

### Características
- Login seguro  
- Generación de token JWT al autenticarse  
- Protección de rutas privadas  
- Validación del token en cada solicitud  

### Flujo de autenticación
1. El usuario inicia sesión con sus credenciales  
2. El backend valida los datos  
3. Se genera un JWT  
4. El token se envía al frontend  
5. El frontend envía el token en los headers:

## 🌐 Integración con Google Translate API

El proyecto incluye integración con Google Cloud Translate API, permitiendo la traducción automática de:

- CV
- Descripciones de puestos
- Respuestas de entrevistas
- Textos ingresados por el usuario

## 🛠 Tecnologías utilizadas

### Frontend

- ⚛️ React
- 🧭 React Router

### Backend

- 🐍 Python
- 🌶 Flask
  
### Base de datos

- 🗄 SQLAlchemy (ORM)

## ⚙️ Instalación y ejecución

### Backend

Si estás levantando el proyecto desde GitHub Codespaces, instala primero las dependencias:

```bash
$ pipenv install
```

Luego inicia el servidor backend:
```bash
$ pipenv run start
```

### Frontend

Con el backend en ejecución, instala las dependencias del frontend:
```bash
npm install
```

Inicia el servidor de desarrollo:
```bash
npm run dev
```

## 📌 Nota

Si utilizas GitHub Codespaces, asegúrate de configurar los puertos del backend y frontend como públicos para poder acceder a la aplicación desde el navegador.
