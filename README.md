# 🛍️ Shopify Extensions Collection

This is a comprehensive project that combines multiple Shopify Extensions into a single app, including Checkout UI Extensions, Admin UI Extensions, and Shopify Functions. The collection ranges from simple boilerplate code (e.g., a custom banner) to advanced functionality (e.g., custom discount functions with admin interfaces).

## 🚀 Getting Started

Clone this repo and modify the extensions as desired to fit any custom use cases.

### 📋 Prerequisites

1. You must [download and install Node.js](https://nodejs.org/en/download/) if you don't already have it.
2. You should [create a Shopify partner account](https://partners.shopify.com/signup) if you don't have one.
3. You should create a store for testing if you don't have one, either a [development store](https://help.shopify.com/en/partners/dashboard/development-stores#create-a-development-store) or a [Shopify Plus sandbox store](https://help.shopify.com/en/partners/dashboard/managing-stores/plus-sandbox-store).

### 💻 Local Development

[The Shopify CLI](https://shopify.dev/docs/apps/tools/cli) connects to an app in your Partners dashboard. It provides environment variables and runs commands in parallel.

You can develop locally using your preferred package manager. Run one of the following commands from the root of your app:

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

Open the URL generated in your console. Once you grant permission to the app, you can start development.

## 🧩 Extensions Overview

This project includes the following extensions:

### Checkout UI Extensions

These extensions modify the checkout UI to enhance the customer experience:

1. **🏷️ Custom Banner**
   - Displays a customizable banner in the checkout flow
   - Configurable title, description, and status
   - Can be set as collapsible or fixed

2. **📝 Custom Content Block**
   - Creates a customizable content block
   - Supports title, description, image, and icon
   - Can be configured as collapsible or fixed
   - Supports multi-line descriptions

3. **📦 Custom Delivery Note**
   - Adds delivery note functionality to the checkout
   - Allows customers to add special delivery instructions
   - Conditionally shown only when Address 2 field is populated

4. **✅ Custom Field Validation**
   - Adds custom validation fields to the checkout
   - Supports age verification (with configurable minimum age)
   - Supports VAT number validation
   - Can block checkout progress if validation fails

5. **💾 Custom Stored Selection**
   - Allows customers to save their selections for future checkouts
   - Persists customer preferences

6. **📅 Delivery Date Extension**
   - Adds a date picker for selecting preferred delivery dates
   - Configurable date range blocking (eg. cannot pick next 2 days or weekend)
   - Stores selection as order metafield

7. **🎁 Gift Packaging**
   - Adds gift packaging options to checkout
   - Supports gift message, sender's name, and recipient's name
   - Allows selection between different packaging options
   - Includes customizable images for packaging options

8. **📋 Line Item Details**
   - Displays additional details for line items in the cart
   - Enhances product information display

9. **🛒 Pre-Purchase Extension**
   - Adds functionality to add a pre-configured item to the checkout during checkout

10. **🎨 Product Customizer UI**
    - Allows customers to customize products during checkout
    - Supports various customization options

11. **🔍 Cart Attributes Debugger**
    - Development tool for debugging cart attributes
    - Displays all cart attributes applied to the checkout
    - Shows key-value pairs for easy review
    - Useful for testing and development

12. **📦 Custom Packaging Display**
    - Displays selected packaging options with images
    - Shows sample products included in packages
    - Displays gift messages when provided
    - Supports up to 3 packaging options with custom images
    - Fetches product information via GraphQL API

13. **🛍️ Sample Products Auto-add**
    - Extension for automatically adding sample products
    - Configurable sample product selection
    - Integrates with checkout flow

### Function Extensions

These extensions modify the behavior of the checkout without changing the UI:

1. **💰 Update Line Item Function**
   - Modifies cart line item prices based on conditions
   - Supports special pricing for members
   - Applies markups for customized products
   - Handles currency conversion

2. **💸 Custom Discount Function**
   - Advanced discount function with configurable parameters
   - Supports both order-level and product-level discounts
   - Configurable discount percentages and messages
   - Integrates with metafield configuration system
   - Supports cart line discounts and delivery option discounts

### Admin UI Extensions

These extensions provide merchant-facing interfaces in the Shopify Admin:

1. **⚙️ Custom Discount Configuration**
   - Admin interface for configuring the custom discount function
   - Form validation and real-time preview
   - Configurable discount percentages (0-100%)
   - Custom discount messages
   - Automatic metafield management via FunctionSettings component
   - Integrated with discount function settings page

## 🎨 Styling and Customization Options

Many extensions in this collection support customization of appearance through their settings files. These options allow you to adjust text sizes, colors, and styles to match your store's branding.

### Text Sizing Options

- **title_size**: Adjust the size of titles in components
  - Available options: "small", "medium", "large", "extraLarge" (varies by extension)
  - Example extensions: Custom Banner, Custom Content Block

- **description_size**: Adjust the size of description text
  - Available options: "small", "base", "medium", "large"
  - Example extension: Custom Banner

### Appearance and Color Options

- **background_appearance**: Change the background style of components
  - Available options: "transparent", "base", "subdued"
  - Example extensions: Gift Packaging, Custom Delivery Note, Delivery Date Extension

- **icon_appearance**: Style icons within components
  - Available options: "base", "accent", "decorative", "interactive", "subdued", "info", "success", "warning", "critical", "monochrome"
  - Example extensions: Custom Content Block, Gift Packaging, Custom Delivery Note

- **text_appearance**: Adjust the color and style of text
  - Available options: "base", "accent", "decorative", "interactive", "subdued", "info", "success", "warning", "critical", "monochrome"
  - Example extensions: Gift Packaging, Custom Delivery Note, Delivery Date Extension

- **status**: Set the overall style/status of a component (primarily for banners)
  - Available options: "info", "success", "warning", "critical"
  - Example extension: Custom Banner

## 📚 Detailed Extension Documentation

### 🏷️ Custom Banner

**Description:**
A simple extension that displays a customizable banner in the checkout flow. The banner can be configured with a title, description, and status (info, warning, error, success).

**Configuration Options:**
- `title`: The title of the banner
- `description`: The description text
- `collapsible`: Whether the banner can be collapsed
- `status`: The status/style of the banner (info, warning, error, success)
- `title_size`: The size of the title text (small, medium, large, extraLarge)
- `description_size`: The size of the description text (small, base, medium, large)

**Usage:**
The banner can be displayed at various points in the checkout flow. By default, it targets `purchase.checkout.block.render` and `purchase.checkout.delivery-address.render-before`.

### 📝 Custom Content Block

**Description:**
Creates a customizable content block that can display text, images, and icons. The block can be configured to be collapsible or fixed.

**Configuration Options:**
- `title`: The title of the content block
- `description`: The description text (supports multi-line)
- `image`: An optional image to display
- `icon`: An optional icon to display
- `is_collapsible`: Whether the block can be collapsed
- `title_size`: The size of the title text (small, medium, large)
- `icon_appearance`: The appearance style of the icon (base, accent, decorative, interactive, subdued, info, success, warning, critical, monochrome)

**Usage:**
The content block can be added to the checkout flow to provide additional information or instructions to customers.

### ✅ Custom Field Validation

**Description:**
Adds custom validation fields to the checkout process. It can validate age requirements or VAT numbers, and can block checkout progress if the validation fails.

**Configuration Options:**
- `ageTarget`: The minimum age required (default: 18)
- `fieldTitle`: The title of the validation field
- `showVatNumberField`: Whether to show a VAT number field instead of age

**Usage:**
This extension can be used to enforce age restrictions for certain products or to collect and validate VAT numbers for business customers.

### 📦 Custom Delivery Note

**Description:**
Adds delivery note functionality to the checkout. It allows customers to add special delivery instructions and is conditionally shown only when Address 2 field is populated.

**Configuration Options:**
- `title`: The title for the delivery note section
- `description`: The description text
- `checkbox_text`: Text to display next to the checkbox
- `text_field_label`: Label for the text field
- `background_appearance`: The background style (transparent, base, subdued)
- `icon_appearance`: The appearance style of the icon (base, accent, decorative, interactive, subdued, info, success, warning, critical, monochrome)
- `text_appearance`: The appearance style of the text (base, accent, decorative, interactive, subdued, info, success, warning, critical, monochrome)

**Usage:**
This extension adds a delivery note section to the checkout, allowing customers to provide special instructions for delivery.

### 📅 Delivery Date Extension

**Description:**
Adds a date picker to the checkout process, allowing customers to select a preferred delivery date. It checks if products have a specific metafield to determine whether to show the date picker.

**Configuration Options:**
- `title`: The title for the date picker section
- `description`: The description text
- `background_appearance`: The background style (transparent, base, subdued)
- `icon_appearance`: The appearance style of the icon (base, accent, decorative, interactive, subdued, info, success, warning, critical, monochrome)
- `text_appearance`: The appearance style of the text (base, accent, decorative, interactive, subdued, info, success, warning, critical, monochrome)

**Usage:**
This extension is rendered after the shipping options list and allows customers to select a delivery date if they won't be at home for the default delivery.

### 🎁 Gift Packaging

**Description:**
Adds gift packaging options to the checkout process. It allows customers to add a gift message, sender's name, recipient's name, and choose a packaging option.

**Configuration Options:**
- `OptionOne`, `OptionTwo`: Names of the packaging options
- `image_one`, `image_two`: Images for the packaging options
- `choice_title`: Title for the packaging choice section
- `section_title`: Title for the overall section
- `section_prompt`: Prompt text for enabling gift packaging
- `text_field_desc`: Description for the gift message field
- `background_appearance`: The background style (transparent, base, subdued)
- `icon_appearance`: The appearance style of the icon (base, accent, decorative, interactive, subdued, info, success, warning, critical, monochrome)
- `text_appearance`: The appearance style of the text (base, accent, decorative, interactive, subdued, info, success, warning, critical, monochrome)
- `choice_text_appearance`: The appearance style for the choice title text (base, accent, decorative, interactive, subdued, info, success, warning, critical, monochrome)

**Usage:**
This extension adds a gift packaging section to the checkout, allowing customers to add gift information and select packaging preferences.

### 🔍 Cart Attributes Debugger

**Description:**
A development tool that displays all cart attributes applied to the checkout. Essential for debugging and testing cart attribute functionality.

**Configuration Options:**
- Displays as informational message when no attributes are found
- Shows all attributes as key-value pairs
- Automatically renders in checkout block

**Usage:**
Add this extension to your checkout layout in the Shopify admin theme editor. It will display any cart attributes present during checkout, making it invaluable for development and testing.

### 📦 Custom Packaging Display

**Description:**
Displays selected packaging options with images, sample products, and gift messages. Provides a visual summary of packaging choices made during checkout.

**Configuration Options:**
- `title`: Main title for the display section
- `text_size`: Base text size for all elements
- `option1_name`, `option2_name`, `option3_name`: Names of packaging options
- `option1_image`, `option2_image`, `option3_image`: Images for packaging options
- `packaging_section_title`: Title for the packaging selection display
- `samples_section_title`: Title for sample products section
- `gift_message_section_title`: Title for gift message section
- Various size settings for different text elements

**Functionality:**
- Fetches product information via GraphQL API
- Displays selected packaging option with corresponding image
- Shows sample products (up to 2) with titles and images
- Displays gift messages when provided
- Handles loading states and error conditions
- Uses cart attributes: `_packaging_option`, `_sample_products`, `_gift_message`

**Usage:**
This extension automatically displays packaging information based on cart attributes set by other extensions in your checkout flow.

### 💸 Custom Discount Function

**Description:**
An advanced Shopify Function that applies configurable discounts to both cart lines and delivery options. Supports percentage-based discounts with custom messages.

**Functionality:**
- **Cart Line Discounts**: Applies product-level percentage discounts
- **Delivery Option Discounts**: Applies order-level percentage discounts
- **Configurable Parameters**: 
  - Order discount percentage (0-100%)
  - Product discount percentage (0-100%)
  - Custom discount messages
- **Metafield Integration**: Reads configuration from `$app:config` metafield
- **Multi-target Support**: Handles both `cart.lines.discounts.generate.run` and `cart.delivery-options.discounts.generate.run`

**Configuration Structure:**
```json
{
  "orderDiscountPercentage": 10,
  "productDiscountPercentage": 20,
  "orderDiscountMessage": "10% OFF ORDER",
  "productDiscountMessage": "20% OFF PRODUCT"
}
```

**Usage:**
This function runs automatically during checkout when discount conditions are met. Configure it through the Admin UI Extension or directly via metafields.

### ⚙️ Custom Discount Configuration (Admin UI Extension)

**Description:**
A React-based Admin UI Extension that provides a user-friendly interface for merchants to configure the Custom Discount Function parameters.

**Features:**
- **Form Validation**: Real-time validation with error messages
- **Live Preview**: Shows discount configuration as merchants type
- **FunctionSettings Integration**: Automatically manages metafield storage
- **Responsive Design**: Clean, professional interface using Shopify's Admin UI components
- **Percentage Validation**: Ensures discount percentages stay within 0-100% range
- **Message Validation**: Validates message length and prevents empty messages
- **Reset Functionality**: Allows merchants to reset to default values

**Configuration Options:**
- Order Discount Percentage (0-100%)
- Product Discount Percentage (0-100%)
- Order Discount Message (up to 100 characters)
- Product Discount Message (up to 100 characters)

**Validation Rules:**
- At least one discount type must have a percentage greater than 0%
- Discount percentages must be between 0% and 100%
- Discount messages cannot be empty and must be ≤100 characters

**Usage:**
This extension appears in the Shopify Admin when configuring discount functions. Navigate to the discount function settings page to access the configuration interface.

### 💰 Update Line Item Function

**Description:**
A function extension that modifies cart line item prices based on customer membership status and product customization. It can apply special member pricing and markups for customized products.

**Functionality:**
- Checks if the customer is a member (via customer metafield)
- Applies member pricing if available (via product metafield)
- Applies a 10% markup for customized products
- Handles currency conversion

**Usage:**
This extension automatically modifies prices in the cart based on the defined conditions without requiring any UI interaction.

## 🔧 Development Guidelines

### Modifying Existing Extensions

1. Navigate to the extension directory you want to modify
2. Edit the `src/Checkout.jsx` file (for UI extensions) or `src/run.js` (for function extensions)
3. Use the Shopify CLI to test your changes locally

### Creating New Extensions

1. Use the Shopify CLI to generate a new extension:
   ```shell
   npm run generate
   ```
2. Select the appropriate extension type
3. Implement your extension logic
4. Add the extension to your app's configuration

### Best Practices

- Keep UI extensions focused on a single purpose
- Use metafields for storing extension data
- Follow Shopify's design guidelines for a consistent checkout experience
- Test extensions thoroughly with different cart configurations

## 📤 Deployment

To deploy your app with its extensions to a Shopify store:

```shell
npm run deploy
```

For forced deployment (when updating configurations):

```shell
npm run deploy -- --force
```

This will build your extensions and deploy them to your Shopify Partners account. You can then install the app on your development or production store.

### Access Scopes

This app requires the following access scopes in `shopify.app.toml`:

```toml
[access_scopes]
scopes = "read_discounts,write_discounts,read_products,write_products,write_orders"
```

These scopes are required for:
- **read_discounts, write_discounts**: Custom discount function and admin UI
- **read_products, write_products**: Product information access for packaging display and sample products
- **write_orders**: Order modification capabilities

## 📖 Resources and References

- [Introduction to Shopify apps](https://shopify.dev/docs/apps/getting-started)
- [App authentication](https://shopify.dev/docs/apps/auth)
- [Shopify CLI](https://shopify.dev/docs/apps/tools/cli)
- [Shopify API Library documentation](https://github.com/Shopify/shopify-api-js#readme)
- [Checkout UI extension documentation](https://shopify.dev/api/checkout-extensions)
- [Function extensions documentation](https://shopify.dev/docs/api/functions)
