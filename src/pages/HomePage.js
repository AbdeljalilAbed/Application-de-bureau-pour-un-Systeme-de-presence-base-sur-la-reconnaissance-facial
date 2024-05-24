import * as React from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Link } from "react-router-dom";
import UsthbImage from "../images/usthb.png"; // Import the image
import Image from "../images/img.jpg"; // Import the image

function HomePage() {
  return (
    <>
      <div className="container-fluid">
        <div className="d-flex flex-column mb-3">
          <div className="p-2">
            <div className="d-flex justify-content-start">
              <img loading="lazy" src={UsthbImage} className="img" alt="" />
            </div>
          </div>
        </div>
        <div class="container mt-5">
          <div class="row">
            <div class="col-md pt-5">
              <div class="row m-2">
                <div class="col-sm">
                  <h1>Système de présence par reconnaissance faciale</h1>
                </div>
              </div>
              <div class="row m-2">
                <div class="col-sm">
                  <p>
                    Bienvenue dans le Système de Gestion des Présences par
                    Reconnaissance Faciale Intelligente de notre faculté
                    d'informatique ! Notre solution de pointe révolutionne la
                    gestion des présences dans notre faculté d'informatique.
                    Grâce à une technologie de reconnaissance faciale avancée,
                    la prise de présence est désormais facile et précise.
                  </p>
                </div>
              </div>
              <div class="row m-2">
                <div class="col">
                  <Link to="/Prof">
                    <button type="button" class="btn btn-dark btn-lg ">
                      Gestion des présences
                    </button>
                  </Link>
                </div>
                <div class="col">
                  <Link to="/Admin">
                    <button type="button" class="btn btn-dark btn-lg">
                      Gestion du Système
                    </button>
                  </Link>
                </div>
              </div>
            </div>
            <div class="col-md">
              <div class="text-center">
                <img src={Image} class="img-fluid" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default HomePage;
