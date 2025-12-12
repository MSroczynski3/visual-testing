import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object Model for the Product Detail Page
 * Contains locators and methods for interacting with individual product pages.
 */
export class ProductPage extends BasePage {
  // Page-specific elements
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

    // Product detail page locators
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

  /**
   * Navigate to a product detail page by ID
   */
  async gotoProduct(productId: string) {
    await this.page.goto(`/product/${productId}`);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Add product to cart and wait for success feedback
   */
  async addToCart() {
    await this.addToCartButton.click();
    // Wait for success banner to appear
    await expect(this.successBanner).toBeVisible({ timeout: 5000 });
  }

  /**
   * Navigate back to products page
   */
  async goBackToProducts() {
    await this.backToProductsLink.click();
    await this.page.waitForURL('/');
  }

  /**
   * Verify product detail page has loaded correctly
   */
  async verifyPageLoaded() {
    await expect(this.productName).toBeVisible();
    await expect(this.productPrice).toBeVisible();
    await expect(this.addToCartButton).toBeVisible();
    await expect(this.backToProductsLink).toBeVisible();
  }

  /**
   * Get the product name text
   */
  async getProductName(): Promise<string> {
    return await this.productName.textContent() || '';
  }

  /**
   * Get the product price text
   */
  async getProductPrice(): Promise<string> {
    return await this.productPrice.textContent() || '';
  }

  /**
   * Verify success banner appears after adding to cart
   */
  async verifySuccessBanner() {
    await expect(this.successBanner).toBeVisible();
    await expect(this.successMessage).toBeVisible();
    // Verify checkmark icon is present (using generic icon check)
    const bannerIcons = this.successBanner.locator('svg');
    await expect(bannerIcons.first()).toBeVisible();
    await expect(this.dismissBannerButton).toBeVisible();
  }

  /**
   * Dismiss the success banner
   */
  async dismissSuccessBanner() {
    await this.dismissBannerButton.click();
    await expect(this.successBanner).toBeHidden();
  }
}

