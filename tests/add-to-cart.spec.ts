import { test, expect } from '@playwright/test';
import { HomePage, ProductPage } from './pages';
import { PRODUCTS } from './fixtures/testData';

test.describe('Add to Cart - Single and Multiple Products', () => {
  let homePage: HomePage;
  let productPage: ProductPage;

  test.beforeEach(async ({ page }) => {
    // Clear cart from localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    
    homePage = new HomePage(page);
    productPage = new ProductPage(page);
  });

  test('should add single product to cart with visual feedback', async ({ page }) => {
    const testProduct = PRODUCTS[0];
    await productPage.gotoProduct(testProduct.id);

    let cartCount = await productPage.getCartItemCount();
    expect(cartCount).toBe(0);

    await productPage.addToCart();
    await productPage.verifySuccessBanner();

    cartCount = await productPage.getCartItemCount();
    expect(cartCount).toBe(1);

    await expect(page).toHaveScreenshot('after-adding-single-product.png', { fullPage: true });
  });

  test('should dismiss success notification', async ({ page }) => {
    const testProduct = PRODUCTS[0];
    await productPage.gotoProduct(testProduct.id);

    await productPage.addToCart();

    await productPage.verifySuccessBanner();
    await productPage.dismissSuccessBanner();
    });

  test('should add multiple products to cart and increment count correctly', async ({ page }) => {
    const productsToAdd = [
      PRODUCTS[0],
      PRODUCTS[1],
      PRODUCTS[2],
    ];

    let expectedCartCount = 0;

    await homePage.goto();
    let cartCount = await homePage.getCartItemCount();
    expect(cartCount).toBe(0);

    for (const [i, product] of productsToAdd.entries()) {
      await test.step(`Add product ${i + 1}: ${product.name}`, async () => {
        await productPage.gotoProduct(product.id);
        await productPage.addToCart();
        await productPage.verifySuccessBanner();

        expectedCartCount++;
        cartCount = await productPage.getCartItemCount();
        expect(cartCount).toBe(expectedCartCount);

        await expect(page).toHaveScreenshot(`after-adding-product-${i + 1}.png`, { fullPage: true });

        if (i < productsToAdd.length - 1) {
          await productPage.goBackToProducts();
          await homePage.verifyPageLoaded();

          cartCount = await homePage.getCartItemCount();
          expect(cartCount).toBe(expectedCartCount);
        }
      });
    }

    cartCount = await productPage.getCartItemCount();
    expect(cartCount).toBe(3);
  });

  test('should maintain cart state across page navigation', async ({ page }) => {
    const testProduct = PRODUCTS[0];
    await productPage.gotoProduct(testProduct.id);
    await productPage.addToCart();

    let cartCount = await productPage.getCartItemCount();
    expect(cartCount).toBe(1);

    await productPage.goBackToProducts();

    cartCount = await homePage.getCartItemCount();
    expect(cartCount).toBe(1);

    await productPage.gotoProduct(PRODUCTS[1].id);

    cartCount = await productPage.getCartItemCount();
    expect(cartCount).toBe(1);
  });

  test('should handle adding duplicate products', async ({ page }) => {
    const testProduct = PRODUCTS[0];

    await productPage.gotoProduct(testProduct.id);
    await productPage.addToCart();

    let cartCount = await productPage.getCartItemCount();
    expect(cartCount).toBe(1);

    // Dismiss banner to be able to click button again
    await productPage.dismissSuccessBanner();
    
    // Add the same product again - should increment quantity
    await productPage.addToCart();

    cartCount = await productPage.getCartItemCount();
    expect(cartCount).toBe(2);
  });
});

