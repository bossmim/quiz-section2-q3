const puppeteer = require("puppeteer");

(async function main() {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
    });
    const [page] = await browser.pages();

    await page.goto("https://codequiz.azurewebsites.net");

    await page.$eval("input", (elem) => elem.click());

    await page.reload();

    // Wait until table is populated by the app
    await page.waitForSelector("table");

    const data = await page.evaluate(() => {
      const tds = Array.from(document.querySelectorAll("table tr td"));
      return tds.map((td) => td.innerText);
    });

    const param = process.argv.slice(2)[0];

    const arrayIndex = data.findIndex((val) => val === param);

    await browser.close();
    console.log('Nav = ', data[arrayIndex + 1]);
    return data[arrayIndex + 1]

  } catch (err) {
    console.error(err);
  }
})();
