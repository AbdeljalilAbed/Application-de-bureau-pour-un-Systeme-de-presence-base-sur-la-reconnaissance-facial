import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendURL } from "../config";

function Table() {
  const [Etds, setEtds] = useState([]);
  const [isPresent, setIsPresent] = useState({});

  // Fetch data when the component mounts
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch data function
  const fetchData = async () => {
    try {
      const etdsResponse = await axios.get(backendURL + "/getEtds", {
        params: {},
      });
      const etdsData = etdsResponse.data;
      setEtds(etdsResponse.data);
      const aggregatedResponse = await axios.get(
        backendURL + "/getEtdsPresent"
      );
      const matriculesInAggregatedData = aggregatedResponse.data.map(
        (item) => item.MatriculeEtd
      );

      const defaultPresentStatus = etdsData.reduce((acc, cur) => {
        acc[cur.MatriculeEtd] = matriculesInAggregatedData.includes(
          cur.MatriculeEtd
        );
        return acc;
      }, {});
      setIsPresent(defaultPresentStatus);
    } catch (error) {
      // Handle error
      console.error("Error:", error);
    }
  };

  const handleCheckboxChange = (MatriculeEtd, checked) => {
    if (checked) {
      axios
        .post(backendURL + "/postEtdsPresent", {
          matricule: MatriculeEtd,
        })
        .then(() => {
          setIsPresent((prevState) => ({
            ...prevState,
            [MatriculeEtd]: true,
          }));
          console.log(`Added ${MatriculeEtd} to the collection presence`);
        })
        .catch((err) => console.log(err));
    } else {
      axios
        .delete(`${backendURL}/deleteEtd/${MatriculeEtd}`)
        .then(() => {
          setIsPresent((prevState) => ({
            ...prevState,
            [MatriculeEtd]: false,
          }));
          console.log(`Deleted ${MatriculeEtd} from the collection presence`);
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="container">
      <div className="container-fluid text-center ">
        <div className="row mt-3">
          <div className="col">
            <button
              type="button"
              className="btn btn-secondary "
              onClick={fetchData} // Fetch data again to update the table
            >
              Actualiser la presence
            </button>
          </div>
        </div>
      </div>
      <br />
      <div className="table-responsive">
        {Etds.length > 0 ? (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>#</th>
                <th>Matricule</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Présence</th>
              </tr>
            </thead>
            <tbody>
              {Etds.map((Etd, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{Etd.MatriculeEtd}</td>
                  <td>{Etd.nom}</td>
                  <td>{Etd.prenom}</td>
                  <td>
                    <input
                      type="checkbox"
                      aria-label="Checkbox for following text input"
                      checked={isPresent[Etd.MatriculeEtd] || false}
                      onChange={(e) =>
                        handleCheckboxChange(Etd.MatriculeEtd, e.target.checked)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center">Aucune présence à afficher</p>
        )}
      </div>
    </div>
  );
}

export default Table;
