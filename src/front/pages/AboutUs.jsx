import '../styles/AboutUs.css';

import trackerImage from '../components/assets/images/Team.png';
import chico1 from '../components/assets/images/chico1.jpg';
import chico2 from '../components/assets/images/chico2.jpg';
import chica from '../components/assets/images/chica.jpg';
import imgTsvetan from "../components/assets/images/tkgO.jpg"
import imgYova from "../components/assets/images/Yova1.png"
import imgSebas from "../components/assets/images/sebas.jpg"

import {
  CodeBracketIcon,
  UserCircleIcon,
  ClipboardDocumentListIcon
} from "@heroicons/react/24/outline";
import ProfileCard from './ProfileCard.jsx';

export default function AboutUs() {
  const nameTsvetan = "Tsvetan Kirilov Georgiev"
  const descripcionCeci = "He empezado mi camino como Full Stack Developer porque me apasiona la tecnología y crear soluciones completas, desde el frontend hasta el backend. Actualmente me formo en 4Geeks Academy, reforzando mis habilidades para crecer profesionalmente en desarrollo web."
  const handleCeci = "tsvetan"

  const nameYova = "Yovanna Alvarez"
  const handleYova = "yovanna"
  const descripcionYova = "Diseñar el tracker de empleo fue una oportunidad para crear con empatía, claridad y propósito. Cada decisión busca acompañar al usuario en su camino, con una interfaz que inspira confianza y acción."

  const nameSebas = "Juan Sebastian Torres Arias"
  const handleSebas = "sebas"


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
        <h2 style={{ textAlign: "center" }}>Nuestro Equipo</h2>
        <p> Somos tres developers que nos unimos para crear este proyecto con una misma visión: usar la tecnología para resolver problemas reales. </p>

        <div className="team-photos flex justify-center gap-12 mb-6">

          <ProfileCard
            avatarUrl={imgTsvetan}
            name={nameTsvetan}
            showIcon={false}
            description={descripcionCeci}
            handle={handleCeci}
            showUserInfo
            behindGlowEnabled={false}
            behindGlowColor="hsla(228, 87%, 29%, 0.60)"
            customInnerGradient="linear-gradient(145deg,hsla(298, 40%, 45%, 0.55) 0%,hsla(169, 60%, 70%, 0.27) 100%)"
          />

          <ProfileCard
            avatarUrl={imgYova}
            name={nameYova}
            description={descripcionYova}
            handle={handleYova}
            showIcon={false}
            showUserInfo
            behindGlowEnabled={false}

            behindGlowColor="hsla(298, 71%, 92%, 0.60)"
            customInnerGradient="linear-gradient(145deg,hsla(298, 40%, 45%, 0.55) 0%,hsla(169, 60%, 70%, 0.27) 100%)"
          />

          <ProfileCard

            avatarUrl={imgSebas}
            name={nameSebas}
            showIcon={false}
            handle={handleSebas}

            showUserInfo
            behindGlowColor="hsla(298, 100%, 70%, 0.6)"
            customInnerGradient="linear-gradient(145deg,hsla(298, 40%, 45%, 0.55) 0%,hsla(169, 60%, 70%, 0.27) 100%)"
          />

        </div>



        <p className="closing-text">
          Trabajamos juntos para crear una herramienta que te acompañe en tu búsqueda laboral.
        </p>
      </section>


    </div>
  );
}
