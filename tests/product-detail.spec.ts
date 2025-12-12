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

  test('should navigate to product detail page and display full information', async ({ page }) => {
    await homePage.goto();
    await homePage.waitForProductsToLoad();

    const testProduct = PRODUCTS[0];
    await homePage.clickProduct(testProduct.name);

    await expect(page).toHaveURL(new RegExp(`/product/${testProduct.id}`));

    await productPage.verifyPageLoaded();

    await expect(productPage.productName).toHaveText(testProduct.name);

    await expect(productPage.productPrice).toContainText(`$${testProduct.price.toFixed(2)}`);

    await expect(productPage.productDescription).toBeVisible();

    await expect(productPage.productImage).toBeVisible();

    await expect(productPage.addToCartButton).toBeVisible();
    await expect(productPage.addToCartButton).toBeEnabled();

    await expect(productPage.backToProductsLink).toBeVisible();

    await expect(page).toHaveScreenshot('product-detail-page.png', { fullPage: true });
  });

  test('should navigate back to homepage via "Back to products" link', async ({ page }) => {
    const testProduct = PRODUCTS[0];
    await productPage.gotoProduct(testProduct.id);
    await productPage.verifyPageLoaded();

    await productPage.goBackToProducts();

    await expect(page).toHaveURL('/');
    await homePage.verifyPageLoaded();
  });

  test('should display correct information for different products', async ({ page }) => {
    const productsToTest = [PRODUCTS[0], PRODUCTS[1], PRODUCTS[4]];

    for (const product of productsToTest) {
      await productPage.gotoProduct(product.id);
      await productPage.verifyPageLoaded();

      const displayedName = await productPage.getProductName();
      expect(displayedName).toBe(product.name);

      const displayedPrice = await productPage.getProductPrice();
      expect(displayedPrice).toContain(`$${product.price.toFixed(2)}`);
    }
  });
});

