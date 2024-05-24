import React, { useState } from "react";
import axios from "axios";
import { backendURL } from "../config";

const EditEdt = ({ Edt, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    IdCreneau: Edt.IdCreneau,
    MatriculeProf: Edt.MatriculeProf,
    palier: Edt.palier,
    specialite: Edt.specialite,
    section: Edt.section,
    groupe: Edt.groupe,
    module: Edt.module,
    salle: Edt.salle,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${backendURL}/modifierEdt/${Edt.IdCreneau}`, formData);
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error updating Edt:", error);
    }
  };

  return (
    <div className="col border border-primary border-3 rounded p-3 m-2">
      <h5 className="text-center">Modifier Créneau</h5>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Créneau</label>
          <input
            type="text"
            className="form-control"
            name="IdCreneau"
            value={formData.IdCreneau}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Palier</label>
          <input
            type="text"
            className="form-control"
            name="palier"
            value={formData.palier}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Spécialité</label>
          <input
            type="text"
            className="form-control"
            name="specialite"
            value={formData.specialite}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Section</label>
          <input
            type="text"
            className="form-control"
            name="section"
            value={formData.section}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Groupe</label>
          <input
            type="text"
            className="form-control"
            name="groupe"
            value={formData.groupe}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Module</label>
          <input
            type="text"
            className="form-control"
            name="module"
            value={formData.module}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Salle</label>
          <input
            type="text"
            className="form-control"
            name="salle"
            value={formData.salle}
            onChange={handleChange}
          />
        </div>
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

export default EditEdt;
