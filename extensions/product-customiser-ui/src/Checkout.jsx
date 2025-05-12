import {
  reactExtension,
  Banner,
  BlockStack,
  View,
  Checkbox,
  Text,
  TextBlock,
  TextField,
  BlockSpacer,
  useApi,
  useApplyCartLinesChange,
  useInstructions,
  useTranslate,
  useCartLineTarget,
  useSettings,
} from "@shopify/ui-extensions-react/checkout";
import { useEffect, useState } from "react";

// 1. Choose an extension target
export default reactExtension("purchase.checkout.cart-line-item.render-after", () => (
  <Extension />
));

function Extension() {
  const translate = useTranslate();
  const { extension } = useApi();
  const instructions = useInstructions();
  const applyCartLinesChange = useApplyCartLinesChange();
  const cartLine = useCartLineTarget();
  const { text_appearance: merchantTextAppearance } = useSettings();
  
  // Set default value
  const textAppearance = merchantTextAppearance ?? "subdued";

  // 2. Check instructions for feature availability, see https://shopify.dev/docs/api/checkout-ui-extensions/apis/cart-instructions for details
  if (!instructions.attributes.canUpdateAttributes) {
    // For checkouts such as draft order invoices, cart attributes may not be allowed
    // Consider rendering a fallback UI or nothing at all, if the feature is unavailable
    return (
      <Banner title="product-customiser-ui" status="warning">
        {translate("attributeChangesAreNotSupported")}
      </Banner>
    );
  }

  // 3. Check if the cart line is an accessory
  if (cartLine.merchandise.product.productType !== 'Accessories') {
    return null; // Do not render the UI if the product type is not 'Accessories'
  }

  // 4. Manage Checkbox and TextField State
  const [isChecked, setIsChecked] = useState(false);
  const [customText, setCustomText] = useState("");
  const [error, setError] = useState("");

  // 5. Handle Checkbox Change
  const onCheckboxChange = (checked) => {
    setIsChecked(checked);
    const newCustomText = checked ? customText : "";
    setCustomText(newCustomText);
    updateCartLineAttributes(checked, newCustomText);
  };

  // 6. Handle TextField Change
  const onTextFieldChange = (value) => {
    if (value.length > 25) {
      setError("Max 25 characters, please");
    } else {
      setError("");
      setCustomText(value);
      updateCartLineAttributes(isChecked, value);
    }
  };

  // 7. Update Cart Line Attributes
  const updateCartLineAttributes = async (isChecked, customText) => {
    // Create a CartLineUpdateChange object
    const change = {
      type: "updateCartLine",
      id: cartLine.id,
      attributes: [
        {
          key: "added_customisation",
          value: isChecked ? "true" : "false",
        },
        {
          key: "custom_text",
          value: customText,
        },
      ],
    };

    // Call the API to modify checkout
    const result = await applyCartLinesChange(change);
    console.log("applyCartLinesChange result", result);
  };

  // 8. Render a UI
  return (
    <BlockStack padding={"base"}>
      <View>
        <Checkbox onChange={onCheckboxChange} checked={isChecked}>
          <Text>Yes, add custom embroidery for small fee.</Text>
        </Checkbox>
      </View>
      {isChecked && (
        <View padding="base">
          <TextField
            label="Your Custom Text"
            value={customText}
            onChange={onTextFieldChange}
            required={isChecked}
            error={error}
          />
          <BlockSpacer spacing="loose" />
          <TextBlock size="small" emphasis="italic" appearance={textAppearance} inlineAlignment="end">{customText.length}/25</TextBlock> {/* Display character count */}
        </View>
      )}
    </BlockStack>
  );
}
