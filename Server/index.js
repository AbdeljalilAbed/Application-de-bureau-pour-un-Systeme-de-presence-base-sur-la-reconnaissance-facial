const express = require("express");
const cors = require("cors");

const multer = require("multer");
const xlsx = require("xlsx");
//const process = require("process");

const fs = require("fs");
const path = require("path");

const { spawn } = require("child_process");
require("dotenv").config();

const getIdCreneau = require("./utils");

const app = express();
app.use(cors());
app.use(express.json());

// Define the path to the JSON files
const enseignementsFilePath = path.join(
  __dirname,
  "mydb/mydb.enseignements.json"
);
const etudiantsFilePath = path.join(__dirname, "mydb/mydb.etudiants.json");
const embeddingsFilePath = path.join(__dirname, "mydb/mydb.embeddings.json");
const presencesFilePath = path.join(__dirname, "mydb/mydb.presences.json");

function convertToDoubleBackslashes(filePath) {
  return filePath.replace(/\\/g, "\\\\");
}

// Read data from JSON file
const readDataFromFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading data from file:", error);
    return [];
  }
};
// Write data to JSON file
const writeDataToFile = (dataFilePath, data) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf-8");
    console.log("Data written to file successfully.");
  } catch (error) {
    console.error("Error writing data to file:", error);
  }
};

const upload = multer({ dest: "uploads/" });

app.get("/", (req, res) => {
  res.send("Welcome to my API");
});

const imageUploadPath = path.join(__dirname, "archive");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imageUploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const imageUpload = multer({ storage: storage });

app.post("/images-upload", imageUpload.array("images"), (req, res) => {
  let SCRIPT_PATH = convertToDoubleBackslashes(
    path.join(__dirname, "arrayFromImages2.py")
  );
  let IMAGES_PATH = convertToDoubleBackslashes(imageUploadPath);
  let EMBEDDINGS_JSON_PATH = convertToDoubleBackslashes(
    path.join(__dirname, "mydb/mydb.embeddings.json")
  );
  let ETUDIANTS_JSON_PATH = convertToDoubleBackslashes(
    path.join(__dirname, "mydb/mydb.etudiants.json")
  );
  let DETECTION_MODEL_PATH = convertToDoubleBackslashes(
    path.join(__dirname, "modelsR/face_detection_yunet_2023mar.onnx")
  );
  let RECOGNITION_MODEL_PATH = convertToDoubleBackslashes(
    path.join(__dirname, "modelsR/face_recognition_sface_2021dec.onnx")
  );
  var dataToSend;
  // spawn new child process to call the python script
  const python = spawn("python", [
    SCRIPT_PATH,
    IMAGES_PATH,
    EMBEDDINGS_JSON_PATH,
    ETUDIANTS_JSON_PATH,
    DETECTION_MODEL_PATH,
    RECOGNITION_MODEL_PATH,
  ]);
  // collect data from script
  python.stdout.on("data", function (data) {
    console.log("Pipe data from python script ...");
    dataToSend = data.toString();
  });
  // in close event we are sure that stream from child process is closed
  python.stderr.on("data", function (data) {
    console.error("Error from Python script:", data.toString());
  });
  // in close event we are sure that stream from child process is closed
  python.on("close", (code) => {
    console.log(`child process close all stdio with code ${code}`);
    // send data to browser
    console.log(dataToSend);
    res.send(dataToSend);
  });
});

