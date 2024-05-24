import React, { useState } from "react";
import axios from "axios";
import { backendURL } from "../config";

function UploadEdt() {
  const [palier, setPalier] = useState("");
  const [specialite, setSpecialite] = useState("");
  const [section, setSection] = useState("");

  const handleUpload = async () => {
    try {
      await axios.delete(
        `${backendURL}/removeEdt/${palier}/${specialite}/${section}`
      );
      alert("Data uploaded successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to upload data");
    }
  };

  return (
    <div className="border border-primary border-3 rounded p-3">
      <div className="login-header">Supprimer EDT</div>
      <form>
        <input
          value={palier}
          onChange={(e) => setPalier(e.target.value)}
          placeholder="Palier"
          type="text"
          className="login-input"
          id="Palier"
        />
        <input
          value={specialite}
          onChange={(e) => setSpecialite(e.target.value)}
          placeholder="specialite"
          className="login-input"
          id="Specialite"
        />
        <input
          value={section}
          onChange={(e) => setSection(e.target.value)}
          placeholder="section"
          required
          className="login-input"
          id="Section"
        />

        <button className="login-button" type="submit" onClick={handleUpload}>
          Supprimer
        </button>
      </form>
    </div>
  );
}

export default UploadEdt;
