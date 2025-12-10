import { test, expect } from '@playwright/test';
import { HomePage } from './pages';
import { PRODUCTS, EXPECTED_PRODUCT_COUNT, STORE_NAME } from './fixtures/testData';

test.describe('Homepage - Product Browsing', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
  });

  /**
   * Scenario 1: Homepage Initial Load and Product Browsing
   * Verifies the homepage loads correctly and displays all products.
   */
  test('should display homepage with all products and navigation elements', async ({ page }) => {
    // Step 1: Navigate to homepage
    await homePage.goto();

    // Step 2: Wait for products to load (handle loading state)
    await homePage.waitForProductsToLoad();

    // Step 3: Verify page structure
    await homePage.verifyPageLoaded();

    // Verify header elements
    await expect(homePage.logo).toBeVisible();
    await expect(homePage.logo).toHaveAttribute('aria-label', 'Visual Testing Store - Home');
    await expect(homePage.themeToggleButton).toBeVisible();
    await expect(homePage.cartLink).toBeVisible();

    // Verify initial cart state shows 0 items
    const cartCount = await homePage.getCartItemCount();
    expect(cartCount).toBe(0);

    // Verify 8 products are displayed
    const productCount = await homePage.getProductCount();
    expect(productCount).toBe(EXPECTED_PRODUCT_COUNT);

    // Verify all expected products are present with correct names and prices
    for (const product of PRODUCTS) {
      const productCard = homePage.getProductByName(product.name);
      await expect(productCard).toBeVisible();

      // Verify product name
      const nameHeading = homePage.getProductNameHeading(product.name);
      await expect(nameHeading).toHaveText(product.name);

      // Verify product price
      const priceElement = homePage.getProductPrice(product.name);
      await expect(priceElement).toContainText(`$${product.price.toFixed(2)}`);
    }
  });
});

