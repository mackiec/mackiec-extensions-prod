# Thank You Announcement Extension

A Shopify checkout UI extension that displays customizable announcement messages on the Thank You page after a customer completes their purchase.

## Features

- **Customizable Announcement Messages**: Merchants can configure the message type (info, success, warning, critical), title, and content
- **Order Details Display**: Optionally show order reference number and total amount
- **Customer Survey**: Optional survey prompt asking customers how they heard about the store
- **Multi-language Support**: Includes English and French translations
- **Post-Purchase Targeting**: Specifically targets the `purchase.thank-you.announcement.render` extension point

## Extension Settings

Merchants can configure the following settings in the Shopify admin:

- **Message Type**: Choose from info, success, warning, or critical banner styles
- **Announcement Title**: Custom title for the thank you message
- **Announcement Message**: Main message content displayed to customers
- **Show Order Details**: Toggle to display order number and total
- **Enable Survey Prompt**: Toggle to show customer survey about store discovery

## Configuration

This extension targets the `purchase.thank-you.announcement.render` extension point, which appears in the announcement section of the Thank You page after a customer completes their purchase.

### Extension Structure
```
thank-you-announcement/
├── src/
│   └── Checkout.jsx          # Main React component
├── locales/
│   ├── en.default.json       # English translations
│   └── fr.json              # French translations
├── shopify.extension.toml    # Extension configuration
└── README.md                # This file
```

## Usage

1. The extension automatically appears on the Thank You page after purchase completion
2. Merchants can customize the announcement through the Shopify admin checkout editor
3. If the survey is enabled, customers can provide feedback about store discovery
4. The extension respects the store's language settings for internationalization

## Development

This extension uses:
- `@shopify/ui-extensions-react/checkout` for UI components
- React hooks for state management
- Shopify's settings API for merchant configuration
- Shopify's order API for accessing purchase information

The extension is designed to be non-intrusive and enhance the post-purchase experience without interfering with other checkout functionality.