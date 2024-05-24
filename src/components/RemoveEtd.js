import React, { useState } from "react";
import axios from "axios";
import { backendURL } from "../config";
import "./Register.css";

const RemoveEtd = () => {
  const [MatriculeEtd, setMatriculeEtd] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleRemoveEtd = async (e) => {
    e.preventDefault();
    try {
      // Send a DELETE request to your backend endpoint to remove the professor
      const response = await axios.delete(
        `${backendURL}/removeEtd/${MatriculeEtd}`
      );
      console.log(response.data); // Log response from the server
      setSuccessMessage("Etudiant removed successfully.");
      setErrorMessage("");
    } catch (error) {
      console.error("Error removing etudiant:", error);
      setErrorMessage("Error removing etudiant. Please try again.");
      setSuccessMessage("");
    }
  };

  return (
    <div className="border border-primary border-3 rounded p-3 mt-5">
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      <div className="login-header">Supprimer Etudiant</div>
      <form onSubmit={handleRemoveEtd}>
        <input
          value={MatriculeEtd}
          onChange={(e) => setMatriculeEtd(e.target.value)}
          placeholder="Matricule"
          type="text"
          className="login-input"
          id="MatriculeEtd"
        />
        <button className="login-button" type="submit">
          Supprimer Etudiant
        </button>
      </form>
    </div>
  );
};

export default RemoveEtd;
