/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";

import "./Admin.css";
import GestionEtudiants from "../components/GestionEtudiants";
import GestionEdt from "../components/GestionEdt";

function Admin() {
  const [column1Component, setColumn1Component] = useState(null);
  useEffect(() => {
    // Call handleGestionProfsClick to render components in the "Gestion de Prof" tab by default
    handleGestionEtudiantClick();
  }, []); // Empty dependency array ensures this effect runs only once after initial render

  const handleGestionEtudiantClick = () => {
    setColumn1Component(<GestionEtudiants />);
  };

  const handleGestionEdtClick = () => {
    setColumn1Component(<GestionEdt />);
  };

  return (
    <div className="container-fluid vh-100 bg">
      <br></br>
      <div className="container p-3 bg-body rounded ">
        <div className="row">
          <div className="col-4">
            <ul className="nav">
              <li className="nav-item mt-1">
                <Link to="/">
                  <button class="btn btn-outline-dark" type="button">
                    Retourner
                  </button>
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-8">
            <ul className="nav justify-content-end nav-underline">
              <li className="nav-item">
                <NavLink
                  className="nav-link text-dark"
                  to="#"
                  onClick={handleGestionEtudiantClick}
                >
                  Gestion des Etudiants
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link text-dark"
                  to="#"
                  aria-current="page"
                  onClick={handleGestionEdtClick}
                >
                  Gestion des Emploi du temps
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {column1Component}
    </div>
  );
}

export default Admin;
