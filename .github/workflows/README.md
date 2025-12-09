# GitHub Actions Workflow Setup

## Playwright Tests Workflow

The `playwright.yml` workflow runs end-to-end tests using Playwright against the visual-testing application.

## Required GitHub Secrets

Before the workflow can run successfully, you need to configure the following secrets in your GitHub repository:

### Setting Up Secrets

1. Go to your GitHub repository
2. Click on **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add the following secrets:

#### Required Secrets

| Secret Name | Description | Example |
|------------|-------------|---------|
| `SUPABASE_URL` | Your Supabase project URL | `https://xxxxxxxxxxxxx.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key (secret) | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

### How to Get Supabase Credentials

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in and select your project
3. Go to **Settings** → **API**
4. Copy the following:
   - **URL**: This is your `SUPABASE_URL`
   - **service_role key**: This is your `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep this secret!)

## Workflow Overview

The workflow performs the following steps:

1. **Checkout code**: Gets the latest code from the repository
2. **Setup Node.js**: Installs Node.js LTS version
3. **Install dependencies**: Installs dependencies for root, frontend, and backend
4. **Build**: Compiles TypeScript for both frontend and backend
5. **Start servers**: Runs backend (port 4000) and frontend (port 3000) in background
6. **Health checks**: Waits for servers to be ready
7. **Install Playwright**: Installs Playwright browsers
8. **Run tests**: Executes Playwright tests
9. **Upload reports**: Saves test results as artifacts (even if tests fail)

## Workflow Triggers

The workflow runs on:
- Push to `main` or `master` branch
- Pull requests targeting `main` or `master` branch

## Testing Locally

To test that your setup works before pushing to GitHub:

```bash
# Install all dependencies
npm ci
cd frontend && npm ci && cd ..
cd backend && npm ci && cd ..

# Build the projects
cd backend && npm run build && cd ..
cd frontend && npm run build && cd ..

# Set environment variables (create .env file in root)
export SUPABASE_URL=your_supabase_url
export SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
export PORT=4000

# Start backend (in one terminal)
cd backend && npm run start

# Start frontend (in another terminal)
cd frontend && npm run preview -- --port 3000

# Run Playwright tests (in a third terminal)
npx playwright test
```

## Viewing Test Results

After the workflow runs:

1. Go to the **Actions** tab in your GitHub repository
2. Click on the workflow run
3. Scroll down to **Artifacts**
4. Download `playwright-report` to view detailed test results

## Troubleshooting

### Workflow fails with "Connection refused"
- Make sure the Supabase secrets are correctly configured
- Check that the backend can connect to your Supabase database

### Tests fail to find elements
- Make sure the frontend is building correctly
- Verify that the tests in `tests/` directory are using the correct selectors
- Update the `example.spec.ts` to test your actual application instead of playwright.dev

### Backend fails to start
- Ensure your Supabase project is active and accessible
- Verify that the schema and seed SQL files have been run on your Supabase database

## Next Steps

1. **Configure GitHub Secrets** as described above
2. **Update test files** in `tests/` directory to test your actual application
3. **Push changes** to trigger the workflow
4. **Monitor** the workflow execution in the Actions tab

