import React, { useState } from "react";
import axios from "axios";
import { backendURL } from "../config";
import "./Register.css";

const DeleteCreneau = () => {
  const [IdCreneau, setIdCreneau] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleRemoveCreneau = async (e) => {
    e.preventDefault();
    try {
      // Send a DELETE request to your backend endpoint to remove the professor
      const response = await axios.delete(
        `${backendURL}/removeCreneau/${IdCreneau}`
      );
      console.log(response.data); // Log response from the server
      setSuccessMessage("Creneau removed successfully.");
      setErrorMessage("");
    } catch (error) {
      console.error("Error removing Creneau:", error);
      setErrorMessage("Error removing Creneau. Please try again.");
      setSuccessMessage("");
    }
  };

  return (
    <div className="col bg-body rounded p-2">
      <div className="border border-primary border-3 rounded p-2">
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

        <div className="login-header">Supprimer Creneau</div>
        <form onSubmit={handleRemoveCreneau}>
          <input
            value={IdCreneau}
            onChange={(e) => setIdCreneau(e.target.value)}
            placeholder="Creneau"
            type="text"
            className="login-input"
            id="MatriculeEtd"
          />
          <button className="btn btn-primary" type="submit">
            Supprimer
          </button>
        </form>
      </div>
    </div>
  );
};

export default DeleteCreneau;
