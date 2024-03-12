// Display loader

let isPending = false;
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

const onRunButton = async () => {
  const startDate = formatDate(document.getElementById("startDate").value);
  const endDate = formatDate(document.getElementById("endDate").value);
  const number = document.getElementById("number").value;
  isPending=true
  try{
  const response = await fetch(
    `/run-command/${startDate}/${endDate}/${number}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );
    isPending = false;

    const excelJson = await response.json();

    const worksheet = XLSX.utils.json_to_sheet(excelJson);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      `${startDate}_to_${endDate}_scrapp`
    );

    XLSX.writeFile(workbook, `${startDate}_to_${endDate}_scrapp.xlsx`, {
      compression: true,
    });
}
  catch (error) {
      const errorText = document.getElementById("errorText");
      errorText.innerText = "ERROR : Too much Kaspr call will be done for the day, reduce the amount"
  }
  
};

const getUpdate = async () => {
  try {
    const response = await fetch("/string-to-show", {
      method: "GET",
      cache:"no-store"
    });
    const data = await response.text();
    document.getElementById("updateText").innerText = data;
  } catch (error) {
    console.error("Error fetching data 2:", error);
  }
};

const interval = setInterval(() => {
  if (isPending) {
    getUpdate();
  }
}, 500);

const cleanupInterval = () => clearInterval(interval);

document.getElementById("runButton").addEventListener("click", async () => {
  try {
    document.getElementById("loader").style.display = "block";
    document.getElementById("updateText").style.display = "block";
    await onRunButton();
    document.getElementById("loader").style.display = "none";
    document.getElementById("updateText").style.display = "none";
  } catch (error) {
    console.error("Error:", error);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const showValuesButton = document.getElementById("showValuesButton");
  const mailValue = document.getElementById("mailValue");

  showValuesButton.addEventListener("click", async function () {
    const response = await fetch(`/remaining-credits`, { method: "GET" });
    const data = await response.json();
    showValuesButton.disabled = true;
    mailValue.innerText = `Email credits : ${data.workEmailCredits}`;
  });
});

window.addEventListener("beforeunload", cleanupInterval);
window.addEventListener("unload", cleanupInterval);
