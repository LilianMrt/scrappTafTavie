const express = require("express");
const path = require("path");
const { exec } = require("child_process");
const index = require("./index.js");
const StringToShow = require("./stringToShow.js");

const app = express();
const port = 3000 ;

const stringShowed = new StringToShow("isRunning"); 

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, "src")));

// Handle requests to the root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "index.html"));
});

app.get("/run-command/:startDate/:endDate/:number", async (req, res) => {
  const { startDate, endDate, number } = req.params;
  // Run your Node.js command here
  try {
    jsonedExcel = await index(startDate, endDate, number, stringShowed);
    res.json(jsonedExcel);
  } catch (error) {
    throw new Error()
  }
});

app.get("/remaining-credits", async (req, res) => {
  const url = 'https://api.developers.kaspr.io/keys/remainingCredits';
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      authorization: "Bearer 56ab2f32090b419798fb630528330a4e",
    },
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    res.json(data)
  } catch (error) {
    console.error(error);
  }
})


app.get("/string-to-show", (req, res) => {
      res.send(stringShowed.getString());
    }
  );

// Start the server
app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running at http://localhost:${port}`);
});