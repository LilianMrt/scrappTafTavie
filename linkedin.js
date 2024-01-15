const puppeteer = require("puppeteer");

const getLinkedInUrl = async (listOfFullName) => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();

  // Go to LinkedIn
  await page.goto("https://www.linkedin.com");

  await page.type("#session_key", "lilian.maroteau@gmail.com");
  await page.type("#session_password", process.env.LINKEDIN_PASSWORD);
  await page.keyboard.press("Enter");

  await page.waitForSelector(
    ".search-global-typeahead__collapsed-search-button",
    { timeout: 50_000 }
  );
  let results = []
  let first = true;
  for (fullName of listOfFullName) {
    try{
      try{
        await page.click(".search-global-typeahead__collapsed-search-button");
      } catch (e){
      }
      // Type the full name in the search bar and press Enter
      await page.keyboard.down("ControlLeft");
      await page.keyboard.press("KeyA");
      await page.keyboard.up("ControlLeft");

      await page.type("#global-nav-typeahead input", fullName);
      await page.keyboard.press("Enter");

      // Wait for the search results page to load
      await page.waitForXPath("//button[contains(., 'Personnes')]");

      // // Click on the People tab
      if (first){
          const [button] = await page.$x("//button[contains(., 'Personnes')]");
          await button.click();
          first = false;
      }
      

      // Wait for the people search results to load
      await page.waitForSelector(".search-results-container");

      // Get the URL of the first result
      const result = await page.evaluate(() => {
        const resultsSearch = document.querySelector(
          ".reusable-search__result-container"
        );
        const firstResult = resultsSearch.querySelector(".app-aware-link ");
        const spanElement = resultsSearch.querySelector(
          'span[aria-hidden="true"]'
        );

        return firstResult
          ? {
              name: spanElement.textContent.trim(),
              id: firstResult.href.split("?")[0].split("/").slice(-1)[0],
            }
          : null;
      });
      results.push(result);
    } catch {
      results.push({name : null, id :null})
    }
  }
  // Close the browser
  browser.close();
  return results
}

module.exports = getLinkedInUrl;