import { test, expect } from '@playwright/test';

test.describe('Login E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test.afterEach(async ({ page }, testInfo) => {
    // Tomar screenshot después de cada test
    const testName = testInfo.title.replace(/\s+/g, '-').toLowerCase();
    await page.screenshot({ 
      path: `test-results/screenshots/${testName}.png`,
      fullPage: true 
    });
  });

  test('debería mostrar el formulario de login', async ({ page }) => {
    // Screenshot inicial
    await page.screenshot({ path: 'test-results/screenshots/01-formulario-inicial.png', fullPage: true });
    
    await expect(page.getByRole('heading', { name: /iniciar sesión/i })).toBeVisible();
    await expect(page.getByLabel(/usuario/i)).toBeVisible();
    await expect(page.getByLabel(/contraseña/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /iniciar sesión/i })).toBeVisible();
    
    // Screenshot final
    await page.screenshot({ path: 'test-results/screenshots/01-formulario-final.png', fullPage: true });
  });

  test('debería mostrar error de validación cuando el usuario está vacío', async ({ page }) => {
    const passwordInput = page.getByLabel(/contraseña/i);
    const submitButton = page.getByRole('button', { name: /iniciar sesión/i });

    await passwordInput.fill('test123');
    await page.screenshot({ path: 'test-results/screenshots/02-error-usuario-antes-envio.png', fullPage: true });
    
    await submitButton.click();

    await expect(page.getByText('El usuario es requerido')).toBeVisible();
    await page.screenshot({ path: 'test-results/screenshots/02-error-usuario-con-error.png', fullPage: true });
  });

  test('debería mostrar error de validación cuando la contraseña está vacía', async ({ page }) => {
    const usuarioInput = page.getByLabel(/usuario/i);
    const submitButton = page.getByRole('button', { name: /iniciar sesión/i });

    await usuarioInput.fill('test');
    await page.screenshot({ path: 'test-results/screenshots/03-error-password-antes-envio.png', fullPage: true });
    
    await submitButton.click();

    await expect(page.getByText('La contraseña es requerida')).toBeVisible();
    await page.screenshot({ path: 'test-results/screenshots/03-error-password-con-error.png', fullPage: true });
  });

  test('debería iniciar sesión exitosamente con credenciales válidas', async ({ page }) => {
    const usuarioInput = page.getByLabel(/usuario/i);
    const passwordInput = page.getByLabel(/contraseña/i);
    const submitButton = page.getByRole('button', { name: /iniciar sesión/i });

    await usuarioInput.fill('admin');
    await passwordInput.fill('admin123');
    await page.screenshot({ path: 'test-results/screenshots/04-login-exitoso-antes-envio.png', fullPage: true });
    
    await submitButton.click();

    // Esperar a que aparezca el mensaje de éxito
    await expect(page.getByText('¡Inicio de sesión exitoso!')).toBeVisible({ timeout: 5000 });
    await page.screenshot({ path: 'test-results/screenshots/04-login-exitoso-con-mensaje.png', fullPage: true });
  });

  test('debería mostrar error con credenciales incorrectas', async ({ page }) => {
    const usuarioInput = page.getByLabel(/usuario/i);
    const passwordInput = page.getByLabel(/contraseña/i);
    const submitButton = page.getByRole('button', { name: /iniciar sesión/i });

    await usuarioInput.fill('admin');
    await passwordInput.fill('wrongpassword');
    await page.screenshot({ path: 'test-results/screenshots/05-credenciales-incorrectas-antes-envio.png', fullPage: true });
    
    await submitButton.click();

    // Esperar a que aparezca el mensaje de error
    await expect(page.getByText('Usuario o contraseña incorrectos')).toBeVisible({ timeout: 5000 });
    await page.screenshot({ path: 'test-results/screenshots/05-credenciales-incorrectas-con-error.png', fullPage: true });
  });

  test('debería probar múltiples usuarios válidos', async ({ page }) => {
    const usuariosValidos = [
      { usuario: 'admin', password: 'admin123' },
      { usuario: 'test', password: 'test123' },
      { usuario: 'demo', password: 'demo123' },
    ];

    for (let i = 0; i < usuariosValidos.length; i++) {
      const credenciales = usuariosValidos[i];
      // Recargar la página para cada test
      await page.reload();

      const usuarioInput = page.getByLabel(/usuario/i);
      const passwordInput = page.getByLabel(/contraseña/i);
      const submitButton = page.getByRole('button', { name: /iniciar sesión/i });

      await usuarioInput.fill(credenciales.usuario);
      await passwordInput.fill(credenciales.password);
      await page.screenshot({ path: `test-results/screenshots/06-multiples-usuarios-${i+1}-antes-envio.png`, fullPage: true });
      
      await submitButton.click();

      await expect(page.getByText('¡Inicio de sesión exitoso!')).toBeVisible({ timeout: 5000 });
      await page.screenshot({ path: `test-results/screenshots/06-multiples-usuarios-${i+1}-exitoso.png`, fullPage: true });
    }
  });

  test('debería mostrar estado de carga durante el envío', async ({ page }) => {
    const usuarioInput = page.getByLabel(/usuario/i);
    const passwordInput = page.getByLabel(/contraseña/i);
    const submitButton = page.getByRole('button', { name: /iniciar sesión/i });

    await usuarioInput.fill('admin');
    await passwordInput.fill('admin123');
    await page.screenshot({ path: 'test-results/screenshots/07-estado-carga-antes-envio.png', fullPage: true });
    
    // Interceptar la petición para simular delay
    await page.route('/api/auth/login', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      await route.continue();
    });

    await submitButton.click();

    // Verificar que aparece el estado de carga
    await expect(page.getByText('Iniciando sesión...')).toBeVisible();
    await page.screenshot({ path: 'test-results/screenshots/07-estado-carga-durante-envio.png', fullPage: true });
    
    // Esperar a que termine y tomar screenshot final
    await expect(page.getByText('¡Inicio de sesión exitoso!')).toBeVisible({ timeout: 5000 });
    await page.screenshot({ path: 'test-results/screenshots/07-estado-carga-finalizado.png', fullPage: true });
  });
});

