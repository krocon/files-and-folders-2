# Files and Folders 2

**Coming soon. Work in progress!**

A monorepo project with Angular 20 frontend and NestJS backend.

## Project Structure

- `apps/fnf`: Angular 20 frontend application
- `apps/fnf-api`: NestJS backend API
- `libs/fnf-data`: Shared library with common models and utilities

## Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

## Getting Started

### Install Dependencies

```bash
pnpm install:all
```

This will install dependencies for the root project and all packages.

### Build

```bash
pnpm build
```

This will build the shared library, Angular frontend, and NestJS backend in the correct order.

### Run Applications

#### Start Angular Frontend

```bash
pnpm start:fnf
```

The Angular application will be available at http://localhost:4200.

#### Start NestJS Backend

```bash
pnpm start:fnf-api
```

The NestJS API will be available at http://localhost:3000.

### Testing

```bash
pnpm test
```

This will run tests for all packages.

## Development

### Shared Library

The shared library contains common models and utilities that can be used by both the frontend and backend applications.

To build the shared library:

```bash
pnpm build:fnf-domain
```

### Angular Frontend

The Angular frontend is located in `apps/fnf`. It's built with Angular 19 and uses the shared library.

To build the Angular frontend:

```bash
pnpm build:fnf
```

### NestJS Backend

The NestJS backend is located in `apps/fnf-api`. It's built with the latest version of NestJS and uses the shared library.

To build the NestJS backend:

```bash
pnpm build:fnf-api
```







## Deployment

To deploy this project to GitHub, a GitHub Actions workflow has been set up. The workflow uses an SSH deployment key to push changes to the GitHub repository.

### Setting up GitHub Secrets

Before the deployment workflow can work, you need to set up the following secrets in your GitHub repository:

1. **DEPLOY_KEY**: The private SSH key for deployment
   - Copy the contents of the `fnf2` file
   - Go to your GitHub repository > Settings > Secrets and variables > Actions
   - Click "New repository secret"
   - Name: `DEPLOY_KEY`
   - Value: *paste the contents of the fnf2 file*

2. **GITHUB_REPO_URL**: The SSH URL of your GitHub repository
   - Format: `git@github.com:username/repository.git`
   - Go to your GitHub repository > Settings > Secrets and variables > Actions
   - Click "New repository secret"
   - Name: `GITHUB_REPO_URL`
   - Value: *your repository's SSH URL*

### Adding the Deployment Key to GitHub

You also need to add the public key as a deploy key in your GitHub repository:

1. Go to your GitHub repository > Settings > Deploy keys
2. Click "Add deploy key"
3. Title: `Deployment Key`
4. Key: *paste the contents of the fnf2.pub file*
5. Check "Allow write access"
6. Click "Add key"

Once these steps are completed, the GitHub Actions workflow will be able to push changes to your repository.




