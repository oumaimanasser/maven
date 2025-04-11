import React, { useState, useEffect } from "react";
import axios from "axios";
import "../assets/HospitalizedPatients.css";function HospitalizedPatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    discharged: 0
  });

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/hospitalized-patients");
        setPatients(response.data);
        
        // Calculate stats
        const active = response.data.filter(p => !p.dischargeDate).length;
        setStats({
          total: response.data.length,
          active: active,
          discharged: response.data.length - active
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des patients:", error);
        setAlert({
          type: "danger",
          message: "Impossible de charger les patients. Veuillez réessayer plus tard.",
          icon: "exclamation-circle"
        });
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const deletePatient = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/hospitalized-patients/${id}`);
      setPatients(patients.filter(patient => patient._id !== id));
      
      setAlert({
        type: "success",
        message: "Patient supprimé avec succès!",
        icon: "check-circle"
      });
      
      // Update stats
      const patient = patients.find(p => p._id === id);
      const isActive = !patient.dischargeDate;
      
      setStats(prev => ({
        total: prev.total - 1,
        active: isActive ? prev.active - 1 : prev.active,
        discharged: isActive ? prev.discharged : prev.discharged - 1
      }));
      
      // Auto-dismiss alert after 3 seconds
      setTimeout(() => {
        setAlert(null);
      }, 3000);
    } catch (error) {
      console.error("Erreur lors de la suppression du patient:", error);
      setAlert({
        type: "danger",
        message: "Erreur lors de la suppression du patient.",
        icon: "exclamation-circle"
      });
    }
  };

  const generateReport = async (id) => {
    setAlert({
      type: "info",
      message: "Génération du rapport en cours...",
      icon: "file-pdf"
    });
    
    try {
      const response = await axios.get(`http://localhost:5000/hospitalized-patients/${id}/report`, { responseType: 'blob' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(response.data);
      link.download = `rapport-${id}.pdf`;
      link.click();
      
      setAlert({
        type: "success",
        message: "Rapport généré avec succès!",
        icon: "check-circle"
      });
      
      // Auto-dismiss alert after 3 seconds
      setTimeout(() => {
        setAlert(null);
      }, 3000);
    } catch (error) {
      console.error("Erreur lors de la génération du rapport:", error);
      setAlert({
        type: "danger",
        message: "Erreur lors de la génération du rapport.",
        icon: "exclamation-circle"
      });
    }
  };
  
  // Function to get patient initials for avatar
  const getInitials = (patientId) => {
    const id = String(patientId);
    return id.length > 1 ? id.substring(0, 2).toUpperCase() : id.toUpperCase();
  };

  return (
    <div className="app-container page-transition">
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div className="header-logo">
            <i className="fas fa-hospital"></i>
            <h1 className="header-title">Gestion Hospitalière</h1>
          </div>
          <nav className="header-nav">
            <a href="#" className="nav-item">Dashboard</a>
            <a href="#" className="nav-item">Patients</a>
            <a href="#" className="nav-item">Chambres</a>
            <a href="#" className="nav-item">Rapports</a>
          </nav>
        </div>
      </header>
      
      <main className="main-content">
        {/* Alert notification */}
        {alert && (
          <div className={`alert alert-${alert.type}`}>
            <i className={`fas fa-${alert.icon} alert-icon`}></i>
            {alert.message}
            <button className="alert-close" onClick={() => setAlert(null)}>
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}
        
        {/* Stats Dashboard */}
        <div className="dashboard-grid">
          <div className="stat-card">
            <div className="stat-icon patients">
              <i className="fas fa-users"></i>
            </div>
            <div className="stat-info">
              <h3>{stats.total}</h3>
              <p>Total Patients</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon rooms">
              <i className="fas fa-procedures"></i>
            </div>
            <div className="stat-info">
              <h3>{stats.active}</h3>
              <p>Patients Actuels</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon discharge">
              <i className="fas fa-walking"></i>
            </div>
            <div className="stat-info">
              <h3>{stats.discharged}</h3>
              <p>Patients Sortis</p>
            </div>
          </div>
        </div>
        
        {/* Patients Table */}
        <div className="table-container">
          <div className="table-header">
            <h2 className="table-title">Liste des Patients Hospitalisés</h2>
            <div className="table-actions">
              <button className="btn btn-primary">
                <i className="fas fa-plus btn-icon"></i>
                Ajouter Patient
              </button>
            </div>
          </div>
          
          {loading ? (
            <div className="loading">
              <div className="loading-spinner"></div>
              <span className="loading-text">Chargement des patients...</span>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Date Admission</th>
                  <th>Date Sortie</th>
                  <th>Chambre</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient._id}>
                    <td>
                      <div className="patient-info">
                        <div className="patient-avatar">{getInitials(patient.idPatient)}</div>
                        {patient.idPatient}
                      </div>
                    </td>
                    <td>{new Date(patient.admissionDate).toLocaleDateString('fr-FR')}</td>
                    <td>
                      {patient.dischargeDate ? 
                        new Date(patient.dischargeDate).toLocaleDateString('fr-FR') : 
                        "Non sorti"}
                    </td>
                    <td>{patient.roomNumber}</td>
                    <td>
                      <span className={`status-badge ${patient.dischargeDate ? 'status-discharged' : 'status-active'}`}>
                        {patient.dischargeDate ? 'Sortie' : 'Hospitalisé'}
                      </span>
                    </td>
                    <td>
                      <div className="tooltip">
                        <button className="btn btn-primary" onClick={() => generateReport(patient._id)}>
                          <i className="fas fa-file-pdf btn-icon"></i>
                        </button>
                        <span className="tooltip-text">Générer PDF</span>
                      </div>
                      <div className="tooltip">
                        <button className="btn btn-danger" onClick={() => deletePatient(patient._id)}>
                          <i className="fas fa-trash btn-icon"></i>
                        </button>
                        <span className="tooltip-text">Supprimer</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
      
      <footer className="footer">
        <p className="footer-text">© 2025 Système de Gestion Hospitalière</p>
      </footer>
    </div>
  );
}

export default HospitalizedPatients;