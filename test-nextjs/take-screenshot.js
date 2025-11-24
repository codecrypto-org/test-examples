const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Navegar a la página de login
  await page.goto('http://localhost:3000/login');
  
  // Esperar a que el formulario se cargue
  await page.waitForSelector('form');
  
  // Tomar captura de pantalla
  await page.screenshot({ 
    path: 'login-form-screenshot.png',
    fullPage: true
  });
  
  console.log('Captura de pantalla guardada en: login-form-screenshot.png');
  
  await browser.close();
})();

