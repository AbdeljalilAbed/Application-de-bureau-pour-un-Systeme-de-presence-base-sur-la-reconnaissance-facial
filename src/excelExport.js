import * as XLSX from "xlsx";

export const exportToExcel = (tableData, dates, isPresent) => {
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
};
