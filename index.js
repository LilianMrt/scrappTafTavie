const pappersFunction = require("./pappers.js");
const getLinkedInUrl = require("./linkedin.js");
const kasperFunc = require("./kasper.js");

const index = async (startDate, endDate, number, stringShowed) => {
  stringShowed.setString("Retrieving data on Pappers");
  const pappersResults = await pappersFunction(startDate, endDate, number);
  const forLinkedinNomDirigeants = [];

  pappersResults.forEach((element) => {
    if (element.nomDirigeant !== "Dirigeant is private") {
      forLinkedinNomDirigeants.push(element.nomDirigeant);
    } else {
      forLinkedinNomDirigeants.push(null);
    }
  });

  const linkedinResults = await getLinkedInUrl(
    forLinkedinNomDirigeants,
    stringShowed
  );

  let batchNumber = 0;
  let kasprCallable = 0;
  let hashMap = new Map();

  linkedinResults.map((element, index) => {
    if (element.id && element.name) {
      kasprCallable++;
    }
    hashMap.set(index, batchNumber);
    batchNumber = Math.floor(kasprCallable / 20);
  });

  if (kasprCallable > 250) {
    throw new Error();
  } else {
    const excelJson = await Promise.all(
      pappersResults.map(async (element, index) => {
            return new Promise((resolve) => {
        setTimeout(async () => {
          stringShowed.setString(
            `Retrieving Kaspr informations, batch of 20 number ${
              hashMap.get(index) + 1
            } out of ${batchNumber + 1}`
          );
          let toAddToExcelJson = element;
          const linkedinResult = linkedinResults[index];
          if (forLinkedinNomDirigeants[index] && linkedinResult.name) {
            toAddToExcelJson = {
              ...toAddToExcelJson,
              nameLinkedin: linkedinResult.name,
            };
          } else {
            toAddToExcelJson = {
              ...toAddToExcelJson,
              nameLinkedin: "",
            };
          }
          if (linkedinResult.id && linkedinResult.name) {
            const kasperResult = await kasperFunc(
              linkedinResult.id,
              linkedinResult.name
            );
            toAddToExcelJson = {
              ...toAddToExcelJson,
              workEmail: kasperResult.workEmail,
            };
          } else {
            toAddToExcelJson = {
              ...toAddToExcelJson,
              workEmail: "",
            };
          }
          resolve(toAddToExcelJson);
        }, hashMap.get(index) * 70000);
      })
  }));
    return excelJson;
  }
};

module.exports = index;
