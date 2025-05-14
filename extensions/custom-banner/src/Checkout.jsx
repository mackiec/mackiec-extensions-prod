import {
  reactExtension,
  Banner,
  Text,
  TextBlock,
  useSettings,
  BlockSpacer,
  Heading,
  InlineLayout,
} from "@shopify/ui-extensions-react/checkout";
import { View } from "@shopify/ui-extensions/checkout";

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
    description_size: merchantDescriptionSize
  } = useSettings();

  // Set default values if a merchant didn't configure the banner in the checkout editor
  const status = merchantStatus ?? 'info';
  const title = merchantTitle ?? 'Banner Title';
  const description = merchantDescription ?? 'Your custom description goes here.';
  const collapsible = setCollapsible ?? true;
  const descriptionSize = merchantDescriptionSize ?? 'base';

  // Render the banner
  return (
    <Banner status={status} collapsible={collapsible} title={title}>
      <View padding="none">
          {description && <TextBlock size={descriptionSize}>{description}</TextBlock>}
        </View>
    </Banner>
  );
}
