import React, { useState } from "react";
import axios from "axios";
import { backendURL } from "../config";
import * as XLSX from "xlsx";

function exportToExcel(tableData, dates, isPresent) {
  // Create a new workbook
  const workbook = XLSX.utils.book_new();

  // Convert dates to column headers
  const header = ["#", "Matricule", "Nom", "Prenom", ...dates];

  // Create worksheet data array
  const wsData = [header];

  // Populate worksheet data with table data
  tableData.forEach((rowData, index) => {
    const row = [
      index + 1,
      rowData.MatriculeEtd,
      rowData.nom,
      rowData.prenom,
      ...dates.map((date) =>
        isPresent[date]?.some(
          (item) => item.MatriculeEtd === rowData.MatriculeEtd
        )
          ? "Present"
          : "Absent"
      ),
    ];
    wsData.push(row);
  });

  // Convert worksheet data to worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(wsData);

  // Add worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "History Table");

  // Write the workbook to a file
  XLSX.writeFile(workbook, "historique_de_presence.xlsx");
}

function History() {
  const [Etds, setEtds] = useState([]);
  const [dates, setDates] = useState([]);
  const [isPresent, setIsPresent] = useState({});
  const [selectedPalier, setSelectedPalier] = useState("");
  const [selectedSpecialite, setSelectedSpecialite] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedModule, setSelectedModule] = useState(""); // State for selected module
  const [matricule, setMatricule] = useState("");
  const [specialites, setSpecialites] = useState([]);
  const [sections, setSections] = useState([]);
  const [modules, setModules] = useState([]); // State for modules

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
  const modulesBySpecialite = {
    "TRONC COMMUN": ["MATH", "PHYSIQUE", "CHIMIE", "INFO", "TIC", "ANGLAIS"],
    ACAD: ["PWEB", "TP PWEB", "A/C SERV", "TP A/C SERV", "DOC STR", "TEST"],
    ISIL: ["PWEB", "TP PWEB", "A/C SERV", "TP A/C SERV", "DOC STR"],
    RSd: ["A"],
    IL: ["A"],
    SII: ["A"],
    BIGDATAA: ["A"],
    MIND: ["A"],
    IV: ["ANG2", "FD", "AD", "VA", "RES", "CGOC", "CJRV", "AA"],
    BIOINFO: ["A"],
    HPC: ["A"],
  };

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
    setModules(modulesBySpecialite[specialite] || []); // Set modules based on selected specialite
  };

  // Handle section change
  const handleSectionChange = (e) => {
    const section = e.target.value;
    setSelectedSection(section);
  };

  // Handle module change
  const handleModuleChange = (e) => {
    const module = e.target.value;
    setSelectedModule(module);
  };
  const handleSubmit = async () => {
    try {
      const etdsResponse = await axios.get(backendURL + "/historyEtds", {
        params: {
          palier: selectedPalier,
          specialite: selectedSpecialite,
          section: selectedSection,
          groupe: selectedGroup,
          matricule: matricule,
        },
      });
      setEtds(etdsResponse.data);

      const datesResponse = await axios.get(`${backendURL}/getDatesByCreneau`, {
        params: {
          palier: selectedPalier,
          specialite: selectedSpecialite,
          section: selectedSection,
          module: selectedModule,
          groupe: selectedGroup,
          matricule: matricule,
        },
      });

      // Inside the handleSubmit function after retrieving dateValues
      const dateValues = datesResponse.data.map((item) => item.date);
      // Parse the date strings into Date objects
      const sortedDates = dateValues.map((dateString) => new Date(dateString));

      /// Filter out invalid dates
      const validDates = sortedDates.filter((date) => !isNaN(date.getTime()));

      // Sort the valid dates
      validDates.sort((a, b) => a - b);

      // Format the sorted valid dates back to "dd-mm-yyyy" strings
      const sortedDateValues = validDates.map((date) => {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      });
      console.log(sortedDateValues);
      // Set the sorted dates
      setDates(sortedDateValues);

      // Fetch etudiants present for each date
      const presencePromises = sortedDateValues.map((date) =>
        axios.get(`${backendURL}/getHistoryPresent/${date}`, {
          params: {
            palier: selectedPalier,
            specialite: selectedSpecialite,
            section: selectedSection,
            module: selectedModule,
            groupe: selectedGroup,
            matricule: matricule,
          },
        })
      );

      const presenceData = await Promise.all(presencePromises);
      console.log(presenceData);
      const presenceByDate = presenceData.reduce((acc, cur, index) => {
        acc[sortedDateValues[index]] = cur.data;
        return acc;
      }, {});
      console.log(presenceByDate);
      setIsPresent(presenceByDate);
    } catch (error) {
      // Handle error
      console.error("Error:", error);
    }
  };
  const handleCheckboxChange = (MatriculeEtd, checked, date) => {
    const [day, month, year] = date.split("-").map(Number);
    const today = new Date(year, month - 1, day + 1);
    const updatedIsPresent = { ...isPresent };

    if (checked) {
      updatedIsPresent[date] = updatedIsPresent[date] || [];
      updatedIsPresent[date].push({ MatriculeEtd });
      axios
        .post(backendURL + "/postEtdsPresentFromHistory", {
          matricule: MatriculeEtd,
          date: today,
        })
        .then(() => {
          setIsPresent(updatedIsPresent);
          console.log(`Added ${MatriculeEtd} to the collection presence`);
        })
        .catch((err) => console.log(err));
    } else {
      updatedIsPresent[date] = updatedIsPresent[date].filter(
        (item) => item.MatriculeEtd !== MatriculeEtd
      );
      axios
        .delete(`${backendURL}/deleteEtdFromHistory/${MatriculeEtd}/${date}`)
        .then(() => {
          setIsPresent(updatedIsPresent);

          console.log(`Deleted ${MatriculeEtd} from the collection presence`);
        })
        .catch((err) => console.log(err));
    }
  };
  const handleExportToExcel = () => {
    // Call the exportToExcel function passing the necessary data
    exportToExcel(Etds, dates, isPresent);
  };
  return (
    <div className="container vh-100">
      <div className="container-fluid text-center">
        <div className="row">
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
              aria-label="Module"
              value={selectedModule}
              onChange={handleModuleChange}
              disabled={!selectedSpecialite}
            >
              <option value="">Module</option>
              {modules.map((module) => (
                <option key={module} value={module}>
                  {module}
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
        </div>
        <div className="row mt-3">
          <div className="col">
            <button
              type="button"
              className="btn btn-secondary m-3 "
              onClick={handleSubmit}
            >
              Rechercher
            </button>
            <button
              type="button"
              className="btn btn-secondary m-3"
              onClick={handleExportToExcel}
            >
              Exporter vers Excel
            </button>
          </div>
        </div>
      </div>
      <br />
      <div className="table-responsive">
        {" "}
        <div className="table-responsive">
          {Etds.length > 0 ? (
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Matricule</th>
                  <th>Nom</th>
                  <th>Prenom</th>
                  {dates.map((date, index) => (
                    <th key={index}>{date}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Etds.map((Etd, index) => (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{Etd.MatriculeEtd}</td>
                    <td>{Etd.nom}</td>
                    <td>{Etd.prenom}</td>
                    {dates.map((date, dateIndex) => (
                      <td key={dateIndex} className="text-center">
                        <input
                          type="checkbox"
                          aria-label="Checkbox for following text input"
                          checked={
                            isPresent[date] &&
                            isPresent[date].some(
                              (item) => item.MatriculeEtd === Etd.MatriculeEtd
                            )
                          }
                          onChange={(e) =>
                            handleCheckboxChange(
                              Etd.MatriculeEtd,
                              e.target.checked,
                              dates[dateIndex]
                            )
                          }
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Matricule</th>
                  <th>Nom</th>
                  <th>Prenom</th>
                  {dates.map((date, index) => (
                    <th key={index}>{date}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">1</th>
                  <td>{Etds.MatriculeEtd}</td>
                  <td>{Etds.nom}</td>
                  <td>{Etds.prenom}</td>
                  {dates.map((date, dateIndex) => (
                    <td key={dateIndex} className="text-center">
                      <input
                        type="checkbox"
                        aria-label="Checkbox for following text input"
                        checked={
                          isPresent[date] &&
                          isPresent[date].some(
                            (item) => item.MatriculeEtd === Etds.MatriculeEtd
                          )
                        }
                        onChange={(e) =>
                          handleCheckboxChange(
                            Etds.MatriculeEtd,
                            e.target.checked,
                            dates[dateIndex]
                          )
                        }
                      />
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default History;
