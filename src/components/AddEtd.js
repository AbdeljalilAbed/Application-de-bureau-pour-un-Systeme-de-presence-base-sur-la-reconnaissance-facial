import React, { useState } from "react";
import axios from "axios";
import { backendURL } from "../config";
import "./Register.css";

const AddEtd = () => {
  const [MatriculeEtd, setMatriculeEtd] = useState("");
  const [palier, setPalier] = useState("");
  const [specialite, setSpecialite] = useState("");
  const [section, setSection] = useState("");
  const [etat, setEtat] = useState("");
  const [groupe, setGroupe] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleAddEtd = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(backendURL + "/addEtd", {
        palier,
        specialite,
        section,
        MatriculeEtd,
        nom,
        prenom,
        etat,
        groupe,
      });
      console.log(response.data);
      setSuccessMessage("Etudiant added successfully.");
      setErrorMessage("");
    } catch (error) {
      console.error("Error adding etudiant:", error);
      setErrorMessage("Error adding etudiant. Please try again.");
      setSuccessMessage("");
    }
  };

  return (
    <div className="border border-primary border-3 rounded p-3">
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      <div className="login-header">Ajouter Etudiant</div>
      <form onSubmit={handleAddEtd}>
        <div className="input-group mb-3">
          <input
            value={MatriculeEtd}
            onChange={(e) => setMatriculeEtd(e.target.value)}
            placeholder="Matricule"
            type="text"
            className="form-control"
            id="MatriculeEtd"
          />
        </div>
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
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Nom"
            type="text"
            className="form-control"
            id="NOm"
          />
          <input
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            placeholder="Prenom"
            type="text"
            required
            className="form-control"
            id="prenom"
          />
        </div>
        <div className="input-group mb-3">
          <input
            value={etat}
            onChange={(e) => setEtat(e.target.value)}
            placeholder="Etat"
            type="text"
            className="form-control"
            id="Etat"
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
