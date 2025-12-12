import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
  readonly productName: Locator;
  readonly productPrice: Locator;
  readonly productDescription: Locator;
  readonly productImage: Locator;
  readonly addToCartButton: Locator;
  readonly backToProductsLink: Locator;
  readonly successBanner: Locator;
  readonly successMessage: Locator;
  readonly dismissBannerButton: Locator;

  constructor(page: Page) {
    super(page);

    this.productName = page.getByRole('heading', { level: 1 });
    this.productPrice = page.locator('.product-price');
    this.productDescription = page.locator('.product-description');
    this.productImage = page.getByRole('img', { name: /product image/i });
    this.addToCartButton = page.getByRole('button', { name: /add to cart/i });
    this.backToProductsLink = page.getByRole('link', { name: /back to products/i });
    this.successBanner = page.getByRole('alert').filter({ hasText: /added to cart/i });
    this.successMessage = page.getByText(/item added to cart successfully/i);
    this.dismissBannerButton = page.getByRole('button', { name: /dismiss/i });
  }

  async gotoProduct(productId: string) {
    await this.page.goto(`/product/${productId}`);
    await this.page.waitForLoadState('networkidle');
  }

  async addToCart() {
    await this.addToCartButton.click();
    await expect(this.successBanner).toBeVisible({ timeout: 5000 });
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
    await expect(this.successBanner).toBeVisible();
    await expect(this.successMessage).toBeVisible();
    const bannerIcons = this.successBanner.locator('svg');
    await expect(bannerIcons.first()).toBeVisible();
    await expect(this.dismissBannerButton).toBeVisible();
  }

  async dismissSuccessBanner() {
    await this.dismissBannerButton.click();
    await expect(this.successBanner).toBeHidden();
  }
}

