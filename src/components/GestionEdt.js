import React, { useState } from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import UploadEdt from "./UploadEdt";
import RemoveEdt from "./RemoveEdt";
import AddEdt from "./AddEdt";
import EditEdt from "./EditEdt";
import getJourEtHoraire from "../utils";

import { backendURL } from "../config";
import axios from "axios";

const GestionEtudiants = () => {
  const [selectedEdt, setSelectedEdt] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const [Edts, setEdts] = useState([]);
  const [selectedPalier, setSelectedPalier] = useState("");
  const [selectedSpecialite, setSelectedSpecialite] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [specialites, setSpecialites] = useState([]);
  const [sections, setSections] = useState([]);

  // Define options for palier, specialite, and section
  const paliers = ["L1", "L2", "L3", "M1", "M2"];
  const specialitesByPalier = {
    L1: ["TRONC COMMUN"],
    L2: ["ACAD", "ISIL", "GTR"],
    L3: ["ACAD", "ISIL", "GTR"],
    M1: ["RSD", "IL", "SII", "BIGDATAA", "MIND", "IV", "BIOINFO", "HPC"],
    M2: ["RSD", "IL", "SII", "BIGDATAA", "MIND", "IV", "BIOINFO", "HPC"],
  };
  const sectionsBySpecialite = {
    "TRONC COMMUN": ["A", "B", "C", "D", "E", "F"],
    ACAD: ["A", "B", "C"],
    ISIL: ["A", "B"],
    RSD: ["A"],
    IL: ["A"],
    SII: ["A"],
    BIGDATAA: ["A"],
    MIND: ["A"],
    IV: ["A"],
    BIOINFO: ["A"],
    HPC: ["A"],
    // Add sections for other specialities
  };

  async function fetchData() {
    try {
      const EdtsResponse = await axios.get(backendURL + "/getEmploiDuTemps", {
        params: {
          palier: selectedPalier,
          specialite: selectedSpecialite,
          section: selectedSection,
          groupe: selectedGroup,
        },
      });
      setEdts(EdtsResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // Handle palier change
  const handlePalierChange = (e) => {
    const palier = e.target.value;
    setSelectedPalier(palier);
    setSelectedSpecialite(""); // Reset selected specialite
    setSpecialites(specialitesByPalier[palier] || []);
  };

  // Handle specialite change
  const handleSpecialiteChange = (e) => {
    const specialite = e.target.value;
    setSelectedSpecialite(specialite);
    setSelectedSection(""); // Reset selected section
    setSections(sectionsBySpecialite[specialite] || []);
  };

  // Handle section change
  const handleSectionChange = (e) => {
    const section = e.target.value;
    setSelectedSection(section);
  };
  // Function to handle removing a student
  const handleDelete = async (IdCreneau) => {
    try {
      console.log(IdCreneau);
      await axios.delete(`${backendURL}/removeCreneau/${IdCreneau}`);
      setEdts(Edts.filter((edt) => edt.IdCreneau !== IdCreneau));
      // Additional logic after removing the student
    } catch (error) {
      console.error("Error removing emploi du temps:", error);
    }
  };
  const handleUpdate = async () => {
    try {
      const EdtsResponse = await axios.get(`${backendURL}/getEmploiDuTemps`, {
        params: {
          palier: selectedPalier,
          specialite: selectedSpecialite,
          section: selectedSection,
          groupe: selectedGroup,
        },
      });
      setEdts(EdtsResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="container rounded mt-3 text-center bg-white">
      <div className="row p-4">
        <div className="col text-end">
          <Popup
            trigger={
              <button type="button" className="btn btn-lg btn-secondary">
                Ajouter Emploi Du Temps
              </button>
            }
            modal
            nested
          >
            {(close) => (
              <div>
                <div className="row text-end">
                  <div className="col">
                    <button
                      className="btn btn-primary close mb-1"
                      onClick={close}
                      position="top right"
                    >
                      &times;
                    </button>
                  </div>
                </div>
                <UploadEdt />
              </div>
            )}
          </Popup>
        </div>
        <div className="col">
          <Popup
            trigger={
              <button type="button" className="btn btn-lg btn-secondary">
                Supprimer Emploi Du Temps
              </button>
            }
            modal
            nested
          >
            {(close) => (
              <div>
                <div className="row text-end">
                  <div className="col">
                    <button
                      className="btn btn-primary close mb-1"
                      onClick={close}
                      position="top right"
                    >
                      &times;
                    </button>
                  </div>
                </div>
                <RemoveEdt />
              </div>
            )}
          </Popup>
        </div>
        <div className="col text-start">
          <Popup
            trigger={
              <button type="button" className="btn btn-lg btn-secondary">
                Ajouter Créneau
              </button>
            }
            modal
            nested
          >
            {(close) => (
              <div>
                <div className="row text-end">
                  <div className="col">
                    <button
                      className="btn btn-primary close mb-1"
                      onClick={close}
                      position="top right"
                    >
                      &times;
                    </button>
                  </div>
                </div>
                <AddEdt />
              </div>
            )}
          </Popup>
        </div>
      </div>
      <div className="row text-center mt-3">
        <div className="col">
          <select
            className="form-select"
            aria-label="Palier"
            value={selectedPalier}
            onChange={handlePalierChange}
          >
            <option value="">Palier</option>
            {paliers.map((palier) => (
              <option key={palier} value={palier}>
                {palier}
              </option>
            ))}
          </select>
        </div>
        <div className="col">
          <select
            className="form-select"
            aria-label="Specialite"
            value={selectedSpecialite}
            onChange={handleSpecialiteChange}
            disabled={!selectedPalier}
          >
            <option value="">Specialite</option>
            {specialites.map((specialite) => (
              <option key={specialite} value={specialite}>
                {specialite}
              </option>
            ))}
          </select>
        </div>

        <div className="col">
          <select
            className="form-select"
            aria-label="Section"
            value={selectedSection}
            onChange={handleSectionChange}
            disabled={!selectedSpecialite}
          >
            <option value="">Section</option>
            {sections.map((section) => (
              <option key={section} value={section}>
                {section}
              </option>
            ))}
          </select>
        </div>
        <div className="col">
          <select
            className="form-select"
            aria-label="Group"
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            disabled={!selectedSection}
          >
            <option value="">Group</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </div>

        <div className="col d-grid">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={fetchData} // Fetch data again to update the table
          >
            Filtrer
          </button>
        </div>
      </div>

      <div className="row">
        <div class="table-responsive">
          {Edts.length > 0 ? (
            <table class="table mt-4 ">
              <thead>
                <tr>
                  <th>Jour</th>
                  <th>Horaire</th>
                  <th>Module</th>
                  <th>Salle</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {Edts.map((Edt, index) => (
                  <tr key={index}>
                    <td>{getJourEtHoraire(Edt.IdCreneau).jour}</td>
                    <td>{getJourEtHoraire(Edt.IdCreneau).horaire}</td>
                    <td>{Edt.module}</td>
                    <td>{Edt.salle}</td>
                    <td>
                      {" "}
                      <button
                        onClick={() => {
                          setSelectedEdt(Edt);
                          setIsEdit(true);
                        }}
                        type="button"
                        className="btn"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          class="bi bi-pen"
                          viewBox="0 0 16 16"
                        >
                          <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z" />
                        </svg>{" "}
                      </button>
                    </td>
                    <td>
                      {" "}
                      <button
                        onClick={() => setSelectedEdt(Edt)}
                        type="button"
                        className="btn"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          class="bi bi-trash-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="p-5">Aucun créneau à afficher</p>
          )}
        </div>
      </div>
      {selectedEdt && isEdit && (
        <Popup
          open={true}
          modal
          nested
          onClose={() => {
            setSelectedEdt(null);
            setIsEdit(false);
          }}
        >
          <div>
            <div className="row text-end">
              <div className="col">
                <button
                  className="btn btn-primary close mb-1"
                  onClick={() => {
                    setSelectedEdt(null);
                    setIsEdit(false);
                  }}
                  position="top right"
                >
                  &times;
                </button>
              </div>
            </div>
            <EditEdt
              Edt={selectedEdt}
              onClose={() => {
                setSelectedEdt(null);
                setIsEdit(false);
              }}
              onUpdate={handleUpdate}
            />
          </div>
        </Popup>
      )}

      {selectedEdt && !isEdit && (
        <Popup open={true} modal nested onClose={() => setSelectedEdt(null)}>
          <div>
            <div className="row text-end">
              <div className="col">
                <button
                  className="btn btn-primary close mb-1"
                  onClick={() => setSelectedEdt(null)}
                  position="top right"
                >
                  &times;
                </button>
              </div>
            </div>
            <div className="col border border-primary border-3 rounded text-center p-3 m-2">
              <h5>Confirmation de suppression</h5>
              <p>Êtes-vous sûr de vouloir supprimer le créneau suivant ?</p>
              <p>
                <strong>Créneau:</strong> {selectedEdt.IdCreneau}
              </p>
              <p>
                <strong>Salle:</strong> {selectedEdt.salle}
              </p>
              <p>
                <strong>Module:</strong> {selectedEdt.module}
              </p>
              <button
                className="btn btn-danger m-2"
                onClick={() => handleDelete(selectedEdt.IdCreneau)}
              >
                Supprimer
              </button>
              <button
                className="btn btn-secondary m-2"
                onClick={() => setSelectedEdt(null)}
              >
                Annuler
              </button>
            </div>
          </div>
        </Popup>
      )}
    </div>
  );
};

export default GestionEtudiants;
