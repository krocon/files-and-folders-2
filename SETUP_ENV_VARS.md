# Setting Up Environment Variables in WebStorm

This guide explains how to set up environment variables in WebStorm so that sensitive information like API keys is not
checked into version control.

## Method 1: Using a .env File (Recommended)

1. Copy the `.env.example` file to a new file named `.env` in the project root:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file and replace the placeholder values with your actual API keys:
   ```
   FNF_OPENAI_API_KEY=your_actual_api_key_here
   ```

3. The `.env` file is already included in `.gitignore`, so it won't be committed to version control.

4. Make sure your application is set up to load environment variables from the `.env` file. If you're using NestJS, it
   should already be configured to do this.

## Method 2: Setting Environment Variables in WebStorm Run Configuration

If you prefer to set environment variables directly in WebStorm:

1. Open your project in WebStorm.
2. Click on the dropdown menu near the run button (top right) and select "Edit Configurations...".
3. Select your run configuration or create a new one.
4. In the "Environment variables" field, add:
   ```
   FNF_OPENAI_API_KEY=your_actual_api_key_here
   ```
5. Click "Apply" and "OK".

## Method 3: Using .env Files with Different Environments

For more complex setups with multiple environments:

1. Create environment-specific .env files:
    - `.env.development` for development
    - `.env.production` for production
    - `.env.test` for testing

2. Add these files to `.gitignore` if they're not already included.

3. Configure your application to load the appropriate .env file based on the current environment.

## Important Notes

- Never commit API keys or other sensitive information to version control.
- The environment files in the codebase (`environment.ts` and `environment.prod.ts`) are already set up to use the
  `FNF_OPENAI_API_KEY` environment variable.
- If the environment variable is not set, the application will fall back to a placeholder value, which won't work with
  the actual OpenAI API.