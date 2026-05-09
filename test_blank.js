const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.toString()));
  
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle0' });
  
  const content = await page.content();
  console.log('CONTENT LENGTH:', content.length);
  
  await browser.close();
})();
