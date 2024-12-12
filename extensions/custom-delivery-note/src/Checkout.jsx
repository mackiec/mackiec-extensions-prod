import React, { useState } from "react";
import {
  reactExtension,
  TextField,
  BlockStack,
  useApplyMetafieldsChange,
  useMetafield,
  Checkbox,
  Text,
  Banner,
  BlockSpacer,
  InlineLayout,
  Icon,
  View,
  useShippingAddress,
} from "@shopify/ui-extensions-react/checkout";

// Set the entry point for the extension
export default reactExtension("purchase.checkout.shipping-option-list.render-after", () => {
  return <App />;
});

function App() {
  // Set up the checkbox state
  const [checked, setChecked] = useState(false);

  // Define the metafield namespace and key
  const metafieldNamespace = "custom";
  const metafieldKey = "delivery_instructions";

  // Get a reference to the metafield
  const deliveryInstructions = useMetafield({
    namespace: metafieldNamespace,
    key: metafieldKey,
  });
  // Set a function to handle updating a metafield
  const applyMetafieldsChange = useApplyMetafieldsChange();

  // Get the shipping address
  const shippingAddress = useShippingAddress();

  // Check if 'address2' is provided in the Shipping Address form
  const hasAddress2 = shippingAddress && shippingAddress.address2;

// Handle when the checkbox is checked. 
  // If the checkbox is unchecked by the buyer, unset (delete) the metafield
  const handleCheckboxChange = (isChecked) => {
    setChecked(isChecked);
    if (!isChecked) {
      updateMetafield({
        type: "removeMetafield",
        namespace: METAFIELD_NAMESPACE,
        key: METAFIELD_KEY,
      });
    }
  };

  // Render the extension components
  return (
    <BlockStack>
      {hasAddress2 && (
        <View maxInlineSize={700}>
          <Banner status="info">
            <InlineLayout blockAlignment="center" spacing="small100" columns={['auto', 'fill']}> 
              <Icon source="note" appearance="monochrome"></Icon>
              <Text size="medium" appearance="accent" emphasis="bold">
                Add Delivery Instructions?
              </Text>
            </InlineLayout>
            <BlockSpacer spacing="loose" />
            <Checkbox checked={checked} onChange={handleCheckboxChange}>
              <Text>Yes, please see details:</Text>
            </Checkbox>
            
            {checked && (
              <>
                <BlockSpacer spacing="loose" />
                <TextField
                  label="Add Your Delivery Instructions"
                  multiline={3}
                  onChange={(value) => {
                    // Apply the change to the metafield
                    applyMetafieldsChange({
                      type: "updateMetafield",
                      namespace: metafieldNamespace,
                      key: metafieldKey,
                      valueType: "string",
                      value,
                    });
                  }}
                  value={deliveryInstructions?.value}
                />
              </>
            )}
          </Banner>
        </View>
      )}
    </BlockStack>
  );
}
