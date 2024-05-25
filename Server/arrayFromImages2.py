import os
import cv2
import json
import sys
import getopt

def read_data_from_json(file_path):
    with open(file_path, 'r') as json_file:
        return json.load(json_file)

def write_data_to_json(file_path, data):
    with open(file_path, 'w') as json_file:
        json.dump(data, json_file)

def empty_directory(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            file_path = os.path.join(root, file)
            os.remove(file_path)
            print(f"Deleted: {file_path}")

def debug_log(message):
    print("[DEBUG] ", message)

if __name__ == "__main__":
    debug_log("Starting script execution")

    try:
        IMAGES_PATH = sys.argv[1]
        EMBEDDINGS_JSON_PATH = sys.argv[2]
        ETUDIANTS_JSON_PATH = sys.argv[3]
        FACE_DETECTOR = sys.argv[4]
        FACE_RECOGNIZER = sys.argv[5]
    except IndexError:
        debug_log("Error: Please provide the path to the images directory and the MongoDB URL as command-line arguments.")
        sys.exit(1)

    debug_log(f"Images path: {IMAGES_PATH}")
    debug_log(f"Embeddings JSON path: {EMBEDDINGS_JSON_PATH}")
    debug_log(f"Etudiants JSON path: {ETUDIANTS_JSON_PATH}")
    debug_log(f"Face detector model: {FACE_DETECTOR}")
    debug_log(f"Face recognizer model: {FACE_RECOGNIZER}")

    try:
        detector = cv2.FaceDetectorYN.create(
            model=FACE_DETECTOR,
            config="",
            input_size=[320, 320],
            score_threshold=0.65,
            nms_threshold=0.3,
            top_k=5000,
            backend_id=0,
            target_id=0)
        recognizer = cv2.FaceRecognizerSF.create(
            model=FACE_RECOGNIZER,
            config="",
            backend_id=0,
            target_id=0)
    except cv2.error as e:
        debug_log(f"Error: Failed to create face detector or recognizer. {e}")
        sys.exit(1)

    debug_log("Face detector and recognizer created successfully")


    images = [os.path.join(dossier, fichier) for dossier, sous_dossiers, fichiers in os.walk(IMAGES_PATH) for
              fichier in fichiers if fichier.endswith('.jpg') or fichier.endswith('.png') or
              fichier.endswith('.jpeg')]

    debug_log(f"Found {len(images)} image files")

    etudiants_data = read_data_from_json(ETUDIANTS_JSON_PATH)
    debug_log(f"Loaded etudiants data from {ETUDIANTS_JSON_PATH}{etudiants_data }")

    matricules_etudiants = [etudiant["MatriculeEtd"] for etudiant in etudiants_data]

    embeddings_data = read_data_from_json(EMBEDDINGS_JSON_PATH)
    existing_embeddings = embeddings_data if embeddings_data else []

    debug_log(f"Loaded existing embeddings data from {EMBEDDINGS_JSON_PATH}")

    for image in images:
        debug_log(f"Processing image: {image}")
        img = cv2.imread(image)
        detector.setInputSize([img.shape[1], img.shape[0]])
        faces = detector.detect(img)
        if len(faces) > 0:
            inputBlob = recognizer.alignCrop(img, faces[1][:-1])
            embedding = recognizer.feature(inputBlob)
            matricule = os.path.splitext(os.path.basename(image))[0]

            # Check if MatriculeEtd exists in etudiants collection
            if matricule not in matricules_etudiants:
                debug_log(f"Error: Matricule {matricule} not found in the etudiants collection.")
                continue

            # Check if embedding already exists
            if embedding.tolist() in [emb["embedding"] for emb in existing_embeddings]:
                debug_log("Error: Duplicate embedding.")
                continue

            # Append embedding to list
            existing_embeddings.append({"MatriculeEtd": matricule, "embedding": embedding.tolist()})

    debug_log("Embeddings processing complete")

    # Write embeddings to the output JSON file
    write_data_to_json(EMBEDDINGS_JSON_PATH, existing_embeddings)
    debug_log(f"Embeddings written to {EMBEDDINGS_JSON_PATH}")

    empty_directory(IMAGES_PATH)
    print(f"Directory {IMAGES_PATH} emptied successfully")


    debug_log("Script execution complete")
