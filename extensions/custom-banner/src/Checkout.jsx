import React from "react";
import {
  reactExtension,
  Banner,
  TextBlock,
  useSettings,
} from "@shopify/ui-extensions-react/checkout";

// Set the entry points for the extension
const checkoutBlock = reactExtension("purchase.checkout.block.render", () => <App />);
export { checkoutBlock };

const deliveryAddress = reactExtension("purchase.checkout.delivery-address.render-before", () => <App />);
export { deliveryAddress };

function App() {
  // Use the merchant-defined settings to retrieve the extension's content
  const {
    title: merchantTitle, 
    description: merchantDescription, 
    collapsible: setCollapsible, 
    status: merchantStatus,
    title_size: merchantTitleSize,
    description_size: merchantDescriptionSize
  } = useSettings();

  // Set default values if a merchant didn't configure the banner in the checkout editor
  const status = merchantStatus ?? 'info';
  const title = merchantTitle ?? 'Demo Custom Banner';
  const description = merchantDescription ?? null;
  const collapsible = setCollapsible ?? true;
  const titleSize = merchantTitleSize ?? 'medium';
  const descriptionSize = merchantDescriptionSize ?? 'base';

  // Render the banner
  return (
    <Banner title={title} status={status} collapsible={collapsible} size={titleSize}>
      {description && <TextBlock size={descriptionSize}>{description}</TextBlock>}
    </Banner>
  );
}
