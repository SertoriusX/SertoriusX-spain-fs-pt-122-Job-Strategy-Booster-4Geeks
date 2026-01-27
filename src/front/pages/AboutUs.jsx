import '../styles/AboutUs.css';

import trackerImage from '../components/assets/images/tracker-team.jpg';
import chico1 from '../components/assets/images/chico1.jpg';
import chico2 from '../components/assets/images/chico2.jpg';
import chica from '../components/assets/images/chica.jpg';

import {
  CodeBracketIcon,
  UserCircleIcon,
  ClipboardDocumentListIcon
} from "@heroicons/react/24/outline";

export default function AboutUs() {
  return (
    <div className="about-container">
      <section className="intro-section">
        <div className="intro-layout">
          <img src={trackerImage} className="group-photo" />
          <div className="intro-text">
            <h2>Sobre el Proyecto</h2>
            <p> Nuestro proyecto nace de la necesidad de organizar y hacer visible el proceso de búsqueda de empleo. </p>
            <p> Hemos creado un tracker que permite registrar y gestionar todas tus postulaciones en un solo lugar: Empresas, cargos, fechas, estados y notas importantes. </p>
            <p> Nuestro objetivo es transformar la búsqueda de empleo en un proceso más claro y efectivo. </p>
            <p> Creemos que una buena organización marca la diferencia entre postular y avanzar. </p>
          </div>
        </div>
      </section>

      <section className="team-section">
        <h2>Nuestro Equipo</h2>
        <p> Somos tres developers que nos unimos para crear este proyecto con una misma visión: usar la tecnología para resolver problemas reales. </p>

        <div className="team-photos flex justify-center gap-12 mb-6">

          {/* SOFTWARE */}
          <div className="flex flex-col items-center gap-2">
            <img src={chico1} className="profile-pic" />
            <CodeBracketIcon className="w-5 h-5 text-indigo-600" />
            <p className="text-sm font-medium text-gray-900 text-center">
              Desarrollo de Software
            </p>
          </div>

          {/* UX */}
          <div className="flex flex-col items-center gap-2">
            <img src={chico2} className="profile-pic" />
            <UserCircleIcon className="w-5 h-5 text-purple-600" />
            <p className="text-sm font-medium text-gray-900 text-center">
              Experiencia de Usuario
            </p>
          </div>

          {/* PRODUCTIVIDAD */}
          <div className="flex flex-col items-center gap-2">
            <img src={chica} className="profile-pic" />
            <ClipboardDocumentListIcon className="w-5 h-5 text-pink-600" />
            <p className="text-sm font-medium text-gray-900 text-center">
              Productividad y Organización
            </p>
          </div>

        </div>

        <p className="closing-text">
          Trabajamos juntos para crear una herramienta que te acompañe en tu búsqueda laboral.
        </p>
      </section>
    </div>
  );
}
