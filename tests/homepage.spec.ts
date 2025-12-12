import { test, expect } from '@playwright/test';
import { HomePage } from './pages';
import { PRODUCTS, EXPECTED_PRODUCT_COUNT, STORE_NAME } from './fixtures/testData';

test.describe('Homepage - Product Browsing', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
  });

  test('should display homepage with all products and navigation elements', async ({ page }) => {
    await homePage.goto();

    await homePage.waitForProductsToLoad();

    await homePage.verifyPageLoaded();

    await expect(homePage.logo).toBeVisible();
    await expect(homePage.logo).toHaveAttribute('aria-label', 'Visual Testing Store - Home');
    await expect(homePage.themeToggleButton).toBeVisible();
    await expect(homePage.cartLink).toBeVisible();

    const cartCount = await homePage.getCartItemCount();
    expect(cartCount).toBe(0);

    const productCount = await homePage.getProductCount();
    expect(productCount).toBe(EXPECTED_PRODUCT_COUNT);

    for (const product of PRODUCTS) {
      const productCard = homePage.getProductByName(product.name);
      await expect(productCard).toBeVisible();

      const nameHeading = homePage.getProductNameHeading(product.name);
      await expect(nameHeading).toHaveText(product.name);

      const priceElement = homePage.getProductPrice(product.name);
      await expect(priceElement).toContainText(`$${product.price.toFixed(2)}`);
    }

    await expect(page).toHaveScreenshot({fullPage: true});
  });
});

