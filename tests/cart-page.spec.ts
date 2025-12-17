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

  test('should display cart with all items and correct pricing', async ({ page }) => {
    const productsToAdd = [
      PRODUCTS[0],
      PRODUCTS[1],
      PRODUCTS[2],
    ];

    for (const product of productsToAdd) {
      await productPage.gotoProduct(product.id);
      await productPage.addToCart();
    }

    let cartCount = await productPage.getCartItemCount();
    expect(cartCount).toBe(3);

    await cartPage.goToCart();

    await cartPage.verifyPageLoaded();

    await expect(cartPage.pageHeading).toBeVisible();
    await expect(cartPage.pageHeading).toHaveText('Shopping Cart');

    const cartItemsCount = await cartPage.getCartItemCount();
    expect(cartItemsCount).toBe(3);

    for (const product of productsToAdd) {
      await cartPage.verifyProductInCart(product.name, product.price);

      const nameHeading = cartPage.getCartItemNameHeading(product.name);
      await expect(nameHeading).toBeVisible();
      await expect(nameHeading).toHaveText(product.name);

      const cartItem = cartPage.getCartItemByName(product.name);
      await expect(cartItem).toContainText(`$${product.price.toFixed(2)}`);
      await expect(cartItem).toContainText('x 1');

      const removeButton = cartPage.getRemoveButton(product.name);
      await expect(removeButton).toBeVisible();
    }

    const expectedTotal = productsToAdd.reduce((sum, p) => sum + p.price, 0);
    const totalText = await cartPage.getTotalPrice();
    expect(totalText).toContain(`$${expectedTotal.toFixed(2)}`);

    await expect(cartPage.clearCartButton).toBeVisible();

    await expect(cartPage.continueShoppingLink).toBeVisible();

    await expect(page).toHaveScreenshot('cart-page-with-items.png', { fullPage: true });
  });

  test('should display empty cart state', async ({ page }) => {
    await cartPage.goto();

    await cartPage.verifyEmptyCart();

    await expect(cartPage.continueShoppingLink).toBeVisible();

    await expect(page).toHaveScreenshot('cart-page-empty.png', { fullPage: true });
  });

  test('should remove individual item from cart', async ({ page }) => {
    const productsToAdd = [PRODUCTS[0], PRODUCTS[1]];

    for (const product of productsToAdd) {
      await productPage.gotoProduct(product.id);
      await productPage.addToCart();
    }

    await cartPage.goToCart();

    let itemsCount = await cartPage.getCartItemCount();
    expect(itemsCount).toBe(2);

    await cartPage.removeItem(PRODUCTS[0].name);

    itemsCount = await cartPage.getCartItemCount();
    expect(itemsCount).toBe(1);

    await expect(cartPage.getCartItemByName(PRODUCTS[0].name)).toBeHidden();
    await expect(cartPage.getCartItemByName(PRODUCTS[1].name)).toBeVisible();

    const cartCount = await cartPage.getCartItemCount();
    expect(cartCount).toBe(1);
  });

  test('should clear all items from cart', async ({ page }) => {
    const productsToAdd = [PRODUCTS[0], PRODUCTS[1], PRODUCTS[2]];

    for (const product of productsToAdd) {
      await productPage.gotoProduct(product.id);
      await productPage.addToCart();
    }

    await cartPage.goToCart();

    let itemsCount = await cartPage.getCartItemCount();
    expect(itemsCount).toBe(3);

    await cartPage.clearCart();

    await cartPage.verifyEmptyCart();

    const cartCount = await cartPage.getCartItemCount();
    expect(cartCount).toBe(0);
  });

  test('should navigate back to homepage via "Continue Shopping" link', async ({ page }) => {
    await productPage.gotoProduct(PRODUCTS[0].id);
    await productPage.addToCart();
    await cartPage.goToCart();

    await cartPage.continueShopping();

    await expect(page).toHaveURL('/');
    await homePage.verifyPageLoaded();
  });

  test('should display correct total for various quantities', async ({ page }) => {
    const testProduct = PRODUCTS[0];
    const quantity = 3;

    for (let i = 0; i < quantity; i++) {
      await productPage.gotoProduct(testProduct.id);
      await productPage.addToCart();
      await page.waitForTimeout(500);
    }

    await cartPage.goToCart();

    const itemsCount = await cartPage.getCartItemCount();
    expect(itemsCount).toBeGreaterThan(0);

    await expect(cartPage.getCartItemByName(testProduct.name)).toBeVisible();

    const expectedTotal = testProduct.price * quantity;
    const totalText = await cartPage.getTotalPrice();
    expect(totalText).toContain(`$${expectedTotal.toFixed(2)}`);
  });

  test('should display cart with all 8 products', async ({ page }) => {
    for (const product of PRODUCTS) {
      await productPage.gotoProduct(product.id);
      await productPage.addToCart();
    }

    await cartPage.goToCart();

    const itemsCount = await cartPage.getCartItemCount();
    expect(itemsCount).toBe(8);

    const expectedTotal = PRODUCTS.reduce((sum, p) => sum + p.price, 0);
    const totalText = await cartPage.getTotalPrice();
    expect(totalText).toContain(`$${expectedTotal.toFixed(2)}`);

    await expect(page).toHaveScreenshot('cart-page-all-products.png', { fullPage: true });
  });
});

