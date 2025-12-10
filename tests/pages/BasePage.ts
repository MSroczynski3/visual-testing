import { Page, Locator } from '@playwright/test';

/**
 * Base Page Object containing common elements and methods
 * shared across all pages of the application.
 */
export class BasePage {
  readonly page: Page;

  // Header elements
  readonly logo: Locator;
  readonly themeToggleButton: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;

    // Header locators using stable, semantic selectors
    this.logo = page.getByRole('link', { name: /Visual Testing Store - Home/i });
    this.themeToggleButton = page.getByRole('button', { name: /Switch to (dark|light) theme/i });
    this.cartLink = page.getByRole('link', { name: /Shopping cart with \d+ items/i });
    this.cartBadge = page.locator('.cart-badge');
  }

  /**
   * Navigate to the application root
   */
  async goto() {
    await this.page.goto('/');
  }

  /**
   * Get the current cart item count from the header
   */
  async getCartItemCount(): Promise<number> {
    const ariaLabel = await this.cartLink.getAttribute('aria-label');
    const match = ariaLabel?.match(/(\d+) items/);
    return match ? parseInt(match[1], 10) : 0;
  }

  /**
   * Navigate to cart page
   */
  async goToCart() {
    await this.cartLink.click();
    await this.page.waitForURL('/cart');
  }

  /**
   * Toggle theme between light and dark
   */
  async toggleTheme() {
    await this.themeToggleButton.click();
  }
}

