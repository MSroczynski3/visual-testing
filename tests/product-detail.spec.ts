import { test, expect } from '@playwright/test';
import { HomePage, ProductPage } from './pages';
import { PRODUCTS } from './fixtures/testData';

test.describe('Product Detail Page - Navigation and Display', () => {
  let homePage: HomePage;
  let productPage: ProductPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    productPage = new ProductPage(page);
  });

  /**
   * Scenario 2: Product Detail Page Navigation
   * Verifies navigation to individual product pages and display of product information.
   */
  test('should navigate to product detail page and display full information', async ({ page }) => {
    // Step 1: Navigate to homepage
    await homePage.goto();
    await homePage.waitForProductsToLoad();

    // Step 2: Click on a product (Classic Leather Wallet)
    const testProduct = PRODUCTS[0]; // Classic Leather Wallet
    await homePage.clickProduct(testProduct.name);

    // Verify URL changed to product detail page
    await expect(page).toHaveURL(new RegExp(`/product/${testProduct.id}`));

    // Step 3: Verify product detail page loaded with full information
    await productPage.verifyPageLoaded();

    // Verify product name is displayed as h1
    await expect(productPage.productName).toHaveText(testProduct.name);

    // Verify price is displayed
    await expect(productPage.productPrice).toContainText(`$${testProduct.price.toFixed(2)}`);

    // Verify product description is present
    await expect(productPage.productDescription).toBeVisible();

    // Verify product image is displayed
    await expect(productPage.productImage).toBeVisible();

    // Verify "Add to Cart" button is visible
    await expect(productPage.addToCartButton).toBeVisible();
    await expect(productPage.addToCartButton).toBeEnabled();

    // Step 4: Verify "Back to products" link is present
    await expect(productPage.backToProductsLink).toBeVisible();

    // Take screenshot
    await expect(page).toHaveScreenshot('product-detail-page.png', { fullPage: true });
  });

  test('should navigate back to homepage via "Back to products" link', async ({ page }) => {
    // Navigate directly to a product page
    const testProduct = PRODUCTS[0];
    await productPage.gotoProduct(testProduct.id);
    await productPage.verifyPageLoaded();

    // Click "Back to products" link
    await productPage.goBackToProducts();

    // Verify we're back on the homepage
    await expect(page).toHaveURL('/');
    await homePage.verifyPageLoaded();
  });

  test('should display correct information for different products', async ({ page }) => {
    // Test multiple products to ensure detail page works for all
    const productsToTest = [PRODUCTS[0], PRODUCTS[1], PRODUCTS[4]]; // Wallet, Headphones, Backpack

    for (const product of productsToTest) {
      await productPage.gotoProduct(product.id);
      await productPage.verifyPageLoaded();

      // Verify product-specific details
      const displayedName = await productPage.getProductName();
      expect(displayedName).toBe(product.name);

      const displayedPrice = await productPage.getProductPrice();
      expect(displayedPrice).toContain(`$${product.price.toFixed(2)}`);
    }
  });
});

