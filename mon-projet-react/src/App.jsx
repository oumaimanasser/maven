import React from 'react';  
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HospitalizedPatients from './components/HospitalizedPatients';
import AddPatient from './components/AddPatient';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // Ajouter le fichier CSS pour les styles personnalisés

function App() {
  return (
    <Router>
      <div className="navbar">
        <Link to="/hospitalized-patients">Patients Hospitalisés</Link>
        <Link to="/add-patient">Ajouter Patient</Link>
      </div>
      <Routes>
        <Route path="/hospitalized-patients" element={<HospitalizedPatients />} />
        <Route path="/add-patient" element={<AddPatient />} />
      </Routes>
    </Router>
  );
}

export default App;
