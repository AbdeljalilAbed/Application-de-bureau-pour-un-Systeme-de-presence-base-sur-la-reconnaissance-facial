import React, { useState } from "react";
import axios from "axios";
import { backendURL } from "../config";
import "./Register.css";

const DeleteImages = () => {
  const [MatriculeEtd, setMatriculeEtd] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleRemoveImages = async (e) => {
    e.preventDefault();
    try {
      // Send a DELETE request to your backend endpoint to remove the professor
      const response = await axios.delete(
        `${backendURL}/removeImages/${MatriculeEtd}`
      );
      console.log(response.data); // Log response from the server
      setSuccessMessage("Images removed successfully.");
      setErrorMessage("");
    } catch (error) {
      console.error("Error removing Images:", error);
      setErrorMessage("Error removing Images. Please try again.");
      setSuccessMessage("");
    }
  };

  return (
    <div className="col bg-body rounded p-2">
      <div className="border border-primary border-3 rounded p-2">
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

        <div className="login-header">Supprimer Images</div>
        <form onSubmit={handleRemoveImages}>
          <input
            value={MatriculeEtd}
            onChange={(e) => setMatriculeEtd(e.target.value)}
            placeholder="Matricule"
            type="text"
            className="login-input"
            id="MatriculeEtd"
          />
          <button className="btn btn-primary" type="submit">
            supprimer
          </button>
        </form>
      </div>
    </div>
  );
};

export default DeleteImages;
