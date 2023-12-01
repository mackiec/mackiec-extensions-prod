# Demo Application - Shopify Checkout Extensibility

This is a personal project that combines multiple Checkout Extensions into a single app, some are boilerplate code from the public Tutorials (eg. a custom banner), while some are more featured (eg. a VAT custom field that features 9-digit validation that blocks checkout progress.)

## Getting started

Clone this repo and modify the extensions as desired to fit any custom use cases.

### Usage Requirements

1. You must [download and install Node.js](https://nodejs.org/en/download/) if you don't already have it.
1. You should [create a Shopify partner account](https://partners.shopify.com/signup) if you don’t have one.
1. You should create a store for testing if you don't have one, either a [development store](https://help.shopify.com/en/partners/dashboard/development-stores#create-a-development-store) or a [Shopify Plus sandbox store](https://help.shopify.com/en/partners/dashboard/managing-stores/plus-sandbox-store).

#### Local Development

[The Shopify CLI](https://shopify.dev/docs/apps/tools/cli) connects to an app in your Partners dashboard. It provides environment variables and runs commands in parallel..

You can develop locally using your preferred package manager. Run one of the following commands from the root of your app.

Using yarn:

```shell
yarn dev
```

Using npm:

```shell
npm run dev
```

Using pnpm:

```shell
pnpm run dev
```

Open the URL generated in your console. Once you grant permission to the app, you can start development (such as generating extensions).

## Developer resources

- [Introduction to Shopify apps](https://shopify.dev/docs/apps/getting-started)
- [App authentication](https://shopify.dev/docs/apps/auth)
- [Shopify CLI](https://shopify.dev/docs/apps/tools/cli)
- [Shopify API Library documentation](https://github.com/Shopify/shopify-api-js#readme)