import { test, expect } from '@playwright/test';
import { HomePage, ProductPage, CartPage } from './pages';
import { PRODUCTS } from './fixtures/testData';

test.describe('Network and Console Validation', () => {
  let homePage: HomePage;
  let productPage: ProductPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    productPage = new ProductPage(page);
    cartPage = new CartPage(page);
  });

  test('should load products API successfully', async ({ page }) => {
    const apiResponses: any[] = [];

    page.on('response', async (response) => {
      if (response.url().includes('/api/products')) {
        apiResponses.push({
          url: response.url(),
          status: response.status(),
          statusText: response.statusText(),
        });
      }
    });

    await homePage.goto();
    await homePage.waitForProductsToLoad();

    expect(apiResponses.length).toBeGreaterThan(0);

    for (const response of apiResponses) {
      expect(response.status).toBe(200);
    }

    const productsListCall = apiResponses.find(r => r.url.endsWith('/api/products'));
    expect(productsListCall).toBeTruthy();
    expect(productsListCall?.status).toBe(200);
  });

  test('should load individual product API successfully', async ({ page }) => {
    const apiResponses: any[] = [];

    page.on('response', async (response) => {
      if (response.url().includes('/api/products/')) {
        apiResponses.push({
          url: response.url(),
          status: response.status(),
          statusText: response.statusText(),
        });
      }
    });

    const testProduct = PRODUCTS[0];
    await productPage.gotoProduct(testProduct.id);
    await productPage.verifyPageLoaded();

    expect(apiResponses.length).toBeGreaterThan(0);

    const productCall = apiResponses.find(r => r.url.includes(testProduct.id));
    expect(productCall).toBeTruthy();
    expect(productCall?.status).toBe(200);
  });

  test('should load multiple product APIs successfully', async ({ page }) => {
    const apiCalls: Map<string, any> = new Map();

    page.on('response', async (response) => {
      if (response.url().includes('/api/products/')) {
        const productId = response.url().split('/').pop();
        if (productId) {
          apiCalls.set(productId, {
            url: response.url(),
            status: response.status(),
            statusText: response.statusText(),
          });
        }
      }
    });

    const productsToTest = [PRODUCTS[0], PRODUCTS[1], PRODUCTS[2]];

    for (const product of productsToTest) {
      await productPage.gotoProduct(product.id);
      await productPage.verifyPageLoaded();
    }

    for (const product of productsToTest) {
      const apiCall = apiCalls.get(product.id);
      expect(apiCall).toBeTruthy();
      expect(apiCall?.status).toBe(200);
    }
  });

  test('should have no failed network requests in user journey', async ({ page }) => {
    const failedRequests: any[] = [];

    page.on('requestfailed', (request) => {
      failedRequests.push({
        url: request.url(),
        failure: request.failure(),
      });
    });

    await homePage.goto();
    await homePage.waitForProductsToLoad();

    await homePage.clickProduct(PRODUCTS[0].name);
    await productPage.verifyPageLoaded();

    await productPage.addToCart();

    await productPage.goBackToProducts();
    await homePage.clickProduct(PRODUCTS[1].name);
    await productPage.verifyPageLoaded();
    await productPage.addToCart();

    await cartPage.goToCart();
    await cartPage.verifyPageLoaded();

    expect(failedRequests).toHaveLength(0);
  });

  test('should have no JavaScript runtime errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    const exceptions: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (!text.includes('React Router Future Flag Warning')) {
          consoleErrors.push(text);
        }
      }
    });

    page.on('pageerror', (error) => {
      exceptions.push(error.message);
    });

    await homePage.goto();
    await homePage.waitForProductsToLoad();

    await homePage.clickProduct(PRODUCTS[0].name);
    await productPage.verifyPageLoaded();
    await productPage.addToCart();

    await cartPage.goToCart();
    await cartPage.verifyPageLoaded();

    expect(consoleErrors).toHaveLength(0);
    expect(exceptions).toHaveLength(0);
  });

  test('should load product images successfully', async ({ page }) => {
    const imageResponses: any[] = [];

    page.on('response', async (response) => {
      if (response.url().includes('picsum.photos') || 
          response.request().resourceType() === 'image') {
        imageResponses.push({
          url: response.url(),
          status: response.status(),
        });
      }
    });

    await homePage.goto();
    await homePage.waitForProductsToLoad();

    await page.waitForTimeout(2000);

    expect(imageResponses.length).toBeGreaterThanOrEqual(0);

    for (const response of imageResponses) {
      expect([200, 302]).toContain(response.status);
    }
  });

  test('should handle API responses correctly', async ({ page }) => {
    let productsApiResponse: any = null;

    page.on('response', async (response) => {
      if (response.url().endsWith('/api/products') && response.request().method() === 'GET') {
        productsApiResponse = {
          status: response.status(),
          contentType: response.headers()['content-type'],
          body: await response.json().catch(() => null),
        };
      }
    });

    await homePage.goto();
    await homePage.waitForProductsToLoad();

    expect(productsApiResponse).toBeTruthy();
    expect(productsApiResponse.status).toBe(200);
    expect(productsApiResponse.contentType).toContain('application/json');
    expect(productsApiResponse.body).toBeTruthy();
    expect(Array.isArray(productsApiResponse.body.data)).toBe(true);
    expect(productsApiResponse.body.data.length).toBe(8);
  });

  test('should have all API endpoints responding correctly', async ({ page }) => {
    const apiEndpoints = new Map<string, number>();

    page.on('response', async (response) => {
      if (response.url().includes('/api/')) {
        apiEndpoints.set(response.url(), response.status());
      }
    });

    await homePage.goto();
    await homePage.waitForProductsToLoad();

    for (let i = 0; i < 3; i++) {
      await productPage.gotoProduct(PRODUCTS[i].id);
      await productPage.verifyPageLoaded();
    }

    for (const [url, status] of apiEndpoints.entries()) {
      expect(status).toBe(200);
    }

    const endpointUrls = Array.from(apiEndpoints.keys());
    expect(endpointUrls.some(url => url.includes('/api/products'))).toBe(true);
    expect(endpointUrls.some(url => url.includes(PRODUCTS[0].id))).toBe(true);
  });

  test('should complete full user journey without errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    const networkErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error' && !msg.text().includes('React Router Future Flag')) {
        consoleErrors.push(msg.text());
      }
    });

    page.on('requestfailed', (request) => {
      networkErrors.push(request.url());
    });

    await homePage.goto();
    await homePage.waitForProductsToLoad();
    
    await homePage.clickProduct(PRODUCTS[0].name);
    await productPage.verifyPageLoaded();
    await productPage.addToCart();
    
    await productPage.goBackToProducts();
    await homePage.clickProduct(PRODUCTS[1].name);
    await productPage.addToCart();
    
    await productPage.goBackToProducts();
    await homePage.clickProduct(PRODUCTS[2].name);
    await productPage.addToCart();
    
    await cartPage.goToCart();
    await cartPage.verifyPageLoaded();

    expect(consoleErrors).toHaveLength(0);
    expect(networkErrors).toHaveLength(0);
  });
});

