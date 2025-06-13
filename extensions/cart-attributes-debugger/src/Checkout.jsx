import {
  reactExtension,
  useAttributes,
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
  
  // If no attributes, show a message
  if (!attributes || attributes.length === 0) {
    return (
      <Banner status="info" title="Cart Attributes">
        <Text>No cart attributes found.</Text>
      </Banner>
    );
  }
  
  // Display all attributes in a clean format
  return (
    <View border="base" padding="base" cornerRadius="base">
      <BlockStack spacing="tight">
        <Heading level="2">Cart Attributes Debugger</Heading>
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
