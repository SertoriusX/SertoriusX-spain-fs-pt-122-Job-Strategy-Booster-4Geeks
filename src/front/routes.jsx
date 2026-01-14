import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import HomePage from "./pages/HomePage";
import Jobs from "./pages/Jobs";
import Registration from "./pages/RegisterPage";
import LoginForm from "./components/LoginForm";
import Layout from "./pages/Layout";
export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >
      <Route index element={<HomePage />} />
      <Route path="jobs" element={<Jobs />} />
      <Route path="register" element={<Registration />} />
      <Route path="login" element={<LoginForm />} />
    </Route>

  )
);