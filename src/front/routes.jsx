import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import HomePage from "./pages/HomePage";
import Jobs from "./pages/Jobs";
import Registration from "./pages/RegisterPage";
import LoginForm from "./components/LoginForm";
import App from "./pages/App";
import Curriculums from "./pages/Curriculum";
import Interview from "./pages/Interview";
import PerfilUsuario from "./pages/PerfilUsuario";
import Formulario from "./pages/Formulario";
import AboutUs from "./pages/AboutUs";
import ApplicationTimeline from "./pages/ApplicationTimeline";









export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} errorElement={<h1>Not found!</h1>} >
      <Route index element={<HomePage />} />
      <Route path="jobs" element={<Jobs />} />
      <Route path="curriculum" element={<Curriculums />} />
      <Route path="interview" element={<Interview />} />
      <Route path="register" element={<Registration />} />
      <Route path="login" element={<LoginForm />} />
      <Route path="perfil" element={<PerfilUsuario />} />
      <Route path="formulario" element={<Formulario />} />
      <Route path="about" element={<AboutUs />} />
      <Route path="timeline" element={<ApplicationTimeline />} />




    </Route>

  )
);