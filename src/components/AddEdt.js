import React, { useState } from "react";
import axios from "axios";
import { backendURL } from "../config";
import "./Register.css";

const AddEtd = () => {
  const [palier, setPalier] = useState("");
  const [specialite, setSpecialite] = useState("");
  const [section, setSection] = useState("");
  const [IdCreneau, setIdCreneau] = useState("");
  const [groupe, setGroupe] = useState("");
  const [salle, setSalle] = useState("");
  const [module, setModule] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleAddEtd = async (e) => {
    e.preventDefault();
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
          <input
            value={IdCreneau}
            onChange={(e) => setIdCreneau(e.target.value)}
            placeholder="IdCreneau"
            type="text"
            className="form-control"
            id="IdCreaneau"
          />
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
