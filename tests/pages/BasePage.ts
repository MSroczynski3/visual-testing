import { Page, Locator, expect } from '@playwright/test';

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
    this.cartBadge = page.getByTestId('cart-badge');
  }

  async goto() {
    await this.page.goto('/');
  }

  async getCartItemCount(): Promise<number> {
    // Check if badge exists (it's hidden when count is 0)
    const count = await this.cartBadge.count();
    if (count === 0) return 0;
    
    // Wait for badge to be stable before reading
    await expect(this.cartBadge).toBeVisible({ timeout: 5000 });
    
    // Get the text content
    const text = await this.cartBadge.textContent();
    return text ? parseInt(text, 10) : 0;
  }

  async waitForCartCount(expectedCount: number, timeout: number = 5000): Promise<void> {
    if (expectedCount === 0) {
      await expect(this.cartBadge).toBeHidden({ timeout });
    } else {
      await expect(this.cartBadge).toHaveText(expectedCount.toString(), { timeout });
    }
  }

  async goToCart() {
    await this.cartLink.click();
    await this.page.waitForURL('/cart');
  }

  async toggleTheme() {
    await this.themeToggleButton.click();
  }
}

