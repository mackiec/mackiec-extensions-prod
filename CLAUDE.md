# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Architecture

This is a Shopify app containing multiple checkout extensions organized as a monorepo with workspaces. The project combines both UI extensions (React components that modify the checkout interface) and Function extensions (serverless functions that modify checkout behavior).

### Repository Structure

```
├── shopify.app.toml           # App configuration
├── package.json               # Root package with workspace configuration  
├── extensions/                # All extensions as separate workspaces
│   ├── [extension-name]/      # Individual extension directories
│   │   ├── src/               # Extension source code
│   │   ├── shopify.extension.toml  # Extension configuration
│   │   ├── package.json       # Extension dependencies (functions only)
│   │   └── locales/           # Translation files
└── web/                       # App backend (if present)
```

### Extension Types

**UI Extensions** (React-based):
- Modify the checkout interface using `@shopify/ui-extensions-react`
- Main source file: `src/Checkout.jsx`
- Use Shopify's UI components and extension points
- Examples: custom-banner, gift-packaging, delivery-date-ext

**Function Extensions** (TypeScript/JavaScript):
- Serverless functions that run during checkout
- Main source files: `src/*.ts` for logic, `src/*.graphql` for queries
- Use `@shopify/shopify_function` library
- Examples: update-line-item-js, custom-discount-function

## Development Commands

### Root Level Commands
```bash
npm run dev          # Start development server for all extensions
npm run build        # Build all extensions
npm run generate     # Generate new extension using Shopify CLI
npm run deploy       # Deploy app to Shopify Partners
npm run info         # Display app information
```

### Function Extension Commands
Functions have individual package.json files with specific commands:

```bash
# Navigate to function directory first
cd extensions/[function-name]

npm run typegen      # Generate TypeScript types from GraphQL schema
npm run build        # Build function to WebAssembly
npm run test         # Run test suite with vitest
npm run test:watch   # Run tests in watch mode
npm run preview      # Test function locally with sample input
```

### Testing Functions
Functions use vitest for testing. Test files are located alongside source files with `.test.ts` suffix. To run a single test:

```bash
cd extensions/[function-name]
npm run test -- --run src/specific-file.test.ts
```

## Key Development Patterns

### UI Extensions Configuration
Extensions are configured via `shopify.extension.toml` with targeting points like:
- `purchase.checkout.block.render`
- `purchase.checkout.delivery-address.render-before` 
- `purchase.checkout.shipping-option-list.render-after`

Settings are defined in the extension configuration and accessed in React components via the `useSettings()` hook.

### Function Extensions Architecture
Function extensions follow a specific structure:
- **GraphQL Queries** (`src/*.graphql`): Define input data structure
- **TypeScript Logic** (`src/*.ts`): Implement business logic
- **Generated Types** (`generated/api.ts`): Auto-generated from GraphQL schema
- **Configuration via Metafields**: Use `discount.metafield(namespace: "$app", key: "config")` pattern

### Metafield Integration
Both UI and Function extensions extensively use metafields for:
- Configuration storage (namespace: `$app`)
- Customer data persistence
- Product-specific settings
- Conditional logic triggers

### Multi-language Support
Extensions support internationalization via `locales/` directory with JSON files (e.g., `en.default.json`, `fr.json`).

## Extension Development Workflows

### Creating New UI Extensions
1. Use `npm run generate` and select checkout UI extension
2. Configure targeting in `shopify.extension.toml`
3. Implement React component in `src/Checkout.jsx`
4. Add settings configuration and locales
5. Test with `npm run dev`

### Creating New Function Extensions  
1. Use `npm run generate` with appropriate function template (discount, cart-transform, etc.)
2. Define GraphQL input queries in `src/*.graphql`
3. Implement logic in TypeScript files
4. Add comprehensive test coverage
5. Use `npm run typegen` to generate types after GraphQL changes
6. Build with `npm run build` and test with `npm run preview`

### Debugging and Testing
- UI extensions: Use browser dev tools during `npm run dev`
- Functions: Use `npm run test` for unit tests, `npm run preview` for integration testing
- All extensions: Test in development store before deploying

## Important Configuration Files

- **shopify.app.toml**: App-level configuration including scopes (`write_discounts`, `write_products`, `write_orders`)
- **shopify.extension.toml**: Extension-specific configuration, targeting, and metadata
- **package.json**: Workspace configuration at root, individual dependencies for functions
- **schema.graphql**: Auto-generated GraphQL schema for functions (do not edit manually)