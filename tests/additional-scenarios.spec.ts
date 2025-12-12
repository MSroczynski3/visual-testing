import { test, expect } from '@playwright/test';
import { HomePage, ProductPage, CartPage } from './pages';
import { PRODUCTS } from './fixtures/testData';

test.describe('Additional Test Scenarios', () => {
  let homePage: HomePage;
  let productPage: ProductPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    productPage = new ProductPage(page);
    cartPage = new CartPage(page);
  });

  /**
   * Future Scenario: Theme Toggle (Dark/Light Mode)
   */
  test('should toggle between light and dark theme', async ({ page }) => {
    await homePage.goto();
    await homePage.waitForProductsToLoad();

    // Get initial theme button label
    const initialLabel = await homePage.themeToggleButton.getAttribute('aria-label');
    expect(initialLabel).toMatch(/switch to (dark|light) theme/i);

    // Toggle theme
    await homePage.toggleTheme();

    // Wait for theme change to apply
    await page.waitForTimeout(500);

    // Verify button label changed
    const newLabel = await homePage.themeToggleButton.getAttribute('aria-label');
    expect(newLabel).not.toBe(initialLabel);

    // Take screenshots in both themes
    await expect(page).toHaveScreenshot('theme-toggled.png', { fullPage: true });

    // Toggle back
    await homePage.toggleTheme();
    await page.waitForTimeout(500);

    // Verify we're back to original theme
    const finalLabel = await homePage.themeToggleButton.getAttribute('aria-label');
    expect(finalLabel).toBe(initialLabel);
  });

  /**
   * Future Scenario: Direct URL Navigation to Products
   */
  test('should navigate directly to product via URL', async ({ page }) => {
    const testProduct = PRODUCTS[3]; // Minimalist Desk Lamp

    // Navigate directly to product URL
    await page.goto(`/product/${testProduct.id}`);

    // Verify product page loads correctly
    await productPage.verifyPageLoaded();

    // Verify correct product is displayed
    const productName = await productPage.getProductName();
    expect(productName).toBe(testProduct.name);

    const productPrice = await productPage.getProductPrice();
    expect(productPrice).toContain(`$${testProduct.price.toFixed(2)}`);
  });

  /**
   * Future Scenario: Cart Persistence After Page Refresh
   */
  test('should persist cart after page refresh', async ({ page }) => {
    // Add products to cart
    await productPage.gotoProduct(PRODUCTS[0].id);
    await productPage.addToCart();

    await productPage.gotoProduct(PRODUCTS[1].id);
    await productPage.addToCart();

    // Verify cart count before refresh
    let cartCount = await productPage.getCartItemCount();
    expect(cartCount).toBe(2);

    // Refresh the page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Verify cart count persists after refresh
    cartCount = await productPage.getCartItemCount();
    expect(cartCount).toBe(2);

    // Navigate to cart and verify items are still there
    await cartPage.goToCart();
    const itemsCount = await cartPage.getCartItemsCount();
    expect(itemsCount).toBe(2);
  });

  /**
   * Future Scenario: Adding Duplicate Products
   */
  test('should handle adding the same product multiple times', async ({ page }) => {
    const testProduct = PRODUCTS[0];

    // Add same product 3 times
    for (let i = 0; i < 3; i++) {
      await productPage.gotoProduct(testProduct.id);
      await productPage.addToCart();
      await page.waitForTimeout(500);
    }

    // Verify cart count is 3
    const cartCount = await productPage.getCartItemCount();
    expect(cartCount).toBe(3);

    // Navigate to cart
    await cartPage.goToCart();

    // Verify product appears in cart (either 3 separate items or 1 item with quantity 3)
    const itemsInCart = await cartPage.getCartItemsCount();
    expect(itemsInCart).toBeGreaterThan(0);

    // Verify the product is present
    await expect(cartPage.getCartItemByName(testProduct.name)).toBeVisible();

    // Calculate total (should be 3 times the product price)
    const expectedTotal = testProduct.price * 3;
    const totalText = await cartPage.getTotalPrice();
    expect(totalText).toContain(`$${expectedTotal.toFixed(2)}`);
  });

  /**
   * Future Scenario: Price Calculation Edge Cases
   */
  test('should correctly calculate prices for various product combinations', async ({ page }) => {
    // Test combination: cheapest and most expensive products
    const cheapestProduct = PRODUCTS[6]; // Bamboo Cutting Board - $29.99
    const expensiveProduct = PRODUCTS[7]; // Mechanical Keyboard - $149.99

    await productPage.gotoProduct(cheapestProduct.id);
    await productPage.addToCart();

    await productPage.gotoProduct(expensiveProduct.id);
    await productPage.addToCart();

    // Navigate to cart
    await cartPage.goToCart();

    // Verify both products are in cart
    await cartPage.verifyProductInCart(cheapestProduct.name, cheapestProduct.price);
    await cartPage.verifyProductInCart(expensiveProduct.name, expensiveProduct.price);

    // Verify total calculation
    const expectedTotal = cheapestProduct.price + expensiveProduct.price;
    const totalText = await cartPage.getTotalPrice();
    expect(totalText).toContain(`$${expectedTotal.toFixed(2)}`);
  });

  /**
   * Future Scenario: Empty Cart State After Clearing
   */
  test('should show empty state after clearing populated cart', async ({ page }) => {
    // Add products to cart
    await productPage.gotoProduct(PRODUCTS[0].id);
    await productPage.addToCart();
    await productPage.gotoProduct(PRODUCTS[1].id);
    await productPage.addToCart();

    // Navigate to cart
    await cartPage.goToCart();

    // Verify cart has items
    let itemsCount = await cartPage.getCartItemsCount();
    expect(itemsCount).toBe(2);

    // Clear the cart
    await cartPage.clearCart();

    // Verify empty state is shown
    await cartPage.verifyEmptyCart();

    // Verify cart count in header is 0
    const cartCount = await cartPage.getCartItemCount();
    expect(cartCount).toBe(0);

    // Take screenshot of empty cart
    await expect(page).toHaveScreenshot('cart-empty-after-clear.png', { fullPage: true });
  });

  /**
   * Future Scenario: Navigation After Removing All Items Individually
   */
  test('should show empty cart after removing all items individually', async ({ page }) => {
    // Add 3 products
    const productsToAdd = [PRODUCTS[0], PRODUCTS[1], PRODUCTS[2]];

    for (const product of productsToAdd) {
      await productPage.gotoProduct(product.id);
      await productPage.addToCart();
    }

    // Navigate to cart
    await cartPage.goToCart();

    // Remove each item individually
    for (const product of productsToAdd) {
      await cartPage.removeItem(product.name);
      await page.waitForTimeout(300);
    }

    // Verify empty cart message appears
    await cartPage.verifyEmptyCart();

    // Verify cart count is 0
    const cartCount = await cartPage.getCartItemCount();
    expect(cartCount).toBe(0);
  });

  /**
   * Future Scenario: Multiple Product Cards Display
   */
  test('should display all product information on homepage cards', async ({ page }) => {
    await homePage.goto();
    await homePage.waitForProductsToLoad();

    // Verify each product card displays all required information
    for (const product of PRODUCTS) {
      const productCard = homePage.getProductByName(product.name);
      await expect(productCard).toBeVisible();

      // Verify product image
      const productImage = productCard.locator('img');
      await expect(productImage).toBeVisible();

      // Verify product name
      const productName = homePage.getProductNameHeading(product.name);
      await expect(productName).toBeVisible();
      await expect(productName).toHaveText(product.name);

      // Verify product price
      const productPrice = homePage.getProductPrice(product.name);
      await expect(productPrice).toBeVisible();
      await expect(productPrice).toContainText(`$${product.price.toFixed(2)}`);

      // Verify "View details" link
      const viewDetailsLink = productCard.getByRole('link');
      await expect(viewDetailsLink).toBeVisible();
    }
  });

  /**
   * Future Scenario: Verify Product Description Truncation on Homepage
   */
  test('should display truncated descriptions on product cards', async ({ page }) => {
    await homePage.goto();
    await homePage.waitForProductsToLoad();

    const firstProduct = homePage.getProductCards().first();
    
    // Check if description exists and is truncated
    const description = firstProduct.locator('.product-description, p');
    
    // If description exists, verify it's present
    const descriptionCount = await description.count();
    if (descriptionCount > 0) {
      await expect(description.first()).toBeVisible();
      
      // Description should be reasonably short (truncated)
      const descText = await description.first().textContent();
      expect(descText?.length).toBeLessThan(200);
    }
  });

  /**
   * Performance Test: Verify Fast Page Transitions
   */
  test('should have fast page transitions', async ({ page }) => {
    await homePage.goto();
    await homePage.waitForProductsToLoad();

    // Measure navigation to product page
    const startTime1 = Date.now();
    await homePage.clickProduct(PRODUCTS[0].name);
    await productPage.verifyPageLoaded();
    const productLoadTime = Date.now() - startTime1;

    expect(productLoadTime).toBeLessThan(2000); // Should load within 2 seconds

    // Measure back to homepage
    const startTime2 = Date.now();
    await productPage.goBackToProducts();
    await homePage.verifyPageLoaded();
    const homeLoadTime = Date.now() - startTime2;

    expect(homeLoadTime).toBeLessThan(2000);

    // Measure navigation to cart
    await productPage.gotoProduct(PRODUCTS[0].id);
    await productPage.addToCart();

    const startTime3 = Date.now();
    await cartPage.goToCart();
    await cartPage.verifyPageLoaded();
    const cartLoadTime = Date.now() - startTime3;

    expect(cartLoadTime).toBeLessThan(2000);
  });
});

