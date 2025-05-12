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
  useSettings,
} from "@shopify/ui-extensions-react/checkout";

// Set the entry point for the extension
export default reactExtension("purchase.checkout.shipping-option-list.render-after", () => {
  return <App />;
});

function App() {
  // Use the merchant-defined settings to retrieve the extension's content
  const {
    title: merchantTitle,
    description: merchantDescription,
    banner_status: merchantBannerStatus,
    icon: merchantIcon,
    checkbox_text: merchantCheckboxText,
    text_field_label: merchantTextFieldLabel,
    background_appearance: merchantBackgroundAppearance,
    icon_appearance: merchantIconAppearance,
    text_appearance: merchantTextAppearance,
  } = useSettings();

  // Set default values
  const title = merchantTitle ?? "Add Delivery Instructions?";
  const description = merchantDescription ?? "Provide special instructions for delivery";
  const bannerStatus = merchantBannerStatus ?? "info";
  const iconSource = merchantIcon ?? "note";
  const checkboxText = merchantCheckboxText ?? "Yes, please see details:";
  const textFieldLabel = merchantTextFieldLabel ?? "Add Your Delivery Instructions";
  const backgroundAppearance = merchantBackgroundAppearance ?? "subdued";
  const iconAppearance = merchantIconAppearance ?? "monochrome";
  const textAppearance = merchantTextAppearance ?? "accent";

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
      applyMetafieldsChange({
        type: "removeMetafield",
        namespace: metafieldNamespace,
        key: metafieldKey,
      });
    }
  };

  // Render the extension components
  return (
    <BlockStack>
      {hasAddress2 && (
        <View maxInlineSize={700} background={bannerStatus === "info" ? backgroundAppearance : undefined} padding="base">
          <BlockStack spacing="loose">
            <InlineLayout blockAlignment="center" spacing="small100" columns={['auto', 'fill']}> 
              <Icon source={iconSource} appearance={iconAppearance}></Icon>
              <Text size="medium" appearance={textAppearance} emphasis="bold">
                {title}
              </Text>
            </InlineLayout>
            <Checkbox checked={checked} onChange={handleCheckboxChange}>
              <Text>{checkboxText}</Text>
            </Checkbox>
            
            {checked && (
              <TextField
                label={textFieldLabel}
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
            )}
          </BlockStack>
        </View>
      )}
    </BlockStack>
  );
}
