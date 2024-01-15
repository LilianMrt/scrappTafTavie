const pappersFunction = require("./pappers.js");
const getLinkedInUrl = require("./linkedin.js");
const kasperFunc = require("./kasper.js");

const args = process.argv.slice(2);
// Check if there are enough arguments
if (args.length < 3) {
  console.error("Usage: node index.js startDate endDate number");
  process.exit(1); // Exit with an error code
}

// Extract parameters
const startDate= args[0];
const endDate = args[1];
const number = args[1];

const index = async (startDate, endDate, number) => {

const pappersResults = await pappersFunction(startDate, endDate, number);
const forLinkedinNomDirigeants = [];

pappersResults.forEach((element) => {
  if (element.nomDirigeant !== "Dirigeant is private") {
    forLinkedinNomDirigeants.push(element.nomDirigeant);
  } else {
    forLinkedinNomDirigeants.push(null);
  }
});
const linkedinResults = await getLinkedInUrl(forLinkedinNomDirigeants);

const excelJson = await Promise.all(
pappersResults.map(async (element, index) => {
  let toAddToExcelJson = element;
  const linkedinResult = linkedinResults[index];
  if (forLinkedinNomDirigeants[index] && linkedinResult.name){
  toAddToExcelJson = {
    ...toAddToExcelJson,
    nameLinkedin: 
      linkedinResult.name,
  };
  } else {
    toAddToExcelJson = {
      ...toAddToExcelJson,
      nameLinkedin: ""
    };
  }
  if (linkedinResult.id && linkedinResult.name) {
    const kasperResult = await kasperFunc(
      linkedinResult.id,
      linkedinResult.name
    );
    toAddToExcelJson = {
      ...toAddToExcelJson,
      phone: kasperResult.phone,
      workEmail: kasperResult.workEmail,
      directEmail: kasperResult.directEmail,
    };
  } else {
    toAddToExcelJson = {
      ...toAddToExcelJson,
      phone: "",
      workEmail: "",
      directEmail: "",
    };
  }
  return toAddToExcelJson
})
);
console.log(JSON.stringify(excelJson))
} 

index(startDate, endDate, number)