import React from "react";
import { Link } from "react-router-dom";

import Table from "../components/Table";
import History from "../components/History";
import "./Prof.css";
import "bootstrap/dist/css/bootstrap.css";

function Prof() {
  return (
    <div className="div">
      <nav class="navbar navbar-light bg-light">
        <form class="container-fluid justify-content-between">
          <Link to="/Admin">
            <button class="btn btn-secondary" type="button">
              Gestion Du Système
            </button>
          </Link>
        </form>
      </nav>
      <div className="div-1">
        <div className="div-2">
          <div className="div-3">Aperçus en classe</div>
          <div className="div-4">Présence du jour en un coup d'œil.</div>
        </div>
      </div>
      <br />
      <Table />
      <br />
      <div className="div-1">
        <div className="div-2">
          <div className="div-3">Vue d'ensemble de la présence</div>
          <div className="div-4">Historique de presence </div>
        </div>
      </div>
      <br />
      <History />
    </div>
  );
}

export default Prof;
