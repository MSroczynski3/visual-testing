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

  test('should have proper ARIA labels on homepage', async ({ page }) => {
    await homePage.goto();
    await homePage.waitForProductsToLoad();

    await expect(homePage.logo).toHaveAttribute('aria-label', /Visual Testing Store/i);

    const themeToggleLabel = await homePage.themeToggleButton.getAttribute('aria-label');
    expect(themeToggleLabel).toMatch(/switch to (dark|light) theme/i);

    const cartLabel = await homePage.cartLink.getAttribute('aria-label');
    expect(cartLabel).toMatch(/shopping cart with \d+ items/i);

    const productCards = homePage.getProductCards();
    const firstCard = productCards.first();
    
    await expect(firstCard).toHaveRole('article');

    const productName = await firstCard.getAttribute('aria-label');
    expect(productName).toBeTruthy();
  });

  test('should have proper ARIA labels on product detail page', async ({ page }) => {
    await productPage.gotoProduct(PRODUCTS[0].id);
    await productPage.verifyPageLoaded();

    await expect(productPage.addToCartButton).toHaveAttribute('aria-label', /add to cart/i);

    await expect(productPage.backToProductsLink).toBeVisible();
    const backLinkText = await productPage.backToProductsLink.textContent();
    expect(backLinkText).toBeTruthy();

    const imgAlt = await productPage.productImage.getAttribute('alt');
    expect(imgAlt).toBeTruthy();
  });

  test('should have proper ARIA labels for success notifications', async ({ page }) => {
    await productPage.gotoProduct(PRODUCTS[0].id);
    await productPage.addToCart();

    await expect(productPage.successBanner).toHaveRole('alert');

    await expect(productPage.dismissBannerButton).toBeVisible();
    const dismissLabel = await productPage.dismissBannerButton.getAttribute('aria-label');
    expect(dismissLabel).toMatch(/dismiss/i);
  });

  test('should have proper ARIA labels on cart page', async ({ page }) => {
    await productPage.gotoProduct(PRODUCTS[0].id);
    await productPage.addToCart();

    await cartPage.goToCart();
    await cartPage.verifyPageLoaded();

    await expect(cartPage.pageHeading).toHaveRole('heading', { level: 1 });

    const removeButton = cartPage.getRemoveButton(PRODUCTS[0].name);
    const removeLabel = await removeButton.getAttribute('aria-label');
    expect(removeLabel).toMatch(/remove/i);

    await expect(cartPage.clearCartButton).toBeVisible();
    await expect(cartPage.continueShoppingLink).toBeVisible();
  });

  test('should have semantic HTML structure', async ({ page }) => {
    await homePage.goto();
    await homePage.waitForProductsToLoad();

    const nav = page.locator('nav');
    await expect(nav).toBeVisible();

    const main = page.locator('main');
    await expect(main).toBeVisible();

    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toBeVisible();
  });

  test('should provide context for cart badge', async ({ page }) => {
    await homePage.goto();

    await productPage.gotoProduct(PRODUCTS[0].id);
    await productPage.addToCart();

    const cartLabel = await productPage.cartLink.getAttribute('aria-label');
    expect(cartLabel).toContain('1 item');

    await productPage.gotoProduct(PRODUCTS[1].id);
    await productPage.addToCart();

    const updatedCartLabel = await productPage.cartLink.getAttribute('aria-label');
    expect(updatedCartLabel).toContain('2 items');
  });

  test('should have keyboard navigable elements', async ({ page }) => {
    await homePage.goto();
    await homePage.waitForProductsToLoad();

    await homePage.logo.focus();
    await expect(homePage.logo).toBeFocused();

    await homePage.themeToggleButton.focus();
    await expect(homePage.themeToggleButton).toBeFocused();

    await homePage.cartLink.focus();
    await expect(homePage.cartLink).toBeFocused();

    const firstProductLink = homePage.getProductCards().first().getByRole('link');
    await firstProductLink.focus();
    await expect(firstProductLink).toBeFocused();
  });

  test('should have proper focus management on product page', async ({ page }) => {
    await productPage.gotoProduct(PRODUCTS[0].id);
    await productPage.verifyPageLoaded();

    await productPage.addToCartButton.focus();
    await expect(productPage.addToCartButton).toBeFocused();

    await productPage.backToProductsLink.focus();
    await expect(productPage.backToProductsLink).toBeFocused();
  });

  test('should have accessible cart operations', async ({ page }) => {
    await productPage.gotoProduct(PRODUCTS[0].id);
    await productPage.addToCart();
    await productPage.gotoProduct(PRODUCTS[1].id);
    await productPage.addToCart();

    await cartPage.goToCart();

    const removeButton = cartPage.getRemoveButton(PRODUCTS[0].name);
    await removeButton.focus();
    await expect(removeButton).toBeFocused();

    await cartPage.clearCartButton.focus();
    await expect(cartPage.clearCartButton).toBeFocused();
  });

  test('should maintain focus indicators throughout navigation', async ({ page }) => {
    await homePage.goto();
    await homePage.waitForProductsToLoad();

    await page.keyboard.press('Tab');
    const activeElement1 = await page.evaluate(() => document.activeElement?.tagName);
    expect(activeElement1).toBeTruthy();

    await page.keyboard.press('Tab');
    const activeElement2 = await page.evaluate(() => document.activeElement?.tagName);
    expect(activeElement2).toBeTruthy();
  });
});

