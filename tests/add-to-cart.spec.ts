import { test, expect } from '@playwright/test';
import { HomePage, ProductPage } from './pages';
import { PRODUCTS } from './fixtures/testData';

test.describe('Add to Cart - Single and Multiple Products', () => {
  let homePage: HomePage;
  let productPage: ProductPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    productPage = new ProductPage(page);
  });

  /**
   * Scenario 3: Add Single Product to Cart
   * Verifies adding a product to the cart updates state and provides visual feedback.
   */
  test('should add single product to cart with visual feedback', async ({ page }) => {
    // Step 1: Navigate to a product detail page
    const testProduct = PRODUCTS[0]; // Classic Leather Wallet
    await productPage.gotoProduct(testProduct.id);
    await productPage.verifyPageLoaded();

    // Verify initial cart count is 0
    let cartCount = await productPage.getCartItemCount();
    expect(cartCount).toBe(0);

    // Step 2: Click "Add to Cart" button
    await productPage.addToCart();

    // Step 3: Verify visual feedback
    // Verify success banner appears
    await productPage.verifySuccessBanner();

    // Verify success message text
    await expect(productPage.successMessage).toBeVisible();
    await expect(productPage.successMessage).toHaveText(/item added to cart successfully/i);

    // Verify checkmark icon is present
    const checkmarkIcon = productPage.successBanner.locator('svg').first();
    await expect(checkmarkIcon).toBeVisible();

    // Verify dismiss button is present
    await expect(productPage.dismissBannerButton).toBeVisible();

    // Verify cart badge updated from "0" to "1"
    cartCount = await productPage.getCartItemCount();
    expect(cartCount).toBe(1);

    // Take screenshot showing success state
    await expect(page).toHaveScreenshot('after-adding-single-product.png', { fullPage: true });

    // Verify no console errors (checked via Playwright)
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        throw new Error(`Console error: ${msg.text()}`);
      }
    });
  });

  test('should dismiss success notification', async ({ page }) => {
    const testProduct = PRODUCTS[0];
    await productPage.gotoProduct(testProduct.id);
    await productPage.verifyPageLoaded();

    // Add to cart and verify banner appears
    await productPage.addToCart();
    await expect(productPage.successBanner).toBeVisible();

    // Dismiss the banner
    await productPage.dismissSuccessBanner();

    // Verify banner is no longer visible
    await expect(productPage.successBanner).toBeHidden();
  });

  /**
   * Scenario 4: Add Multiple Products to Cart
   * Verifies adding multiple products updates cart count correctly.
   */
  test('should add multiple products to cart and increment count correctly', async ({ page }) => {
    const productsToAdd = [
      PRODUCTS[0], // Classic Leather Wallet - $49.99
      PRODUCTS[1], // Wireless Bluetooth Headphones - $129.99
      PRODUCTS[2], // Stainless Steel Water Bottle - $34.99
    ];

    let expectedCartCount = 0;

    // Verify initial cart is empty
    await homePage.goto();
    let cartCount = await homePage.getCartItemCount();
    expect(cartCount).toBe(0);

    for (let i = 0; i < productsToAdd.length; i++) {
      const product = productsToAdd[i];

      // Step 1: Add product to cart
      await productPage.gotoProduct(product.id);
      await productPage.verifyPageLoaded();

      // Add to cart
      await productPage.addToCart();

      // Step 2: Verify success notification appears
      await productPage.verifySuccessBanner();

      // Step 3: Verify cart badge increments
      expectedCartCount++;
      cartCount = await productPage.getCartItemCount();
      expect(cartCount).toBe(expectedCartCount);

      // Take screenshot after each addition
      await expect(page).toHaveScreenshot(`after-adding-product-${i + 1}.png`, { fullPage: true });

      // Step 4: Return to homepage (except for last item)
      if (i < productsToAdd.length - 1) {
        await productPage.goBackToProducts();
        await homePage.verifyPageLoaded();

        // Verify cart state persists across navigation
        cartCount = await homePage.getCartItemCount();
        expect(cartCount).toBe(expectedCartCount);
      }
    }

    // Final verification: cart should have 3 items
    cartCount = await productPage.getCartItemCount();
    expect(cartCount).toBe(3);
  });

  test('should maintain cart state across page navigation', async ({ page }) => {
    // Add a product
    const testProduct = PRODUCTS[0];
    await productPage.gotoProduct(testProduct.id);
    await productPage.addToCart();

    // Verify cart count is 1
    let cartCount = await productPage.getCartItemCount();
    expect(cartCount).toBe(1);

    // Navigate to homepage
    await productPage.goBackToProducts();

    // Verify cart count is still 1
    cartCount = await homePage.getCartItemCount();
    expect(cartCount).toBe(1);

    // Navigate to another product
    await productPage.gotoProduct(PRODUCTS[1].id);

    // Verify cart count is still 1
    cartCount = await productPage.getCartItemCount();
    expect(cartCount).toBe(1);
  });

  test('should handle adding duplicate products', async ({ page }) => {
    const testProduct = PRODUCTS[0];

    // Add same product twice
    await productPage.gotoProduct(testProduct.id);
    await productPage.addToCart();

    let cartCount = await productPage.getCartItemCount();
    expect(cartCount).toBe(1);

    // Add again
    await page.reload(); // Reload to clear the banner
    await productPage.addToCart();

    // Cart count should increment
    cartCount = await productPage.getCartItemCount();
    expect(cartCount).toBe(2);
  });
});

