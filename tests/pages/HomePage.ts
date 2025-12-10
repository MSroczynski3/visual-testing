import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object Model for the Home Page
 * Contains locators and methods for interacting with the product listing page.
 */
export class HomePage extends BasePage {
  // Page-specific elements
  readonly pageTitle: Locator;
  readonly productGrid: Locator;
  readonly loadingIndicator: Locator;
  readonly errorAlert: Locator;
  readonly noProductsMessage: Locator;

  constructor(page: Page) {
    super(page);

    // Homepage locators using stable, semantic selectors
    this.pageTitle = page.getByRole('heading', { name: 'Our Products', level: 1 });
    this.productGrid = page.getByRole('list');
    this.loadingIndicator = page.getByRole('status').filter({ hasText: 'Loading products...' });
    this.errorAlert = page.getByRole('alert');
    this.noProductsMessage = page.getByText('No products available');
  }

  /**
   * Navigate to homepage and wait for products to load
   */
  async gotoAndWaitForProducts() {
    await this.goto();
    await this.waitForProductsToLoad();
  }

  /**
   * Wait for the loading state to disappear
   */
  async waitForProductsToLoad() {
    // Wait for loading indicator to disappear
    await expect(this.loadingIndicator).toBeHidden({ timeout: 10000 });
  }

  /**
   * Get all product card elements
   */
  getProductCards(): Locator {
    return this.page.getByRole('article');
  }

  /**
   * Get the count of displayed products
   */
  async getProductCount(): Promise<number> {
    return await this.getProductCards().count();
  }

  /**
   * Get a specific product card by its name
   */
  getProductByName(productName: string): Locator {
    return this.page.getByRole('article', { name: productName });
  }

  /**
   * Get the product name heading within a product card
   */
  getProductNameHeading(productName: string): Locator {
    return this.getProductByName(productName).getByRole('heading', { level: 2 });
  }

  /**
   * Get the price element for a product
   */
  getProductPrice(productName: string): Locator {
    return this.getProductByName(productName).locator('.product-price');
  }

  /**
   * Click on a product to navigate to its detail page
   */
  async clickProduct(productName: string) {
    await this.getProductByName(productName).getByRole('link').click();
  }

  /**
   * Get all product names displayed on the page
   */
  async getAllProductNames(): Promise<string[]> {
    const headings = this.page.getByRole('article').getByRole('heading', { level: 2 });
    return await headings.allTextContents();
  }

  /**
   * Verify the page has loaded successfully with products
   */
  async verifyPageLoaded() {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.productGrid).toBeVisible();
  }
}

