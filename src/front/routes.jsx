import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import HomePage from "./pages/HomePage";
import Jobs from "./pages/Jobs";
import Registration from "./pages/RegisterPage";
import App from "./pages/App";
import Curriculums from "./pages/Curriculum";
import Interview from "./pages/Interview";
import PerfilUsuario from "./pages/PerfilUsuario";
import AboutUs from "./pages/AboutUs";
import AdminCV from "./pages/AdminCV";


import EditProfile from "./components/ProfileComponents/EditProfile.jsx";
import LoginForm from "./components/user/LoginForm.jsx";
import Formulario from "./components/JobComponent/Formulario.jsx";
import JobsDetail from "./components/JobComponent/JobsDetail.jsx"
import Stepper from './components/CreateRouteMap.jsx'

export const router = createBrowserRouter(
  createRoutesFromElements(

    <Route path="/" element={<App />} errorElement={<h1>Not found!</h1>}>

      <Route index element={<HomePage />} />
      <Route path="postulations">
        <Route index element={<Jobs />} />
        <Route path=":id" element={<JobsDetail />} />
        <Route path="/postulations/:id/route-map" element={<JobsDetail />} />
        <Route path="formulario" element={<Formulario />} />
      </Route>
      <Route path="postulations/:id/create-stepper" element={<Stepper />} />
      <Route path="curriculum" element={<Curriculums />} />
      <Route path="interview" element={<Interview />} />
      <Route path="register" element={<Registration />} />

      <Route path="login" element={<LoginForm />} />
      <Route path="perfil" element={<PerfilUsuario />} />
      <Route path="about" element={<AboutUs />} />
      {/* <Route path="timeline" element={<ListadoAplicaciones />} /> */}
      <Route path="admin-cv" element={<AdminCV />} />
      <Route path="about" element={<AboutUs />} />
      <Route path="perfil/:id/edit" element={<EditProfile />} />




    </Route>
  )
);
