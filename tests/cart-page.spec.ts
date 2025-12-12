import { test, expect } from '@playwright/test';
import { HomePage, ProductPage, CartPage } from './pages';
import { PRODUCTS } from './fixtures/testData';

test.describe('Cart Page - Display and Operations', () => {
  let homePage: HomePage;
  let productPage: ProductPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    productPage = new ProductPage(page);
    cartPage = new CartPage(page);
  });

  /**
   * Scenario 5: Cart Page Display and Verification
   * Verifies the cart page displays all added items with correct information and pricing.
   */
  test('should display cart with all items and correct pricing', async ({ page }) => {
    // Setup: Add 3 products to cart
    const productsToAdd = [
      PRODUCTS[0], // Classic Leather Wallet - $49.99
      PRODUCTS[1], // Wireless Bluetooth Headphones - $129.99
      PRODUCTS[2], // Stainless Steel Water Bottle - $34.99
    ];

    // Add products to cart
    for (const product of productsToAdd) {
      await productPage.gotoProduct(product.id);
      await productPage.addToCart();
    }

    // Verify cart count is 3
    let cartCount = await productPage.getCartItemCount();
    expect(cartCount).toBe(3);

    // Step 1: Navigate to cart page
    await cartPage.goToCart();

    // Step 2: Verify cart page loads successfully
    await cartPage.verifyPageLoaded();

    // Verify heading displays "Shopping Cart"
    await expect(cartPage.pageHeading).toBeVisible();
    await expect(cartPage.pageHeading).toHaveText('Shopping Cart');

    // Step 3: Verify all 3 products are listed
    const cartItemsCount = await cartPage.getCartItemsCount();
    expect(cartItemsCount).toBe(3);

    // Step 4: Verify each product displays correct information
    for (const product of productsToAdd) {
      await cartPage.verifyProductInCart(product.name, product.price);

      // Verify product name is in h2
      const nameHeading = cartPage.getCartItemNameHeading(product.name);
      await expect(nameHeading).toBeVisible();
      await expect(nameHeading).toHaveText(product.name);

      // Verify price and quantity display
      const cartItem = cartPage.getCartItemByName(product.name);
      await expect(cartItem).toContainText(`$${product.price.toFixed(2)}`);
      await expect(cartItem).toContainText('x 1'); // Quantity

      // Verify remove button is present
      const removeButton = cartPage.getRemoveButton(product.name);
      await expect(removeButton).toBeVisible();
    }

    // Step 5: Verify total is calculated correctly
    const expectedTotal = productsToAdd.reduce((sum, p) => sum + p.price, 0);
    const totalText = await cartPage.getTotalPrice();
    expect(totalText).toContain(`$${expectedTotal.toFixed(2)}`);

    // Step 6: Verify "Clear Cart" button is visible
    await expect(cartPage.clearCartButton).toBeVisible();

    // Step 7: Verify "Continue Shopping" link is present
    await expect(cartPage.continueShoppingLink).toBeVisible();

    // Take screenshot
    await expect(page).toHaveScreenshot('cart-page-with-items.png', { fullPage: true });
  });

  test('should display empty cart state', async ({ page }) => {
    // Navigate to cart page without adding any items
    await cartPage.goto();

    // Verify empty cart message
    await cartPage.verifyEmptyCart();

    // Verify continue shopping link is still present
    await expect(cartPage.continueShoppingLink).toBeVisible();

    // Take screenshot
    await expect(page).toHaveScreenshot('cart-page-empty.png', { fullPage: true });
  });

  test('should remove individual item from cart', async ({ page }) => {
    // Add 2 products to cart
    const productsToAdd = [PRODUCTS[0], PRODUCTS[1]];

    for (const product of productsToAdd) {
      await productPage.gotoProduct(product.id);
      await productPage.addToCart();
    }

    // Navigate to cart
    await cartPage.goToCart();

    // Verify 2 items in cart
    let itemsCount = await cartPage.getCartItemsCount();
    expect(itemsCount).toBe(2);

    // Remove first item
    await cartPage.removeItem(PRODUCTS[0].name);

    // Verify only 1 item remains
    itemsCount = await cartPage.getCartItemsCount();
    expect(itemsCount).toBe(1);

    // Verify correct item was removed
    await expect(cartPage.getCartItemByName(PRODUCTS[0].name)).toBeHidden();
    await expect(cartPage.getCartItemByName(PRODUCTS[1].name)).toBeVisible();

    // Verify cart count in header updated
    const cartCount = await cartPage.getCartItemCount();
    expect(cartCount).toBe(1);
  });

  test('should clear all items from cart', async ({ page }) => {
    // Add products to cart
    const productsToAdd = [PRODUCTS[0], PRODUCTS[1], PRODUCTS[2]];

    for (const product of productsToAdd) {
      await productPage.gotoProduct(product.id);
      await productPage.addToCart();
    }

    // Navigate to cart
    await cartPage.goToCart();

    // Verify items in cart
    let itemsCount = await cartPage.getCartItemsCount();
    expect(itemsCount).toBe(3);

    // Clear cart
    await cartPage.clearCart();

    // Verify cart is now empty
    await cartPage.verifyEmptyCart();

    // Verify cart count in header is 0
    const cartCount = await cartPage.getCartItemCount();
    expect(cartCount).toBe(0);
  });

  test('should navigate back to homepage via "Continue Shopping" link', async ({ page }) => {
    // Add a product and navigate to cart
    await productPage.gotoProduct(PRODUCTS[0].id);
    await productPage.addToCart();
    await cartPage.goToCart();

    // Click "Continue Shopping"
    await cartPage.continueShopping();

    // Verify we're back on homepage
    await expect(page).toHaveURL('/');
    await homePage.verifyPageLoaded();
  });

  test('should display correct total for various quantities', async ({ page }) => {
    // Add the same product multiple times (simulating quantity)
    const testProduct = PRODUCTS[0]; // $49.99
    const quantity = 3;

    for (let i = 0; i < quantity; i++) {
      await productPage.gotoProduct(testProduct.id);
      await productPage.addToCart();
      await page.waitForTimeout(500); // Small delay to ensure each addition is processed
    }

    // Navigate to cart
    await cartPage.goToCart();

    // Verify cart has 3 items (or combined into one with quantity 3, depending on implementation)
    const itemsCount = await cartPage.getCartItemsCount();
    expect(itemsCount).toBeGreaterThan(0);

    // Verify the product appears in cart
    await expect(cartPage.getCartItemByName(testProduct.name)).toBeVisible();

    // Calculate expected total
    const expectedTotal = testProduct.price * quantity;
    const totalText = await cartPage.getTotalPrice();
    expect(totalText).toContain(`$${expectedTotal.toFixed(2)}`);
  });

  test('should display cart with all 8 products', async ({ page }) => {
    // Add all products to cart
    for (const product of PRODUCTS) {
      await productPage.gotoProduct(product.id);
      await productPage.addToCart();
    }

    // Navigate to cart
    await cartPage.goToCart();

    // Verify all 8 items in cart
    const itemsCount = await cartPage.getCartItemsCount();
    expect(itemsCount).toBe(8);

    // Calculate total of all products
    const expectedTotal = PRODUCTS.reduce((sum, p) => sum + p.price, 0);
    const totalText = await cartPage.getTotalPrice();
    expect(totalText).toContain(`$${expectedTotal.toFixed(2)}`);

    // Take screenshot
    await expect(page).toHaveScreenshot('cart-page-all-products.png', { fullPage: true });
  });
});

