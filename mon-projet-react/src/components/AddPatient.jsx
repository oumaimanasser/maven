import React, { useState } from "react";
import axios from "axios";
import { Button, Form } from "react-bootstrap";

const AddPatient = ({ fetchPatients }) => {
  const [newPatient, setNewPatient] = useState({
    idHospitalization: "",
    idPatient: "",
    admissionDate: "",
    dischargeDate: "",
    roomNumber: "",
    discharge: "No",
  });
  const [loading, setLoading] = useState(false);

  const addPatient = async (event) => {
    event.preventDefault();
    setLoading(true); // Afficher l'indicateur de chargement

    try {
      await axios.post("http://localhost:5000/hospitalized-patients/add", newPatient);
      fetchPatients(); // Mettre à jour la liste des patients
    } catch (error) {
      console.error("Erreur lors de l'ajout du patient:", error);
    } finally {
      setLoading(false); // Masquer l'indicateur de chargement
    }
  };

  return (
    <Form onSubmit={addPatient}>
      <Form.Group className="mb-3">
        <Form.Label>ID Hospitalization</Form.Label>
        <Form.Control
          type="number"
          value={newPatient.idHospitalization}
          onChange={(e) => setNewPatient({ ...newPatient, idHospitalization: e.target.value })}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>ID Patient</Form.Label>
        <Form.Control
          type="number"
          value={newPatient.idPatient}
          onChange={(e) => setNewPatient({ ...newPatient, idPatient: e.target.value })}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Admission Date</Form.Label>
        <Form.Control
          type="date"
          value={newPatient.admissionDate}
          onChange={(e) => setNewPatient({ ...newPatient, admissionDate: e.target.value })}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Discharge Date</Form.Label>
        <Form.Control
          type="date"
          value={newPatient.dischargeDate}
          onChange={(e) => setNewPatient({ ...newPatient, dischargeDate: e.target.value })}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Room Number</Form.Label>
        <Form.Control
          type="text"
          value={newPatient.roomNumber}
          onChange={(e) => setNewPatient({ ...newPatient, roomNumber: e.target.value })}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Discharge</Form.Label>
        <Form.Select
          value={newPatient.discharge}
          onChange={(e) => setNewPatient({ ...newPatient, discharge: e.target.value })}
        >
          <option value="No">Non</option>
          <option value="Yes">Oui</option>
        </Form.Select>
      </Form.Group>

      <Button type="submit" variant="success" disabled={loading}>
        {loading ? "Chargement..." : "Ajouter"}
      </Button>
    </Form>
  );
};

export default AddPatient;
