import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  // Collect console messages
  page.on('console', msg => console.log('BROWSER_CONSOLE:', msg.type().toUpperCase(), msg.text()));
  page.on('pageerror', err => console.log('BROWSER_PAGEERROR:', err.toString()));
  
  try {
    const response = await page.goto('http://localhost:5173', { waitUntil: 'networkidle0', timeout: 10000 });
    console.log('STATUS:', response?.status());
  } catch (err) {
    console.log('NAVIGATION_ERROR:', err.message);
  }
  
  await browser.close();
})();
