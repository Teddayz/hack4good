import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./components/SignIn";
import SignUp from './components/SignUp';
import ResidentDashboard from "./components/ResidentDashboard";
import AdminDashboard from "./components/AdminDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" replace />} /> 
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/resident" element={<ResidentDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
