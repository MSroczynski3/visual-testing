import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
  readonly productName: Locator;
  readonly productPrice: Locator;
  readonly productDescription: Locator;
  readonly productImage: Locator;
  readonly addToCartButton: Locator;
  readonly backToProductsLink: Locator;

  constructor(page: Page) {
    super(page);

    this.productName = page.getByRole('heading', { level: 1 });
    this.productPrice = page.getByRole('definition');
    this.productDescription = page.getByRole('article').locator('p');
    this.productImage = page.getByRole('img', { name: /.*product image/i });
    this.addToCartButton = page.getByRole('button', { name: /add.*to cart/i });
    this.backToProductsLink = page.getByRole('link', { name: /back to products/i });
  }

  bannerLocators() {
    const banner = this.page.getByRole('alert').filter({ hasText: "Item added to cart successfully!" });
    const checkmarkIcon = this.page.getByRole('img', { name: "Success" });
    const closeButton = this.page.getByRole('button', { name: "Dismiss notification" });
    return {
      banner,
      checkmarkIcon,
      closeButton,
    };
  }

  async gotoProduct(productId: string) {
    await this.page.goto(`/product/${productId}`);
    await this.verifyPageLoaded();
  }

  async addToCart() {
    // Get current count before adding
    const currentCount = await this.getCartItemCount();
    
    await this.addToCartButton.click();
    await expect(this.bannerLocators().banner).toBeVisible({ timeout: 5000 });
    
    // Wait for cart badge to update
    await this.waitForCartCount(currentCount + 1);
  }

  async goBackToProducts() {
    await this.backToProductsLink.click();
    await this.page.waitForURL('/');
  }

  async verifyPageLoaded() {
    await expect(this.productName).toBeVisible();
    await expect(this.productPrice).toBeVisible();
    await expect(this.addToCartButton).toBeVisible();
    await expect(this.backToProductsLink).toBeVisible();
  }

  async getProductName(): Promise<string> {
    return await this.productName.textContent() || '';
  }

  async getProductPrice(): Promise<string> {
    return await this.productPrice.textContent() || '';
  }

  async verifySuccessBanner() {
    await expect(this.bannerLocators().banner).toBeVisible();
    await expect(this.bannerLocators().checkmarkIcon).toBeVisible();
    await expect(this.bannerLocators().closeButton).toBeVisible();
  }

  async dismissSuccessBanner() {
    await this.bannerLocators().closeButton.click();
    await expect(this.bannerLocators().banner).toBeHidden();
  }
}

