import sys
import pandas as pd
import json
import re
import os


def read_data_from_json(file_path):
    with open(file_path, 'r') as json_file:
        return json.load(json_file)

def write_data_to_json(file_path, data):
    with open(file_path, 'w') as json_file:
        json.dump(data, json_file)

if __name__ == "__main__":
    try:
        ExcelFile = sys.argv[1]
        section = sys.argv[2]
        palier = sys.argv[3]
        specialite = sys.argv[4]
    except IndexError:
        print("Error: Please provide the necessary command-line arguments.")
        sys.exit(1)

    ENSEIGNEMENTS_JSON_PATH = os.path.join(os.path.dirname(__file__), "mydb", "mydb.enseignements.json")

    enseignements_file = read_data_from_json(ENSEIGNEMENTS_JSON_PATH)

    # Read Excel file
    excel_data = pd.read_excel(ExcelFile, header=None)

    def get_id_creneau(excel_data, col_index, row_index):
        # Extract IdCreneau from the specified column index
        day = excel_data.iloc[row_index, 0]

        # Mapping for day of the week
        day_mapping = {
            1: "Samedi",
            2: "Dimanche",
            3: "Lundi",
            4: "Mardi",
            5: "Mercredi",
            6: "Jeudi",
        }
        val_list = list(day_mapping.values())
        key_list = list(day_mapping.keys())

        # Get the day of the week
        position = val_list.index(day)

        # Concatenate day with col_index to create IdCreneau
        IdCreneau = f"{key_list[position]}{col_index}"

        return IdCreneau

    def search_prof_by_name(nom, prenom, profs_data):
        # Search for the professor using nom and prenom in the provided data
        for prof in profs_data:
            if prof['nom'] == nom and prof['prenom'] == prenom:
                return prof['MatriculeProf']
        return None

    def fill_collection(excel_data, enseignements_file):
        enseignements_data = []

        rows, cols = excel_data.shape
        for col_index in range(1, cols):  # Start from 1 to skip the first column
            for row_index in range(8, rows, 2):  # Iterate over rows skipping every other row

                salle = excel_data.iloc[row_index, col_index]  # Extract salle from the current row
                data = excel_data.iloc[row_index + 1, col_index]
                if data.strip():  # Check if data is not an empty string
                    current_day = pd.isna(excel_data.iloc[row_index, 0])
                    if current_day == False:
                        IdCreneau = get_id_creneau(excel_data, col_index, row_index)  # Extract IdCreneau from the first row

                    parts = [part for part in data.split(' ') if part]
                    seance, module, groupe, *name_parts = parts[:5]
                    match = re.search(r'\d+', groupe)
                    if match:
                        groupe = match.group()

                    # Replace groupe with None if seance is "Cours"
                    if seance == "Cours":
                        parts.insert(2, None)
                        seance, module, groupe, *name_parts = parts[:5]

                    # Check if name_parts contains a single element "/"
                    if len(name_parts) == 1 and name_parts[0] == '/':
                        prenom = ''  # Empty first name
                        nom = ''  # Empty last name
                    else:
                        nom = ' '.join(name_parts[:-1]).rstrip(',')  # Join remaining values as first name and remove trailing comma
                        prenom = name_parts[-1]  # Last value as last name


                    document = {
                        "IdCreneau": IdCreneau,
                        "module": module,
                        "groupe": groupe,
                        "salle": salle,
                        "section": section,  # Assuming these values are constant
                        "palier": palier,
                        "specialite": specialite
                    }
                    # Check uniqueness of MatriculeProf and IdCreneau
                    if not any(
                        doc["IdCreneau"] == IdCreneau
                        for doc in enseignements_file
                    ):
                        print("Adding document:", document)
                        enseignements_data.append(document)
                    else:
                        print("Skipping duplicate document:", document)

        return enseignements_data

    # Fill collection with data
    enseignements_data = fill_collection(excel_data, enseignements_file)

    if enseignements_data:
        if enseignements_file:
            enseignements_file.extend(enseignements_data)
            write_data_to_json(ENSEIGNEMENTS_JSON_PATH, enseignements_file)
        else:
            write_data_to_json(ENSEIGNEMENTS_JSON_PATH, enseignements_data)
        print("JSON output written to:", ENSEIGNEMENTS_JSON_PATH)
    else:
        print("No new data to add to the JSON file.")
