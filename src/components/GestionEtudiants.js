import React, { useState } from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

import { backendURL } from "../config";
import axios from "axios";
import AddEtd from "./AddEtd";
import UploadImages from "./UploadImages";
import UploadForm from "./UploadForm";
import EditEtd from "./EditEtd";

const GestionEtudiants = () => {
  const [matricule, setMatricule] = useState("");
  const [selectedEtudiant, setSelectedEtudiant] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const [Etudiants, setEtudiants] = useState([]);
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
      const EtudiantsResponse = await axios.get(backendURL + "/getEtudiants", {
        params: {
          palier: selectedPalier,
          specialite: selectedSpecialite,
          section: selectedSection,
          groupe: selectedGroup,
          matricule: matricule,
        },
      });
      setEtudiants(EtudiantsResponse.data);
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
  const handleDelete = async (matricule) => {
    try {
      await axios.delete(`${backendURL}/removeEtd/${matricule}`);
      setEtudiants(
        Etudiants.filter((etudiant) => etudiant.MatriculeEtd !== matricule)
      );
      // Additional logic after removing the student
    } catch (error) {
      console.error("Error removing student:", error);
    }
  };
  const handleUpdate = async () => {
    try {
      const EtudiantsResponse = await axios.get(`${backendURL}/getEtudiants`, {
        params: {
          palier: selectedPalier,
          specialite: selectedSpecialite,
          section: selectedSection,
          groupe: selectedGroup,
          matricule: matricule,
        },
      });
      setEtudiants(EtudiantsResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="container rounded mt-3 text-center bg-white vh-100">
      <div className="row p-4">
        <div className="col text-end">
          <Popup
            trigger={
              <button type="button" className="btn btn-lg btn-secondary">
                Ajouter Liste Etudiants
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
                <UploadForm />
              </div>
            )}
          </Popup>
        </div>
        <div className="col">
          <Popup
            trigger={
              <button type="button" className="btn btn-lg btn-secondary">
                Ajouter Images Etudiants
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
                <UploadImages />
              </div>
            )}
          </Popup>
        </div>
        <div className="col text-start">
          <Popup
            trigger={
              <button type="button" className="btn btn-lg btn-secondary">
                Ajouter Etudiant
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
                <AddEtd />
              </div>
            )}
          </Popup>
        </div>
      </div>
      <div className="row text-center mt-3">
        <div className="col-2">
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
        <div className="col-2">
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

        <div className="col-2">
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
        <div className="col-2">
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
        <div className="col-2">
          <input
            className="form-control"
            type="text"
            placeholder="Matricule"
            aria-label="Matricule"
            value={matricule}
            onChange={(e) => setMatricule(e.target.value)}
          />
        </div>

        <div className="col-2 d-grid">
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
          {Etudiants.length > 0 ? (
            <table class="table mt-4 ">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Matricule</th>
                  <th>Nom</th>
                  <th>Prénom</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {Etudiants.map((Etd, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{Etd.MatriculeEtd}</td>
                    <td>{Etd.nom}</td>
                    <td>{Etd.prenom}</td>
                    <td>
                      {" "}
                      <button
                        onClick={() => {
                          setSelectedEtudiant(Etd);
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
                        onClick={() => setSelectedEtudiant(Etd)}
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
            <table class="table mt-4 ">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Matricule</th>
                  <th>Nom</th>
                  <th>Prénom</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>{Etudiants.MatriculeEtd}</td>
                  <td>{Etudiants.nom}</td>
                  <td>{Etudiants.prenom}</td>
                  <td>
                    {" "}
                    <button
                      onClick={() => {
                        setSelectedEtudiant(Etudiants);
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
                      onClick={() => setSelectedEtudiant(Etudiants)}
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
              </tbody>
            </table>
          )}
        </div>
      </div>
      {selectedEtudiant && isEdit && (
        <Popup
          open={true}
          modal
          nested
          onClose={() => {
            setSelectedEtudiant(null);
            setIsEdit(false);
          }}
        >
          <div>
            <div className="row text-end">
              <div className="col">
                <button
                  className="btn btn-primary close mb-1"
                  onClick={() => {
                    setSelectedEtudiant(null);
                    setIsEdit(false);
                  }}
                  position="top right"
                >
                  &times;
                </button>
              </div>
            </div>
            <EditEtd
              Etudiant={selectedEtudiant}
              onClose={() => {
                setSelectedEtudiant(null);
                setIsEdit(false);
              }}
              onUpdate={handleUpdate}
            />
          </div>
        </Popup>
      )}

      {selectedEtudiant && !isEdit && (
        <Popup
          open={true}
          modal
          nested
          onClose={() => setSelectedEtudiant(null)}
        >
          <div>
            <div className="row text-end">
              <div className="col">
                <button
                  className="btn btn-primary close mb-1"
                  onClick={() => setSelectedEtudiant(null)}
                  position="top right"
                >
                  &times;
                </button>
              </div>
            </div>
            <div className="col border border-primary border-3 rounded text-center p-3 m-2">
              <h5>Confirmation de suppression</h5>
              <p>Êtes-vous sûr de vouloir supprimer l'etudiant suivant ?</p>
              <p>
                <strong>Matricule:</strong> {selectedEtudiant.MatriculeEtd}
              </p>
              <p>
                <strong>Nom:</strong> {selectedEtudiant.nom}
              </p>
              <p>
                <strong>Prénom:</strong> {selectedEtudiant.prenom}
              </p>
              <button
                className="btn btn-danger m-2"
                onClick={() => handleDelete(selectedEtudiant.MatriculeEtd)}
              >
                Supprimer
              </button>
              <button
                className="btn btn-secondary m-2"
                onClick={() => setSelectedEtudiant(null)}
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
