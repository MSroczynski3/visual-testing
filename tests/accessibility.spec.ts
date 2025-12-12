import { test, expect } from '@playwright/test';
import { HomePage, ProductPage, CartPage } from './pages';
import { PRODUCTS } from './fixtures/testData';

test.describe('Accessibility Features', () => {
  let homePage: HomePage;
  let productPage: ProductPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    productPage = new ProductPage(page);
    cartPage = new CartPage(page);
  });

  /**
   * Scenario 6: Accessibility Validation
   * Verifies accessibility features are properly implemented.
   */
  test('should have proper ARIA labels on homepage', async ({ page }) => {
    await homePage.goto();
    await homePage.waitForProductsToLoad();

    // Verify logo has descriptive aria-label
    await expect(homePage.logo).toHaveAttribute('aria-label', /Visual Testing Store/i);

    // Verify theme toggle has descriptive aria-label
    const themeToggleLabel = await homePage.themeToggleButton.getAttribute('aria-label');
    expect(themeToggleLabel).toMatch(/switch to (dark|light) theme/i);

    // Verify cart link has descriptive aria-label with item count
    const cartLabel = await homePage.cartLink.getAttribute('aria-label');
    expect(cartLabel).toMatch(/shopping cart with \d+ items/i);

    // Verify product cards have proper structure
    const productCards = homePage.getProductCards();
    const firstCard = productCards.first();
    
    // Verify each product card is an article
    await expect(firstCard).toHaveRole('article');

    // Verify product cards have accessible names
    const productName = await firstCard.getAttribute('aria-label');
    expect(productName).toBeTruthy();
  });

  test('should have proper ARIA labels on product detail page', async ({ page }) => {
    await productPage.gotoProduct(PRODUCTS[0].id);
    await productPage.verifyPageLoaded();

    // Verify "Add to Cart" button has proper label
    await expect(productPage.addToCartButton).toHaveAttribute('aria-label', /add to cart/i);

    // Verify "Back to products" link is accessible
    await expect(productPage.backToProductsLink).toBeVisible();
    const backLinkText = await productPage.backToProductsLink.textContent();
    expect(backLinkText).toBeTruthy();

    // Verify product image has alt text
    const imgAlt = await productPage.productImage.getAttribute('alt');
    expect(imgAlt).toBeTruthy();
  });

  test('should have proper ARIA labels for success notifications', async ({ page }) => {
    await productPage.gotoProduct(PRODUCTS[0].id);
    await productPage.addToCart();

    // Verify success banner uses ARIA alert role
    await expect(productPage.successBanner).toHaveRole('alert');

    // Verify dismiss button is accessible
    await expect(productPage.dismissBannerButton).toBeVisible();
    const dismissLabel = await productPage.dismissBannerButton.getAttribute('aria-label');
    expect(dismissLabel).toMatch(/dismiss/i);
  });

  test('should have proper ARIA labels on cart page', async ({ page }) => {
    // Add items to cart
    await productPage.gotoProduct(PRODUCTS[0].id);
    await productPage.addToCart();

    // Navigate to cart
    await cartPage.goToCart();
    await cartPage.verifyPageLoaded();

    // Verify cart heading is properly structured
    await expect(cartPage.pageHeading).toHaveRole('heading', { level: 1 });

    // Verify remove buttons have descriptive labels
    const removeButton = cartPage.getRemoveButton(PRODUCTS[0].name);
    const removeLabel = await removeButton.getAttribute('aria-label');
    expect(removeLabel).toMatch(/remove/i);

    // Verify "Clear Cart" button is accessible
    await expect(cartPage.clearCartButton).toBeVisible();
    
    // Verify "Continue Shopping" link is accessible
    await expect(cartPage.continueShoppingLink).toBeVisible();
  });

  test('should have semantic HTML structure', async ({ page }) => {
    await homePage.goto();
    await homePage.waitForProductsToLoad();

    // Verify navigation uses semantic HTML
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();

    // Verify main content area
    const main = page.locator('main');
    await expect(main).toBeVisible();

    // Verify headings hierarchy
    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toBeVisible();
  });

  test('should provide context for cart badge', async ({ page }) => {
    await homePage.goto();

    // Add item to cart
    await productPage.gotoProduct(PRODUCTS[0].id);
    await productPage.addToCart();

    // Verify cart link updates with context
    const cartLabel = await productPage.cartLink.getAttribute('aria-label');
    expect(cartLabel).toContain('1 item');

    // Add another item
    await productPage.gotoProduct(PRODUCTS[1].id);
    await productPage.addToCart();

    // Verify cart link updates to plural
    const updatedCartLabel = await productPage.cartLink.getAttribute('aria-label');
    expect(updatedCartLabel).toContain('2 items');
  });

  test('should have keyboard navigable elements', async ({ page }) => {
    await homePage.goto();
    await homePage.waitForProductsToLoad();

    // Verify logo is focusable
    await homePage.logo.focus();
    await expect(homePage.logo).toBeFocused();

    // Verify theme toggle is focusable
    await homePage.themeToggleButton.focus();
    await expect(homePage.themeToggleButton).toBeFocused();

    // Verify cart link is focusable
    await homePage.cartLink.focus();
    await expect(homePage.cartLink).toBeFocused();

    // Verify product links are focusable
    const firstProductLink = homePage.getProductCards().first().getByRole('link');
    await firstProductLink.focus();
    await expect(firstProductLink).toBeFocused();
  });

  test('should have proper focus management on product page', async ({ page }) => {
    await productPage.gotoProduct(PRODUCTS[0].id);
    await productPage.verifyPageLoaded();

    // Verify "Add to Cart" button is focusable
    await productPage.addToCartButton.focus();
    await expect(productPage.addToCartButton).toBeFocused();

    // Verify "Back to products" link is focusable
    await productPage.backToProductsLink.focus();
    await expect(productPage.backToProductsLink).toBeFocused();
  });

  test('should have accessible cart operations', async ({ page }) => {
    // Add items to cart
    await productPage.gotoProduct(PRODUCTS[0].id);
    await productPage.addToCart();
    await productPage.gotoProduct(PRODUCTS[1].id);
    await productPage.addToCart();

    // Navigate to cart
    await cartPage.goToCart();

    // Verify remove buttons are keyboard accessible
    const removeButton = cartPage.getRemoveButton(PRODUCTS[0].name);
    await removeButton.focus();
    await expect(removeButton).toBeFocused();

    // Verify clear cart button is keyboard accessible
    await cartPage.clearCartButton.focus();
    await expect(cartPage.clearCartButton).toBeFocused();
  });

  test('should maintain focus indicators throughout navigation', async ({ page }) => {
    await homePage.goto();
    await homePage.waitForProductsToLoad();

    // Tab through elements and verify focus is visible
    await page.keyboard.press('Tab');
    const activeElement1 = await page.evaluate(() => document.activeElement?.tagName);
    expect(activeElement1).toBeTruthy();

    await page.keyboard.press('Tab');
    const activeElement2 = await page.evaluate(() => document.activeElement?.tagName);
    expect(activeElement2).toBeTruthy();
  });
});

