import {
  reactExtension,
  useAttributes,
  useSettings,
  View,
  BlockStack,
  Heading,
  Text,
  Divider,
  Banner
} from "@shopify/ui-extensions-react/checkout";

// Set up the extension target
export const CartAttributesDebugger = reactExtension(
  "purchase.checkout.block.render",
  () => <Extension />
);

function Extension() {
  // Get all cart attributes
  const attributes = useAttributes();
  
  // Use the merchant-defined settings to retrieve the extension's content
  const {
    main_heading: merchantMainHeading,
    banner_title: merchantBannerTitle,
    no_attributes_message: merchantNoAttributesMessage
  } = useSettings();
  
  // Set default values with fallbacks
  const mainHeading = merchantMainHeading ?? "Cart Attributes Debugger";
  const bannerTitle = merchantBannerTitle ?? "Cart Attributes";
  const noAttributesMessage = merchantNoAttributesMessage ?? "No cart attributes found.";
  
  // If no attributes, show a message
  if (!attributes || attributes.length === 0) {
    return (
      <Banner status="info" title={bannerTitle}>
        <Text>{noAttributesMessage}</Text>
      </Banner>
    );
  }
  
  // Display all attributes in a clean format
  return (
    <View border="base" padding="base" cornerRadius="base">
      <BlockStack spacing="tight">
        <Heading level="2">{mainHeading}</Heading>
        <Divider />
        {attributes.map((attribute) => (
          <BlockStack key={attribute.key} spacing="extraTight">
            <Text emphasis="bold">{attribute.key}:</Text>
            <Text appearance="subdued">{attribute.value}</Text>
          </BlockStack>
        ))}
      </BlockStack>
    </View>
  );
}
