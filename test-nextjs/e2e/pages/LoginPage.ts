import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model para la página de Login
 * Encapsula todos los elementos y acciones relacionadas con el formulario de login
 */
export class LoginPage {
  readonly page: Page;
  
  // Selectores de elementos
  readonly heading: Locator;
  readonly usuarioInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;
  readonly loadingMessage: Locator;
  readonly usuarioError: Locator;
  readonly passwordError: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Inicializar locators
    this.heading = page.getByRole('heading', { name: /iniciar sesión/i });
    this.usuarioInput = page.getByLabel(/usuario/i);
    this.passwordInput = page.getByLabel(/contraseña/i);
    this.submitButton = page.getByRole('button', { name: /iniciar sesión/i });
    this.errorMessage = page.locator('[role="alert"]').filter({ hasText: /usuario o contraseña incorrectos|error de conexión|error al iniciar sesión/i });
    this.successMessage = page.getByText('¡Inicio de sesión exitoso!');
    this.loadingMessage = page.getByText('Iniciando sesión...');
    this.usuarioError = page.getByText('El usuario es requerido');
    this.passwordError = page.getByText('La contraseña es requerida');
  }

  /**
   * Navega a la página de login
   */
  async goto(): Promise<void> {
    await this.page.goto('/login');
  }

  /**
   * Verifica que el formulario de login esté visible
   */
  async verifyFormIsVisible(): Promise<void> {
    await expect(this.heading).toBeVisible();
    await expect(this.usuarioInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }

  /**
   * Completa el campo de usuario
   */
  async fillUsuario(usuario: string): Promise<void> {
    await this.usuarioInput.fill(usuario);
  }

  /**
   * Completa el campo de contraseña
   */
  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  /**
   * Completa ambos campos del formulario
   */
  async fillForm(usuario: string, password: string): Promise<void> {
    await this.fillUsuario(usuario);
    await this.fillPassword(password);
  }

  /**
   * Hace clic en el botón de enviar
   */
  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  /**
   * Realiza el login completo con credenciales
   */
  async login(usuario: string, password: string): Promise<void> {
    await this.fillForm(usuario, password);
    await this.submit();
  }

  /**
   * Verifica que se muestre el mensaje de error de validación de usuario
   */
  async verifyUsuarioError(): Promise<void> {
    await expect(this.usuarioError).toBeVisible();
  }

  /**
   * Verifica que se muestre el mensaje de error de validación de contraseña
   */
  async verifyPasswordError(): Promise<void> {
    await expect(this.passwordError).toBeVisible();
  }

  /**
   * Verifica que se muestre el mensaje de error de credenciales incorrectas
   */
  async verifyLoginError(): Promise<void> {
    await expect(this.errorMessage).toBeVisible({ timeout: 5000 });
  }

  /**
   * Verifica que se muestre el mensaje de éxito
   */
  async verifyLoginSuccess(): Promise<void> {
    await expect(this.successMessage).toBeVisible({ timeout: 5000 });
  }

  /**
   * Verifica que se muestre el estado de carga
   */
  async verifyLoadingState(): Promise<void> {
    await expect(this.loadingMessage).toBeVisible();
  }

  /**
   * Verifica que el botón esté deshabilitado (durante carga)
   */
  async verifyButtonDisabled(): Promise<void> {
    await expect(this.submitButton).toBeDisabled();
  }

  /**
   * Verifica que el botón esté habilitado
   */
  async verifyButtonEnabled(): Promise<void> {
    await expect(this.submitButton).toBeEnabled();
  }

  /**
   * Toma un screenshot de la página
   */
  async takeScreenshot(path: string): Promise<void> {
    await this.page.screenshot({ path, fullPage: true });
  }

  /**
   * Recarga la página
   */
  async reload(): Promise<void> {
    await this.page.reload();
  }

  /**
   * Intercepta la ruta de login para simular delay
   */
  async interceptLoginWithDelay(delayMs: number = 500): Promise<void> {
    await this.page.route('/api/auth/login', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      await route.continue();
    });
  }
}

