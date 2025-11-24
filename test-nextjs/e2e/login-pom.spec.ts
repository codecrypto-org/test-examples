import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

test.describe('Login E2E Tests con Page Object Model', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test.afterEach(async ({ page }, testInfo) => {
    // Tomar screenshot después de cada test
    const testName = testInfo.title.replace(/\s+/g, '-').toLowerCase();
    await loginPage.takeScreenshot(`test-results/screenshots/pom-${testName}.png`);
  });

  test('debería mostrar el formulario de login', async () => {
    // Screenshot inicial
    await loginPage.takeScreenshot('test-results/screenshots/pom-01-formulario-inicial.png');
    
    // Verificar que todos los elementos del formulario estén visibles
    await loginPage.verifyFormIsVisible();
    
    // Screenshot final
    await loginPage.takeScreenshot('test-results/screenshots/pom-01-formulario-final.png');
  });

  test('debería mostrar error de validación cuando el usuario está vacío', async () => {
    // Llenar solo la contraseña
    await loginPage.fillPassword('test123');
    await loginPage.takeScreenshot('test-results/screenshots/pom-02-error-usuario-antes-envio.png');
    
    // Intentar enviar el formulario
    await loginPage.submit();

    // Verificar que se muestra el error de validación
    await loginPage.verifyUsuarioError();
    await loginPage.takeScreenshot('test-results/screenshots/pom-02-error-usuario-con-error.png');
  });

  test('debería mostrar error de validación cuando la contraseña está vacía', async () => {
    // Llenar solo el usuario
    await loginPage.fillUsuario('test');
    await loginPage.takeScreenshot('test-results/screenshots/pom-03-error-password-antes-envio.png');
    
    // Intentar enviar el formulario
    await loginPage.submit();

    // Verificar que se muestra el error de validación
    await loginPage.verifyPasswordError();
    await loginPage.takeScreenshot('test-results/screenshots/pom-03-error-password-con-error.png');
  });

  test('debería iniciar sesión exitosamente con credenciales válidas', async () => {
    // Realizar login con credenciales válidas
    await loginPage.fillForm('admin', 'admin123');
    await loginPage.takeScreenshot('test-results/screenshots/pom-04-login-exitoso-antes-envio.png');
    
    await loginPage.submit();

    // Verificar que se muestra el mensaje de éxito
    await loginPage.verifyLoginSuccess();
    await loginPage.takeScreenshot('test-results/screenshots/pom-04-login-exitoso-con-mensaje.png');
  });

  test('debería mostrar error con credenciales incorrectas', async () => {
    // Intentar login con credenciales incorrectas
    await loginPage.fillForm('admin', 'wrongpassword');
    await loginPage.takeScreenshot('test-results/screenshots/pom-05-credenciales-incorrectas-antes-envio.png');
    
    await loginPage.submit();

    // Verificar que se muestra el mensaje de error
    await loginPage.verifyLoginError();
    await loginPage.takeScreenshot('test-results/screenshots/pom-05-credenciales-incorrectas-con-error.png');
  });

  test('debería probar múltiples usuarios válidos', async () => {
    const usuariosValidos = [
      { usuario: 'admin', password: 'admin123' },
      { usuario: 'test', password: 'test123' },
      { usuario: 'demo', password: 'demo123' },
    ];

    for (let i = 0; i < usuariosValidos.length; i++) {
      const credenciales = usuariosValidos[i];
      
      // Recargar la página para cada test
      await loginPage.reload();

      // Realizar login
      await loginPage.fillForm(credenciales.usuario, credenciales.password);
      await loginPage.takeScreenshot(`test-results/screenshots/pom-06-multiples-usuarios-${i+1}-antes-envio.png`);
      
      await loginPage.submit();

      // Verificar éxito
      await loginPage.verifyLoginSuccess();
      await loginPage.takeScreenshot(`test-results/screenshots/pom-06-multiples-usuarios-${i+1}-exitoso.png`);
    }
  });

  test('debería mostrar estado de carga durante el envío', async () => {
    // Preparar credenciales
    await loginPage.fillForm('admin', 'admin123');
    await loginPage.takeScreenshot('test-results/screenshots/pom-07-estado-carga-antes-envio.png');
    
    // Interceptar la petición para simular delay
    await loginPage.interceptLoginWithDelay(500);

    // Iniciar el proceso de login
    await loginPage.submit();

    // Verificar que aparece el estado de carga
    await loginPage.verifyLoadingState();
    await loginPage.takeScreenshot('test-results/screenshots/pom-07-estado-carga-durante-envio.png');
    
    // Esperar a que termine y verificar éxito
    await loginPage.verifyLoginSuccess();
    await loginPage.takeScreenshot('test-results/screenshots/pom-07-estado-carga-finalizado.png');
  });

  test('debería validar que los campos están vacíos inicialmente', async () => {
    // Verificar que los campos están vacíos
    await expect(loginPage.usuarioInput).toHaveValue('');
    await expect(loginPage.passwordInput).toHaveValue('');
  });

  test('debería limpiar los campos después de un error', async () => {
    // Intentar login con credenciales incorrectas
    await loginPage.login('admin', 'wrongpassword');
    await loginPage.verifyLoginError();

    // Verificar que los campos aún tienen los valores ingresados
    await expect(loginPage.usuarioInput).toHaveValue('admin');
    await expect(loginPage.passwordInput).toHaveValue('wrongpassword');
  });

  test('debería usar el método login para simplificar el flujo', async () => {
    // Usar el método helper login que combina fillForm y submit
    await loginPage.login('admin', 'admin123');
    
    // Verificar éxito
    await loginPage.verifyLoginSuccess();
  });
});

