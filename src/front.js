// Display loader

// Simulate a time-consuming operation (e.g., API call)
// Hide loader after the script completes
const formatDate = (inputDate) => {
  if (!inputDate) {
    return "Please enter a valid date.";
  }

  const day = inputDate.slice(8, 10);
  const month = inputDate.slice(5, 7);
  const year = inputDate.slice(0, 4);

  return `${day}-${month}-${year}`;
};
// Retrieve values from input fields

document.getElementById("runButton").addEventListener("click", async () => {
  try {
    document.getElementById("loader").style.display = "block";
    const startDate = formatDate(document.getElementById("startDate").value);
    const endDate = formatDate(document.getElementById("endDate").value);
    const number = document.getElementById("number").value;
    const response = await fetch(
      `/run-command/${startDate}/${endDate}/${number}`,
      { method: "GET" }
    );
    const excelJson = await response.json();

    const worksheet = XLSX.utils.json_to_sheet(excelJson);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `${startDate}_to_${endDate}_scrapp`);

    XLSX.writeFile(workbook, `${startDate}_to_${endDate}_scrapp.xlsx`, { compression: true });
    document.getElementById("loader").style.display = "none";
  } catch (error) {
    console.error("Error:", error);
  }
});
