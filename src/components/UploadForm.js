import React, { useState } from "react";
import axios from "axios";
import { backendURL } from "../config";

function UploadForm() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      axios.post(backendURL + "/uploadEtudiants", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Data uploaded successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to upload data");
    }
  };

  return (
    <div className="border border-primary border-3 rounded p-3 mt-5">
      <div className="login-header">Ajouter Liste Etudiants</div>
      <p>Le fichier doit etre en excel sous form d'un tableau sans en-tete</p>
      <form>
        <input
          placeholder="Matricule"
          className="login-input"
          id="file"
          type="file"
          onChange={handleFileChange}
        />
        <button className="login-button" type="submit" onClick={handleUpload}>
          Ajouter
        </button>
      </form>
    </div>
  );
}

export default UploadForm;
