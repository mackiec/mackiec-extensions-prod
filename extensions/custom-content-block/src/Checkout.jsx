import React, { useState } from "react";
import {
  reactExtension,
  BlockStack,
  TextBlock,
  Text,
  useSettings,
  Disclosure,
  Pressable,
  InlineLayout,
  Icon,
  View,
  Image,
} from "@shopify/ui-extensions-react/checkout";

// Set the entry points for the extension
const checkoutBlock = reactExtension("purchase.checkout.block.render", () => <App />);
export { checkoutBlock };

function App() {
  // Use the merchant-defined settings to retrieve the extension's content
  const {title: merchantTitle, description: merchantDescription, image: merchantImage} = useSettings();

  // Set a default status for the banner if a merchant didn't configure the banner in the checkout editor
  const title = merchantTitle ?? 'Custom Title';
  const description = merchantDescription ?? 'Add an additional description';

  // State to control the open state of the disclosure
  const [openIds, setOpenIds] = useState([]);

  // Split the description into lines
  const descriptionLines = description.split('\n');

  // Render the block stack with text blocks inside a Disclosure
  return (
    <View border="base" padding="base" cornerRadius="base">
      <Disclosure onToggle={(open) => setOpenIds(open)}>
        <Pressable toggles="content" padding="base">
          <InlineLayout blockAlignment="start" spacing="base" columns={['auto', 'fill', 'auto']}>
            <Icon source="note" appearance="accent"/>
            <Text size="medium" emphasis="bold" appearance="interactive">
              {title}
            </Text>
            <Icon source={openIds.includes('content') ? "chevronUp" : "chevronDown"} appearance="accent" />
          </InlineLayout>
        </Pressable>
        <View id="content" padding="base">
          <BlockStack spacing="tight">
            {descriptionLines.map((line, index) => (
              <TextBlock key={index} size="medium">
                {line}
              </TextBlock>
            ))}
            {merchantImage && <Image source={merchantImage} />}
          </BlockStack>
        </View>
      </Disclosure>
    </View>
  );
}