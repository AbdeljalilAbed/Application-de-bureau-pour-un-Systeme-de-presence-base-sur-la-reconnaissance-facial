import React, { useState } from "react";
import axios from "axios";
import { backendURL } from "../config";

function UploadEdt() {
  const [file, setFile] = useState(null);
  const [palier, setPalier] = useState("");
  const [specialite, setSpecialite] = useState("");
  const [section, setSection] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("palier", palier);
    formData.append("specialite", specialite);
    formData.append("section", section);

    try {
      axios.post(backendURL + "/edt-upload", formData, {
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
    <div className="border border-primary border-3 rounded p-3">
      <div className="login-header">Upload EDT</div>
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

        <input
          className="login-input"
          id="file"
          type="file"
          onChange={handleFileChange}
        />
        <button className="login-button" type="submit" onClick={handleUpload}>
          Upload
        </button>
      </form>
    </div>
  );
}

export default UploadEdt;
