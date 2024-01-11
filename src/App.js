import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

// Import des styles
import "./index.css";

// Import des pages
import Landing from "./pages/Landing/Landing";
import About from "./pages/About/About";
import Members from "./pages/Members/Members";
import MemberCard from "./pages/MemberCard/MemberCard";
import Error404 from "./pages/Error404/Error404";
import SignUp from "./pages/SignUp/SignUp";
import Login from "./pages/Login/Login";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import ResetThePassword from "./pages/ResetThePassword/ResetThePassword";
import Dashboard from "./pages/Dashboard/Dashboard";

// Création des routes
function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Landing />} />
        <Route path="/About" element={<About />} />
        <Route path="/Members" element={<Members />} />
        <Route path="/Members/:id" element={<MemberCard />} />
        <Route path="/*" element={<Error404 />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/ResetPassword" element={<ResetPassword />} />
        <Route
          path="/ResetPassword/:resetToken"
          element={<ResetThePassword />}
        />
        <Route path="/Dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

// Export de l'application
export default App;
