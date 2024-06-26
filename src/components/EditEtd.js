import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendURL } from "../config";

const EditEtd = ({ Etudiant, onClose, onUpdate }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [hasEmbedding, setHasEmbedding] = useState(false);

  const [formData, setFormData] = useState({
    MatriculeEtd: Etudiant.MatriculeEtd,
    nom: Etudiant.nom,
    prenom: Etudiant.prenom,
    palier: Etudiant.palier,
    specialite: Etudiant.specialite,
    section: Etudiant.section,
    groupe: Etudiant.groupe,
    etat: Etudiant.etat,
  });

  useEffect(() => {
    // Fetch all embeddings when the component mounts
    const fetchEmbeddings = async () => {
      try {
        const response = await axios.get(`${backendURL}/getEmbeddings/all/all`);
        const embeddings = response.data;
        setHasEmbedding(embeddings.hasOwnProperty(Etudiant.MatriculeEtd));
      } catch (error) {
        console.error("Error fetching embeddings:", error);
      }
    };

    fetchEmbeddings();
  }, [Etudiant.MatriculeEtd]);

  const handleFileChange = (event) => {
    setSelectedFiles(Array.from(event.target.files));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${backendURL}/modifierEtudiant/${Etudiant.MatriculeEtd}`,
        formData
      );
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error updating Etudiant:", error);
    }
  };
  const handleSubmitFile = async (e) => {
    e.preventDefault();
    try {
      const Data = new FormData();
      selectedFiles.forEach((file) => {
        Data.append("images", file);
      });

      const response = await axios.post(backendURL + "/images-upload", Data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Upload successful:", response.data);
      alert("Data uploaded successfully");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload data");
    }
  };

  const handleDeleteEmbedding = async () => {
    try {
      await axios.delete(
        `${backendURL}/deleteEmbedding/${Etudiant.MatriculeEtd}`
      );
      setHasEmbedding(false);
      alert("Embedding deleted successfully");
    } catch (error) {
      console.error("Error deleting embedding:", error);
      alert("Failed to delete embedding");
    }
  };

  return (
    <div className="col border border-primary border-3 rounded p-3 m-2">
      <h5 className="text-center">Modifier Etudiant</h5>
      <form onSubmit={handleSubmit}>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            name="MatriculeEtd"
            value={formData.MatriculeEtd}
            onChange={handleChange}
            readOnly
          />
          <input
            type="text"
            className="form-control"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
          />
          <input
            type="text"
            className="form-control"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
          />
        </div>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            name="palier"
            value={formData.palier}
            onChange={handleChange}
          />
          <input
            type="text"
            className="form-control"
            name="specialite"
            value={formData.specialite}
            onChange={handleChange}
          />
          <input
            type="text"
            className="form-control"
            name="section"
            value={formData.section}
            onChange={handleChange}
          />
        </div>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            name="groupe"
            value={formData.groupe}
            onChange={handleChange}
          />
          <input
            type="text"
            className="form-control"
            name="etat"
            value={formData.etat}
            onChange={handleChange}
          />
        </div>
        <input
          type="file"
          className="form-control"
          multiple
          onChange={handleFileChange}
          disabled={hasEmbedding}
        />
        <button
          type="button"
          className="btn btn-secondary m-2"
          onClick={handleSubmitFile}
        >
          Ajouter image
        </button>

        {hasEmbedding && (
          <button
            type="button"
            className="btn btn-danger m-2"
            onClick={handleDeleteEmbedding}
          >
            Supprimer image
          </button>
        )}
        <div className="mb-3"></div>
        <div className="row text-center">
          <div className="col">
            <button type="submit" className="btn btn-primary m-2">
              Mettre à jour
            </button>
            <button
              type="button"
              className="btn btn-secondary m-2"
              onClick={onClose}
            >
              Annuler
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditEtd;
