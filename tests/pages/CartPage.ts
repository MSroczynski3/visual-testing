import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object Model for the Shopping Cart Page
 * Contains locators and methods for interacting with the cart page.
 */
export class CartPage extends BasePage {
  // Page-specific elements
  readonly pageHeading: Locator;
  readonly cartItems: Locator;
  readonly emptyCartMessage: Locator;
  readonly totalPriceElement: Locator;
  readonly clearCartButton: Locator;
  readonly continueShoppingLink: Locator;

  constructor(page: Page) {
    super(page);

    // Cart page locators
    this.pageHeading = page.getByRole('heading', { name: 'Shopping Cart', level: 1 });
    this.cartItems = page.getByRole('article');
    this.emptyCartMessage = page.getByText(/your cart is empty/i);
    this.totalPriceElement = page.locator('.cart-total, .total-price').or(
      page.getByText(/total:/i).locator('xpath=following-sibling::*')
    );
    this.clearCartButton = page.getByRole('button', { name: /clear cart/i });
    this.continueShoppingLink = page.getByRole('link', { name: /continue shopping/i });
  }

  /**
   * Navigate to cart page
   */
  async goto() {
    await this.page.goto('/cart');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get all cart item elements
   */
  getCartItems(): Locator {
    return this.cartItems;
  }

  /**
   * Get count of items in cart
   */
  async getCartItemsCount(): Promise<number> {
    return await this.cartItems.count();
  }

  /**
   * Get a specific cart item by product name
   */
  getCartItemByName(productName: string): Locator {
    return this.page.getByRole('article').filter({ hasText: productName });
  }

  /**
   * Get the product name heading for a cart item
   */
  getCartItemNameHeading(productName: string): Locator {
    return this.getCartItemByName(productName).getByRole('heading', { level: 2 });
  }

  /**
   * Get the remove button for a specific cart item
   */
  getRemoveButton(productName: string): Locator {
    return this.getCartItemByName(productName).getByRole('button', { name: /remove/i });
  }

  /**
   * Get the price display for a cart item (includes quantity and subtotal)
   */
  getCartItemPrice(productName: string): Locator {
    return this.getCartItemByName(productName).locator('.item-price, .price');
  }

  /**
   * Remove an item from the cart
   */
  async removeItem(productName: string) {
    await this.getRemoveButton(productName).click();
  }

  /**
   * Clear all items from cart
   */
  async clearCart() {
    await this.clearCartButton.click();
  }

  /**
   * Navigate back to shopping
   */
  async continueShopping() {
    await this.continueShoppingLink.click();
    await this.page.waitForURL('/');
  }

  /**
   * Get the total price from the cart
   */
  async getTotalPrice(): Promise<string> {
    // Try multiple strategies to find the total
    const totalText = await this.page.locator('text=/total:?/i').first().textContent();
    const match = totalText?.match(/\$?(\d+\.?\d*)/);
    return match ? match[0] : '';
  }

  /**
   * Verify cart page has loaded correctly
   */
  async verifyPageLoaded() {
    await expect(this.pageHeading).toBeVisible();
    await expect(this.continueShoppingLink).toBeVisible();
  }

  /**
   * Verify cart is empty
   */
  async verifyEmptyCart() {
    await expect(this.emptyCartMessage).toBeVisible();
  }

  /**
   * Verify specific product is in cart with correct details
   */
  async verifyProductInCart(productName: string, price: number) {
    const cartItem = this.getCartItemByName(productName);
    await expect(cartItem).toBeVisible();
    
    const nameHeading = this.getCartItemNameHeading(productName);
    await expect(nameHeading).toHaveText(productName);
    
    // Verify price is mentioned somewhere in the cart item
    const priceText = `$${price.toFixed(2)}`;
    await expect(cartItem).toContainText(priceText);
  }

  /**
   * Get all product names in the cart
   */
  async getAllCartProductNames(): Promise<string[]> {
    const headings = this.cartItems.getByRole('heading', { level: 2 });
    return await headings.allTextContents();
  }
}