// Endpoint to get default list of etudiants
app.get("/getEtds", async (req, res) => {
  const IdCreneau = getIdCreneau();

  const enseignementsData = readDataFromFile(enseignementsFilePath);

  const enseignements = enseignementsData.find(
    (enseignement) => enseignement.IdCreneau === IdCreneau
  );

  let etudiants = [];
  try {
    const etudiantsData = readDataFromFile(etudiantsFilePath);

    if (enseignements) {
      if (enseignements.groupe !== "") {
        etudiants = etudiantsData.filter(
          (etudiant) =>
            etudiant.palier === enseignements.palier &&
            etudiant.specialite === enseignements.specialite &&
            etudiant.section === enseignements.section &&
            etudiant.groupe === enseignements.groupe
        );
      } else {
        etudiants = etudiantsData.filter(
          (etudiant) =>
            etudiant.palier === enseignements.palier &&
            etudiant.specialite === enseignements.specialite &&
            etudiant.section === enseignements.section
        );
      }
    }
    res.json(etudiants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.get("/getEtudiants", async (req, res) => {
  const { palier, specialite, section, groupe, matricule } = req.query;

  let etudiants = null;
  try {
    const etudiantsData = readDataFromFile(etudiantsFilePath);

    if (matricule) {
      etudiants = etudiantsData.find(
        (etudiant) => etudiant.MatriculeEtd === matricule
      );
    } else if (groupe !== undefined && groupe !== null && groupe !== "") {
      etudiants = etudiantsData.filter(
        (etudiant) =>
          etudiant.palier === palier &&
          etudiant.specialite === specialite &&
          etudiant.section === section &&
          etudiant.groupe === groupe
      );
    } else {
      etudiants = etudiantsData.filter(
        (etudiant) =>
          etudiant.palier === palier &&
          etudiant.specialite === specialite &&
          etudiant.section === section
      );
    }

    res.json(etudiants);
  } catch (error) {
    console.error("Error retrieving etudiants:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.get("/getEmploiDuTemps", async (req, res) => {
  const { palier, specialite, section, groupe } = req.query;

  let enseignements = null;
  try {
    const enseignementsData = readDataFromFile(enseignementsFilePath);

    if (groupe !== undefined && groupe !== null && groupe !== "") {
      enseignements = enseignementsData.filter(
        (enseignement) =>
          enseignement.palier === palier &&
          enseignement.specialite === specialite &&
          enseignement.section === section &&
          enseignement.groupe === groupe
      );
    } else {
      enseignements = enseignementsData.filter(
        (enseignement) =>
          enseignement.palier === palier &&
          enseignement.specialite === specialite &&
          enseignement.section === section
      );
    }

    res.json(enseignements);
  } catch (error) {
    console.error("Error retrieving enseignements:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.get("/getEtdsPresent", async (req, res) => {
  const today = new Date();
  today.setHours(1, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  tomorrow.setHours(1, 0, 0, 0);

  const currentCreneau = getIdCreneau();
  const number = parseInt(currentCreneau, 10);

  try {
    // Read data from the "presences" JSON file
    const presences = readDataFromFile(presencesFilePath);

    // Filter presences for the current creneau and date range
    const filteredPresences = presences.filter((presence) => {
      const presenceDate = new Date(presence.date.$date);

      return (
        presence.creneau === number &&
        presenceDate >= today &&
        presenceDate < tomorrow
      );
    });
    // Read data from the "etudiants" JSON file
    const etudiants = readDataFromFile(etudiantsFilePath);

    // Map presence data with student details
    const result = filteredPresences.map((presence) => {
      const etudiant = etudiants.find(
        (etudiant) => etudiant.MatriculeEtd === presence.matricule
      );
      return {
        MatriculeEtd: presence.matricule,
        nom: etudiant ? etudiant.nom : "Unknown",
        prenom: etudiant ? etudiant.prenom : "Unknown",
      };
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});
//ADD PRESENCE OF AN ETUDIANT
app.post("/postEtdsPresent", (req, res) => {
  const data = req.body;
  const currentDate = new Date();
  const currentCreneau = getIdCreneau();
  const number = parseInt(currentCreneau, 10);

  // Create a new presence object with the required structure
  const newPresence = {
    _id: {
      $oid: Math.random().toString(36).substring(2, 10), // Generate a random ObjectId
    },
    matricule: data.matricule.toString(), // Ensure matricule is string
    date: {
      $date: currentDate.toISOString(), // Convert date to ISO string format
    },
    creneau: number,
    __v: 0,
  };

  try {
    // Read existing data from file
    const existingData = readDataFromFile(presencesFilePath);
    // Add new presence data
    existingData.push(newPresence);
    // Write updated data to file
    writeDataToFile(presencesFilePath, existingData);
    res.status(201).send("Student data added successfully");
  } catch (error) {
    res.status(500).send(`Error adding student data: ${error.message}`);
  }
});
//ADD PRESENCE OF AN ETUDIANT
app.post("/postEtdsPresentPython", (req, res) => {
  const data = req.body;
  const currentDate = new Date();
  const currentCreneau = getIdCreneau();
  const number = parseInt(currentCreneau, 10);

  // Get the date in "yyyy-mm-dd" format
  const currentDateOnly = currentDate.toISOString().split("T")[0];

  // Create a new presence object with the required structure
  const newPresence = {
    _id: {
      $oid: Math.random().toString(36).substring(2, 10), // Generate a random ObjectId
    },
    matricule: data.matricule.toString(), // Ensure matricule is string
    date: {
      $date: currentDate.toISOString(), // Keep the date in ISO string format
    },
    creneau: number,
    __v: 0,
  };

  try {
    // Read existing data from file
    const existingData = readDataFromFile(presencesFilePath);

    // Check if the new presence already exists
    const isDuplicate = existingData.some(
      (presence) =>
        presence.matricule === newPresence.matricule &&
        presence.creneau === newPresence.creneau &&
        presence.date.$date.split("T")[0] === currentDateOnly
    );

    if (isDuplicate) {
      return res.status(400).send("Duplicate presence data");
    }

    // Add new presence data
    existingData.push(newPresence);

    // Write updated data to file
    writeDataToFile(presencesFilePath, existingData);

    res.status(201).send("Student data added successfully");
  } catch (error) {
    res.status(500).send(`Error adding student data: ${error.message}`);
  }
});

//DELETE PRESENCE OF AN ETUDIANT
app.delete("/deleteEtd/:matricule", (req, res) => {
  const { matricule } = req.params;
  const today = new Date();
  today.setHours(1, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  tomorrow.setHours(1, 0, 0, 0);

  try {
    // Read existing data from file
    let existingData = readDataFromFile(presencesFilePath);
    // Filter out presence data for the specified matricule and date range
    existingData = existingData.filter((presence) => {
      const presenceDate = new Date(presence.date.$date);
      return (
        presence.matricule !== matricule ||
        presenceDate < today ||
        presenceDate >= tomorrow
      );
    });
    // Write updated data to file
    writeDataToFile(presencesFilePath, existingData);
    res.status(204).send();
  } catch (error) {
    res.status(500).send(`Error deleting student data: ${error.message}`);
  }
});

//GET LIST ETUDIANTS FOR HISTORY OF ATTENDANCE
app.get("/historyEtds", async (req, res) => {
  const { palier, specialite, section, groupe, matricule } = req.query;

  let etudiants = null;
  try {
    const etudiantsData = readDataFromFile(etudiantsFilePath);

    if (matricule) {
      etudiants = etudiantsData.find(
        (etudiant) => etudiant.MatriculeEtd === matricule
      );
    } else if (groupe !== undefined && groupe !== null && groupe !== "") {
      etudiants = etudiantsData.filter(
        (etudiant) =>
          etudiant.palier === palier &&
          etudiant.specialite === specialite &&
          etudiant.section === section &&
          etudiant.groupe === groupe
      );
    } else {
      etudiants = etudiantsData.filter(
        (etudiant) =>
          etudiant.palier === palier &&
          etudiant.specialite === specialite &&
          etudiant.section === section
      );
    }

    res.json(etudiants);
  } catch (error) {
    console.error("Error retrieving etudiants:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//GET DATES OF ATTENDANCES
app.get("/getDatesByCreneau", async (req, res) => {
  const { palier, specialite, section, module } = req.query;

  try {
    // Read enseigne data from JSON file
    const enseigneData = readDataFromFile(enseignementsFilePath);

    const creneau = enseigneData.filter(
      (entry) =>
        entry.section === section &&
        entry.module === module &&
        entry.palier === palier &&
        entry.specialite === specialite
    );
    if (!creneau.length) {
      return res.status(404).json({ message: "Creneau not found" });
    }

    const currentCreneau = creneau[0].IdCreneau;
    const number = parseInt(currentCreneau, 10);

    // Read presences data from JSON file
    const presencesData = readDataFromFile(presencesFilePath);

    // Initialize a Set to store unique date strings
    const uniqueDates = new Set();

    // Filter and add unique dates to the Set
    presencesData
      .filter((presence) => presence.creneau === number)
      .forEach((presence) => {
        // Extract the date part from the presence.date string
        const dateString = presence.date["$date"].split("T")[0];
        uniqueDates.add(dateString);
      });

    // Convert the Set to an array and map it to the desired format
    const dates = Array.from(uniqueDates).map((dateString) => ({
      date: dateString,
    }));

    res.json(dates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

//GET HISTORY OF ATTENDANCE BY DATES
app.get("/getHistoryPresent/:date", (req, res) => {
  const { date } = req.params;
  const { palier, specialite, section, module } = req.query;

  try {
    // Read data from JSON files using the readDataFromFile function
    const enseignements = readDataFromFile(enseignementsFilePath);
    const presences = readDataFromFile(presencesFilePath);

    const creneau = enseignements.filter((en) => {
      return (
        en.section === section &&
        en.module === module &&
        en.palier === palier &&
        en.specialite === specialite
      );
    });

    const currentCreneau = creneau[0].IdCreneau;
    // eslint-disable-next-line no-unused-vars
    const number = parseInt(currentCreneau, 10);

    const formattedDates = presences.map((presence) => {
      // Extract the date string from the presence object
      const dateString = presence.date["$date"];
      // Reformat the date string to match the format from req.params
      const formattedDate = dateString
        .split("T")[0]
        .split("-")
        .reverse()
        .join("-");
      return { ...presence, formattedDate };
    });

    const etudiantsData = readDataFromFile(etudiantsFilePath);

    const result = formattedDates
      .filter((presence) => presence.formattedDate === date)
      .map((presence) => {
        // Find the etudiant object with matching matriculeEtd
        const etudiant = etudiantsData.find(
          (etudiant) => etudiant.matricule === presence.MatriculeEtd
        );

        // If etudiant is found, extract nom and prenom, otherwise set them to "Unknown"
        const nom = etudiant ? etudiant.nom : "Unknown";
        const prenom = etudiant ? etudiant.prenom : "Unknown";

        return {
          MatriculeEtd: presence.matricule,
          nom: nom,
          prenom: prenom,
        };
      });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.post("/postEtdsPresentFromHistory", (req, res) => {
  const data = req.body;
  console.log(data);
  const currentCreneau = getIdCreneau();
  const number = parseInt(currentCreneau, 10);

  try {
    // Read data from the presences JSON file
    const presencesData = readDataFromFile(presencesFilePath);

    // Add necessary fields to the data
    const newData = {
      _id: {
        $oid: Math.random().toString(36).substring(2, 10), // Generate a random _id
      },
      matricule: data.matricule,
      date: { $date: new Date(data.date).toISOString() },
      creneau: number,
      __v: 0,
    };

    // Append the new data to the existing presences data
    presencesData.push(newData);

    // Write the updated data back to the presences file
    writeDataToFile(presencesFilePath, presencesData);

    res.status(201).send("Student data added successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send(`Error adding student data: ${err.message}`);
  }
});

app.delete("/deleteEtdFromHistory/:matricule/:date", (req, res) => {
  const { matricule, date } = req.params;
  console.log(date);

  const [day, month, year] = date.split("-").map(Number);
  const today = new Date(year, month - 1, day);
  today.setHours(1, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  tomorrow.setHours(1, 0, 0, 0);
  console.log(today, tomorrow);

  try {
    // Read data from the JSON file
    let presencesData = readDataFromFile(presencesFilePath);

    // Filter out the data that matches the matricule and falls within the specified date range
    const filteredData = presencesData.filter((item) => {
      const itemDate = new Date(item.date.$date);
      return (
        item.matricule === matricule && itemDate >= today && itemDate < tomorrow
      );
    });

    // Delete the filtered data from the original data
    presencesData = presencesData.filter(
      (item) => !filteredData.includes(item)
    );

    // Write the updated data back to the JSON file
    writeDataToFile(presencesFilePath, presencesData);

    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).send(`Error deleting student data: ${err.message}`);
  }
});

// Route for uploading Excel file
app.post("/uploadEtudiants", upload.single("file"), (req, res) => {
  // Parse the Excel file
  const workbook = xlsx.readFile(req.file.path);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet);

  // Map Excel columns to JSON fields
  const fieldMap = {
    palier: "palier",
    specialite: "specialite",
    section: "section",
    matricule: "MatriculeEtd",
    nom: "nom",
    prenom: "prenom",
    etat: "etat",
    groupe: "groupe",
  };

  const mappedData = data.map((row) => {
    const mappedRow = {};
    for (const [excelField, jsonField] of Object.entries(fieldMap)) {
      // Convert "groupe" to string
      if (jsonField === "groupe" && typeof row[excelField] === "number") {
        mappedRow[jsonField] = row[excelField].toString();
      } else {
        mappedRow[jsonField] = row[excelField];
      }
    }
    return mappedRow;
  });

  try {
    // Read existing data from file
    const existingData = readDataFromFile(etudiantsFilePath);
    // Combine existing data with newly uploaded data
    const newData = [...existingData, ...mappedData];
    // Write combined data to file
    writeDataToFile(etudiantsFilePath, newData);
    res.send("Data inserted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to insert data into JSON file");
  }
});

// Add student endpoint
app.post("/addEtd", (req, res) => {
  try {
    const {
      palier,
      specialite,
      section,
      MatriculeEtd,
      nom,
      prenom,
      etat,
      groupe,
    } = req.body;

    const etudiants = readDataFromFile(etudiantsFilePath);

    // Check if MatriculeEtd is already in use
    const isMatriculeEtdUnique = !etudiants.some(
      (etd) => etd.MatriculeEtd === MatriculeEtd
    );

    if (!isMatriculeEtdUnique) {
      return res.status(400).json({ message: "MatriculeEtd already exists" });
    }

    // Create new student object
    const newEtd = {
      palier,
      specialite,
      section,
      MatriculeEtd,
      nom,
      prenom,
      etat,
      groupe,
    };

    // Add new student to existing students
    etudiants.push(newEtd);

    // Save updated students to file
    writeDataToFile(etudiantsFilePath, etudiants);

    res.status(201).json({ message: "Etudiant added successfully" });
  } catch (error) {
    console.error("Error adding etudiant:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Remove student endpoint
app.delete("/removeEtd/:MatriculeEtd", (req, res) => {
  try {
    const { MatriculeEtd } = req.params;
    let etudiants = readDataFromFile(etudiantsFilePath);

    // Find index of student to remove
    const indexToRemove = etudiants.findIndex(
      (etudiant) => etudiant.MatriculeEtd === MatriculeEtd
    );

    // If student found, remove it
    if (indexToRemove !== -1) {
      etudiants.splice(indexToRemove, 1);
      // Save updated students to file
      writeDataToFile(etudiantsFilePath, etudiants);
      res.status(200).json({ message: "Etudiant removed successfully" });
    } else {
      res.status(404).json({ message: "Etudiant not found" });
    }
  } catch (error) {
    console.error("Error removing etudiant:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Remove student endpoint
app.delete("/removeImages/:MatriculeEtd", (req, res) => {
  try {
    const { MatriculeEtd } = req.params;
    let embeddings = readDataFromFile(embeddingsFilePath);

    // Find index of student to remove
    const indexToRemove = embeddings.findIndex(
      (embedding) => embedding.MatriculeEtd === MatriculeEtd
    );

    // If student found, remove it
    if (indexToRemove !== -1) {
      embeddings.splice(indexToRemove, 1);
      // Save updated students to file
      writeDataToFile(embeddingsFilePath, embeddings);
      res.status(200).json({ message: "embedding removed successfully" });
    } else {
      res.status(404).json({ message: "embedding not found" });
    }
  } catch (error) {
    console.error("Error removing embedding:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.put("/modifierEtudiant/:MatriculeEtd", async (req, res) => {
  try {
    const { MatriculeEtd } = req.params;
    const updateData = req.body;

    let etudiants = readDataFromFile(etudiantsFilePath);

    const etudiantIndex = etudiants.findIndex(
      (etd) => etd.MatriculeEtd === MatriculeEtd
    );

    if (etudiantIndex === -1) {
      return res.status(404).json({ error: "Etudiant not found" });
    }

    // Update the etudiant data
    etudiants[etudiantIndex] = { ...etudiants[etudiantIndex], ...updateData };

    // Write the updated list back to the JSON file
    writeDataToFile(etudiantsFilePath, etudiants);

    res.status(200).json({
      message: "Etudiant updated successfully",
      updatedEtudiant: etudiants[etudiantIndex],
    });
  } catch (error) {
    console.error("Error updating etudiant:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Endpoint to remove emploi du temps
app.delete("/removeEdt/:palier/:specialite/:section", async (req, res) => {
  try {
    const { palier, specialite, section } = req.params;

    // Read existing emploi du temps from file
    let emploiDuTemps = readDataFromFile(enseignementsFilePath);

    // Filter emploi du temps based on parameters
    emploiDuTemps = emploiDuTemps.filter(
      (edt) =>
        edt.palier !== palier ||
        edt.specialite !== specialite ||
        edt.section !== section
    );

    // Write updated emploi du temps to file
    writeDataToFile(enseignementsFilePath, emploiDuTemps);

    res.status(200).json({ message: "Emploi du temps removed successfully" });
  } catch (error) {
    console.error("Error removing emploi du temps:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.post("/edt-upload", upload.single("file"), (req, res) => {
  const palier = req.body.palier;
  const specialite = req.body.specialite;
  const section = req.body.section;

  let SCRIPT_PATH = convertToDoubleBackslashes(
    path.join(__dirname, "ExcelToEdt2.py")
  );

  var dataToSend;

  console.log(req.file.path);

  // Spawn a new child process to call the Python script
  const python = spawn("python", [
    SCRIPT_PATH,
    req.file.path,
    section,
    palier,
    specialite,
  ]);

  // Collect data from script
  python.stdout.on("data", function (data) {
    console.log("Pipe data from python script ...");
    dataToSend = data.toString();
  });

  // In close event we are sure that stream from child process is closed
  python.on("close", (code) => {
    console.log(`Child process close all stdio with code ${code}`);
    // Send data to browser
    res.send(dataToSend);
  });
});

// Endpoint to add emploi du temps
app.post("/addEdt", async (req, res) => {
  try {
    const { palier, specialite, section, salle, module, IdCreneau, groupe } =
      req.body;

    // Read existing emploi du temps from file
    let emploiDuTemps = readDataFromFile(enseignementsFilePath);

    // Check if IdCreneau is already in use
    const isIdCreneauUnique = !emploiDuTemps.some(
      (emploi) => emploi.IdCreneau === IdCreneau
    );

    if (!isIdCreneauUnique) {
      return res.status(400).json({ message: "IdCreneau already exists" });
    }

    // Create new emploi du temps object
    const newEnseigne = {
      palier,
      specialite,
      section,
      salle,
      module,
      IdCreneau,
      groupe,
    };

    // Add new emploi du temps to existing data
    emploiDuTemps.push(newEnseigne);

    // Write updated emploi du temps to file
    writeDataToFile(enseignementsFilePath, emploiDuTemps);

    res.status(201).json({ message: "Edt added successfully" });
  } catch (error) {
    console.error("Error adding emploi du temps:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Remove student endpoint
app.delete("/removeCreneau/:IdCreneau", (req, res) => {
  try {
    const { IdCreneau } = req.params;
    let enseignements = readDataFromFile(enseignementsFilePath);

    // Find index of student to remove
    const indexToRemove = enseignements.findIndex(
      (enseignement) => enseignement.IdCreneau === IdCreneau
    );

    // If student found, remove it
    if (indexToRemove !== -1) {
      enseignements.splice(indexToRemove, 1);
      // Save updated students to file
      writeDataToFile(enseignementsFilePath, enseignements);
      res.status(200).json({ message: "enseignement removed successfully" });
    } else {
      res.status(404).json({ message: "enseignement not found" });
    }
  } catch (error) {
    console.error("Error removing enseignement:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.put("/modifierEdt/:IdCreneau", async (req, res) => {
  const { IdCreneau } = req.params;
  const updateData = req.body;

  try {
    // Read the enseignements data from the file
    let enseignements = readDataFromFile(enseignementsFilePath);

    // Find the enseignement with the given IdCreneau
    const enseignementToUpdate = enseignements.find(
      (enseignement) => enseignement.IdCreneau === IdCreneau
    );

    if (enseignementToUpdate) {
      // Update the enseignement with the new data
      Object.assign(enseignementToUpdate, updateData);

      // Write the updated enseignements data back to the file
      writeDataToFile(enseignementsFilePath, enseignements);

      res.status(200).json({
        message: "Edt updated successfully",
        updatedEdt: enseignementToUpdate,
      });
    } else {
      res.status(404).json({ error: "Edt not found" });
    }
  } catch (error) {
    console.error("Error updating Edt:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Endpoint to get embeddings
app.get("/getEmbeddings/:IdCreneau/:MatriculeProf", (req, res) => {
  const { IdCreneau, MatriculeProf } = req.params;
  if (IdCreneau === "all" && MatriculeProf === "all") {
    const embeddings = readDataFromFile(embeddingsFilePath);
    const result = embeddings.reduce((acc, cur) => {
      acc[cur.MatriculeEtd] = cur.embedding;
      return acc;
    }, {});
    res.json(result);
  }
});
app.delete("/deleteEmbedding/:MatriculeEtd", async (req, res) => {
  const { MatriculeEtd } = req.params;

  try {
    // Read the embeddings data from the file
    let embeddings = readDataFromFile(embeddingsFilePath);

    // Find the index of the embedding to delete
    const embeddingIndex = embeddings.findIndex(
      (embedding) => embedding.MatriculeEtd === MatriculeEtd
    );

    if (embeddingIndex !== -1) {
      // Remove the embedding from the array
      embeddings.splice(embeddingIndex, 1);

      // Write the updated embeddings data back to the file
      writeDataToFile(embeddingsFilePath, embeddings);

      res.status(200).json({ message: "Embedding deleted successfully" });
    } else {
      res.status(404).json({ message: "Embedding not found" });
    }
  } catch (error) {
    console.error("Error deleting embedding:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.listen(8742, () => {
  console.log("Server is running");
});
