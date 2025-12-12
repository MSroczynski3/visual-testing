import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly pageTitle: Locator;
  readonly productGrid: Locator;
  readonly loadingIndicator: Locator;
  readonly errorAlert: Locator;
  readonly noProductsMessage: Locator;

  constructor(page: Page) {
    super(page);

    this.pageTitle = page.getByRole('heading', { name: 'Our Products', level: 1 });
    this.productGrid = page.getByRole('list');
    this.loadingIndicator = page.getByRole('status').filter({ hasText: 'Loading products...' });
    this.errorAlert = page.getByRole('alert');
    this.noProductsMessage = page.getByText('No products available');
  }

  async gotoAndWaitForProducts() {
    await this.goto();
    await this.waitForProductsToLoad();
  }

  async waitForProductsToLoad() {
    await expect(this.loadingIndicator).toBeHidden({ timeout: 10000 });
  }

  getProductCards(): Locator {
    return this.page.getByRole('article');
  }

  async getProductCount(): Promise<number> {
    return await this.getProductCards().count();
  }

  getProductByName(productName: string): Locator {
    return this.page.getByRole('article', { name: productName });
  }

  getProductNameHeading(productName: string): Locator {
    return this.getProductByName(productName).getByRole('heading', { level: 2 });
  }

  getProductPrice(productName: string): Locator {
    return this.getProductByName(productName).locator('.product-price');
  }

  async clickProduct(productName: string) {
    await this.getProductByName(productName).getByRole('link').click();
  }

  async getAllProductNames(): Promise<string[]> {
    const headings = this.page.getByRole('article').getByRole('heading', { level: 2 });
    return await headings.allTextContents();
  }

  async verifyPageLoaded() {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.productGrid).toBeVisible();
  }
}

