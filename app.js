const express = require("express");
const path = require("path");
const { exec } = require("child_process");


const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, "src")));

// Handle requests to the root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "index.html"));
});

app.get("/run-command/:startDate/:endDate/:number", (req, res) => {
    const { startDate, endDate, number } = req.params;
  // Run your Node.js command here
  exec(
    `node index.js ${startDate} ${endDate} ${number}`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return res.status(500).send("Internal Server Error");
      }
      const resultObject = JSON.parse(stdout);
      res.json(resultObject);
    }
  );
});

// Start the server
app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running at http://localhost:${port}`);
});
