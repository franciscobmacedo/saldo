# Saldo Documentation

This is the documentation site for **Saldo** - a Portuguese salary calculator library built with TypeScript.

## About

The documentation is built using [Next.js](https://nextjs.org/) and [Nextra](https://nextra.site/), providing a modern and interactive documentation experience for the Saldo library.

## Local Development

### Prerequisites

- Node.js (v18 or higher)
- pnpm

### Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. **For local development**, update the `saldo` dependency in `package.json` to use the local version:
   ```json
   {
     "dependencies": {
       "saldo": "file:../"
     }
   }
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building

To build the documentation for production:

```bash
pnpm build
```

This will:
1. Build the Next.js application
2. Generate the search index using Pagefind

### Starting Production Server

After building, you can start the production server:

```bash
pnpm start
```

## Project Structure

- `src/app/` - Next.js app router pages
- `src/components/` - React components including the salary simulator
- `src/content/` - MDX documentation content
- `public/` - Static assets

## Features

- 📚 Comprehensive API documentation
- 🧮 Interactive salary simulator
- 🗺️ Tax situations and regional variations
- 🍽️ Lunch allowance calculations
- 🔍 Full-text search (powered by Pagefind)
- 📱 Mobile-responsive design

## Contributing

When making changes to the documentation:

1. Ensure the local development setup is working correctly
2. Test the interactive components
3. Verify that the build process completes successfully
4. Check that search functionality works after building
