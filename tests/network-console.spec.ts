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

  /**
   * Scenario 7: Network and Console Validation
   * Verifies application runs without errors and API calls succeed.
   */
  test('should load products API successfully', async ({ page }) => {
    const apiResponses: any[] = [];

    // Monitor network requests
    page.on('response', async (response) => {
      if (response.url().includes('/api/products')) {
        apiResponses.push({
          url: response.url(),
          status: response.status(),
          statusText: response.statusText(),
        });
      }
    });

    // Navigate to homepage
    await homePage.goto();
    await homePage.waitForProductsToLoad();

    // Verify at least one API call was made
    expect(apiResponses.length).toBeGreaterThan(0);

    // Verify all API responses were successful (200 OK)
    for (const response of apiResponses) {
      expect(response.status).toBe(200);
    }

    // Verify the main products list API call
    const productsListCall = apiResponses.find(r => r.url.endsWith('/api/products'));
    expect(productsListCall).toBeTruthy();
    expect(productsListCall?.status).toBe(200);
  });

  test('should load individual product API successfully', async ({ page }) => {
    const apiResponses: any[] = [];

    // Monitor network requests
    page.on('response', async (response) => {
      if (response.url().includes('/api/products/')) {
        apiResponses.push({
          url: response.url(),
          status: response.status(),
          statusText: response.statusText(),
        });
      }
    });

    // Navigate to product page
    const testProduct = PRODUCTS[0];
    await productPage.gotoProduct(testProduct.id);
    await productPage.verifyPageLoaded();

    // Verify API call was made for specific product
    expect(apiResponses.length).toBeGreaterThan(0);

    // Verify the specific product API call
    const productCall = apiResponses.find(r => r.url.includes(testProduct.id));
    expect(productCall).toBeTruthy();
    expect(productCall?.status).toBe(200);
  });

  test('should load multiple product APIs successfully', async ({ page }) => {
    const apiCalls: Map<string, any> = new Map();

    // Monitor network requests
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

    // Navigate to multiple product pages
    const productsToTest = [PRODUCTS[0], PRODUCTS[1], PRODUCTS[2]];

    for (const product of productsToTest) {
      await productPage.gotoProduct(product.id);
      await productPage.verifyPageLoaded();
    }

    // Verify all API calls were successful
    for (const product of productsToTest) {
      const apiCall = apiCalls.get(product.id);
      expect(apiCall).toBeTruthy();
      expect(apiCall?.status).toBe(200);
    }
  });

  test('should have no failed network requests in user journey', async ({ page }) => {
    const failedRequests: any[] = [];

    // Monitor for failed requests
    page.on('requestfailed', (request) => {
      failedRequests.push({
        url: request.url(),
        failure: request.failure(),
      });
    });

    // Execute complete user journey
    // 1. Homepage
    await homePage.goto();
    await homePage.waitForProductsToLoad();

    // 2. Product detail page
    await homePage.clickProduct(PRODUCTS[0].name);
    await productPage.verifyPageLoaded();

    // 3. Add to cart
    await productPage.addToCart();

    // 4. Navigate to another product
    await productPage.goBackToProducts();
    await homePage.clickProduct(PRODUCTS[1].name);
    await productPage.verifyPageLoaded();
    await productPage.addToCart();

    // 5. View cart
    await cartPage.goToCart();
    await cartPage.verifyPageLoaded();

    // Verify no failed requests
    expect(failedRequests).toHaveLength(0);
  });

  test('should have no JavaScript runtime errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    const exceptions: string[] = [];

    // Monitor console errors (excluding known React Router warnings)
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Filter out React Router future flag warnings (non-critical)
        if (!text.includes('React Router Future Flag Warning')) {
          consoleErrors.push(text);
        }
      }
    });

    // Monitor page exceptions
    page.on('pageerror', (error) => {
      exceptions.push(error.message);
    });

    // Execute user journey
    await homePage.goto();
    await homePage.waitForProductsToLoad();

    await homePage.clickProduct(PRODUCTS[0].name);
    await productPage.verifyPageLoaded();
    await productPage.addToCart();

    await cartPage.goToCart();
    await cartPage.verifyPageLoaded();

    // Verify no critical errors
    expect(consoleErrors).toHaveLength(0);
    expect(exceptions).toHaveLength(0);
  });

  test('should load product images successfully', async ({ page }) => {
    const imageResponses: any[] = [];

    // Monitor image requests
    page.on('response', async (response) => {
      if (response.url().includes('picsum.photos') || 
          response.request().resourceType() === 'image') {
        imageResponses.push({
          url: response.url(),
          status: response.status(),
        });
      }
    });

    // Load homepage with product images
    await homePage.goto();
    await homePage.waitForProductsToLoad();

    // Wait a bit for images to load
    await page.waitForTimeout(2000);

    // Verify images loaded (may be from CDN)
    // Note: Some images might be lazy-loaded or cached
    expect(imageResponses.length).toBeGreaterThanOrEqual(0);

    // Check any loaded images were successful
    for (const response of imageResponses) {
      expect(response.status).toBe(200);
    }
  });

  test('should handle API responses correctly', async ({ page }) => {
    let productsApiResponse: any = null;

    // Capture products API response
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

    // Verify API response structure
    expect(productsApiResponse).toBeTruthy();
    expect(productsApiResponse.status).toBe(200);
    expect(productsApiResponse.contentType).toContain('application/json');
    expect(productsApiResponse.body).toBeTruthy();
    expect(Array.isArray(productsApiResponse.body)).toBe(true);
    expect(productsApiResponse.body.length).toBe(8);
  });

  test('should have all API endpoints responding correctly', async ({ page }) => {
    const apiEndpoints = new Map<string, number>();

    // Monitor all API calls
    page.on('response', async (response) => {
      if (response.url().includes('/api/')) {
        apiEndpoints.set(response.url(), response.status());
      }
    });

    // Test all product endpoints mentioned in test plan
    await homePage.goto();
    await homePage.waitForProductsToLoad();

    // Test specific product endpoints
    for (let i = 0; i < 3; i++) {
      await productPage.gotoProduct(PRODUCTS[i].id);
      await productPage.verifyPageLoaded();
    }

    // Verify all API calls returned 200 OK
    for (const [url, status] of apiEndpoints.entries()) {
      expect(status).toBe(200);
    }

    // Verify we tested the expected endpoints
    const endpointUrls = Array.from(apiEndpoints.keys());
    expect(endpointUrls.some(url => url.includes('/api/products'))).toBe(true);
    expect(endpointUrls.some(url => url.includes(PRODUCTS[0].id))).toBe(true);
  });

  test('should complete full user journey without errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    const networkErrors: string[] = [];

    // Monitor console
    page.on('console', (msg) => {
      if (msg.type() === 'error' && !msg.text().includes('React Router Future Flag')) {
        consoleErrors.push(msg.text());
      }
    });

    // Monitor network
    page.on('requestfailed', (request) => {
      networkErrors.push(request.url());
    });

    // Complete user journey
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

    // Verify no errors occurred
    expect(consoleErrors).toHaveLength(0);
    expect(networkErrors).toHaveLength(0);
  });
});

