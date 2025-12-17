import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly pageHeading: Locator;
  readonly cartItems: Locator;
  readonly emptyCartMessage: Locator;
  readonly totalPriceElement: Locator;
  readonly clearCartButton: Locator;
  readonly continueShoppingLink: Locator;

  constructor(page: Page) {
    super(page);

    this.pageHeading = page.getByRole('heading', { name: 'Shopping Cart', level: 1 });
    this.cartItems = page.getByRole('listitem');
    this.emptyCartMessage = page.getByText(/your cart is empty/i);
    this.totalPriceElement = page.locator('.cart-total, .total-price').or(
      page.getByText(/total:/i).locator('xpath=following-sibling::*')
    );
    this.clearCartButton = page.getByRole('button', { name: /remove all items from cart/i });
    this.continueShoppingLink = page.getByRole('link', { name: /continue shopping/i });
  }

  async goto() {
    await this.page.goto('/cart');
    await this.page.waitForLoadState('networkidle');
  }

  getCartItems(): Locator {
    return this.cartItems;
  }

  getCartItemByName(productName: string): Locator {
    return this.page.getByRole('listitem').filter({ hasText: productName });
  }

  getCartItemNameHeading(productName: string): Locator {
    return this.getCartItemByName(productName).getByRole('heading', { level: 2 });
  }

  getRemoveButton(productName: string): Locator {
    return this.getCartItemByName(productName).getByRole('button', { name: /remove/i });
  }

  getCartItemPrice(productName: string): Locator {
    return this.getCartItemByName(productName).locator('.item-price, .price');
  }

  async removeItem(productName: string) {
    await this.getRemoveButton(productName).click();
  }

  async clearCart() {
    await this.clearCartButton.click();
  }

  async continueShopping() {
    await this.continueShoppingLink.click();
    await this.page.waitForURL('/');
  }

  async getTotalPrice(): Promise<string> {
    // Target the cart total specifically (the strong element in the total paragraph)
    const totalElement = await this.page.locator('p:has-text("Total:") strong').textContent();
    return totalElement || '';
  }

  async verifyPageLoaded() {
    await expect(this.pageHeading).toBeVisible();
    await expect(this.continueShoppingLink).toBeVisible();
  }

  async verifyEmptyCart() {
    await expect(this.emptyCartMessage).toBeVisible();
  }

  async verifyProductInCart(productName: string, price: number) {
    const cartItem = this.getCartItemByName(productName);
    await expect(cartItem).toBeVisible();
    
    const nameHeading = this.getCartItemNameHeading(productName);
    await expect(nameHeading).toHaveText(productName);
    
    const priceText = `$${price.toFixed(2)}`;
    await expect(cartItem).toContainText(priceText);
  }

  async getAllCartProductNames(): Promise<string[]> {
    const headings = this.cartItems.getByRole('heading', { level: 2 });
    return await headings.allTextContents();
  }
}

