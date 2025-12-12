import { Page, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  readonly logo: Locator;
  readonly themeToggleButton: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;

    this.logo = page.getByRole('link', { name: /Visual Testing Store - Home/i });
    this.themeToggleButton = page.getByRole('button', { name: /Switch to (dark|light) theme/i });
    this.cartLink = page.getByRole('link', { name: /Shopping cart with \d+ items/i });
    this.cartBadge = page.locator('.cart-badge');
  }

  async goto() {
    await this.page.goto('/');
  }

  async getCartItemCount(): Promise<number> {
    const ariaLabel = await this.cartLink.getAttribute('aria-label');
    const match = ariaLabel?.match(/(\d+) items/);
    return match ? parseInt(match[1], 10) : 0;
  }

  async goToCart() {
    await this.cartLink.click();
    await this.page.waitForURL('/cart');
  }

  async toggleTheme() {
    await this.themeToggleButton.click();
  }
}

