import React, { useState } from "react";
import axios from "axios";
import { backendURL } from "../config";
import getIdCreneau from "../getIdCreneau";
import "./Register.css";

const AddEtd = () => {
  const [palier, setPalier] = useState("");
  const [specialite, setSpecialite] = useState("");
  const [section, setSection] = useState("");
  const [jour, setJour] = useState("");
  const [horaire, setHoraire] = useState("");
  const [groupe, setGroupe] = useState("");
  const [salle, setSalle] = useState("");
  const [module, setModule] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const jours = ["Samedi", "Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi"];
  const horaires = [
    "08:00 - 09:30",
    "09:40 - 11:10",
    "11:20 - 12:50",
    "13:00 - 14:30",
    "14:40 - 16:10",
    "16:20 - 17:50",
  ];

  const handleAddEtd = async (e) => {
    e.preventDefault();
    const IdCreneau = getIdCreneau(jour, horaire);
    try {
      const response = await axios.post(backendURL + "/addEdt", {
        palier,
        specialite,
        section,
        salle,
        module,
        IdCreneau,
        groupe,
      });
      console.log(response.data);
      setSuccessMessage("Edt added successfully.");
      setErrorMessage("");
    } catch (error) {
      console.error("Error adding edt:", error);
      setErrorMessage("Error adding edt. Please try again.");
      setSuccessMessage("");
    }
  };

  return (
    <div className="border border-primary border-3 rounded p-3">
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      <div className="login-header">Ajouter Creneau EDT</div>
      <form onSubmit={handleAddEtd}>
        <div className="input-group mb-3">
          <input
            value={palier}
            onChange={(e) => setPalier(e.target.value)}
            placeholder="Palier"
            type="text"
            className="form-control"
            id="Palier"
          />
          <input
            value={specialite}
            onChange={(e) => setSpecialite(e.target.value)}
            placeholder="Specialite"
            type="text"
            className="form-control"
            id="Specialite"
          />
        </div>
        <div className="input-group mb-3">
          <input
            value={section}
            onChange={(e) => setSection(e.target.value)}
            placeholder="Section"
            type="text"
            className="form-control"
            id="Section"
          />
          <input
            value={salle}
            onChange={(e) => setSalle(e.target.value)}
            placeholder="Salle"
            type="text"
            className="form-control"
            id="Salle"
          />
          <input
            value={module}
            onChange={(e) => setModule(e.target.value)}
            placeholder="Module"
            type="text"
            required
            className="form-control"
            id="Module"
          />
        </div>
        <div className="input-group mb-3">
          <select
            value={jour}
            onChange={(e) => setJour(e.target.value)}
            className="form-control"
            id="Jour"
          >
            <option value="" disabled>
              Sélectionner le jour
            </option>
            {jours.map((j) => (
              <option key={j} value={j}>
                {j}
              </option>
            ))}
          </select>
          <select
            value={horaire}
            onChange={(e) => setHoraire(e.target.value)}
            className="form-control"
            id="Horaire"
          >
            <option value="" disabled>
              Sélectionner l'horaire
            </option>
            {horaires.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
          <input
            value={groupe}
            onChange={(e) => setGroupe(e.target.value)}
            placeholder="Groupe"
            type="text"
            className="form-control"
            id="groupe"
          />
        </div>
        <button className="btn btn-primary" type="submit">
          Ajouter
        </button>
      </form>
    </div>
  );
};

export default AddEtd;
